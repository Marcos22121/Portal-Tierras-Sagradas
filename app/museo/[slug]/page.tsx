import { client } from '@/lib/sanity.client';
import { museumItemBySlugQuery } from '@/lib/sanity.queries';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

const TYPE_LABELS: Record<string, string> = {
  armamento: 'Armamento Sagrado',
  reliquia: 'Reliquia Arcana',
  runa: 'Runa',
};

export default async function MuseoItemPage({ params }: { params: { slug: string } }) {
  const item = await client.fetch(museumItemBySlugQuery, { slug: params.slug });
  if (!item) notFound();

  // Imagen de fondo (headerImage o coverImage)
  const heroImgUrl = item.headerImage 
    ? urlForImage(item.headerImage)?.width(1600).height(900).url() 
    : (item.coverImage ? urlForImage(item.coverImage)?.width(1600).height(900).url() : null);
    
  const coverUrl = item.coverImage ? urlForImage(item.coverImage)?.width(800).height(800).url() : null;
  const bearerImgUrl = item.bearer?.images?.[0] ? urlForImage(item.bearer.images[0])?.width(200).height(200).url() : null;

  return (
    <div className="min-h-screen bg-obsidian text-white pt-[80px]">
      {/* ── HERO HEADER ─── */}
      <div className="w-full relative h-[40vh] md:h-[55vh] flex-shrink-0 flex items-end justify-center overflow-hidden border-b border-gold-dark/30">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-[#0a0a0a] z-10" />
        {heroImgUrl && (
          <img src={heroImgUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover origin-center scale-105 opacity-40 mix-blend-luminosity" />
        )}
        
        <div className="relative z-20 w-full px-6 md:px-12 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-[2440px] mx-auto">
          <div className="flex flex-col items-start max-w-4xl">
            <span className="font-cinzel text-xs tracking-widest text-gold-light px-3 py-1 bg-gold-dark/20 border border-gold-dark/40 uppercase mb-3 shadow-[0_0_10px_rgba(201,168,76,0.2)] gold-glow-hover">
              {TYPE_LABELS[item.itemType] || item.itemType}
            </span>
            <h1 className="font-cinzel text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] leading-tight gold-glow-hover">
              {item.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ─── */}
      <div className="w-full mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-20 max-w-[2440px]">
        
        {/* IZQUIERDA: Imagen 1:1 y Stats */}
        <div className="w-full lg:w-[40%] flex flex-col gap-8">
          <div className="w-full aspect-square relative overflow-hidden bg-[radial-gradient(circle,rgba(201,168,76,0.15)_0%,transparent_70%)] border border-gold-dark/20 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center p-8 md:p-16 group gold-glow-hover">
            <div className="absolute inset-0 bg-gold-light/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            {coverUrl ? (
              <img src={coverUrl} alt={item.name} className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <span className="text-gold-dark/30 text-[10rem] absolute">✦</span>
            )}
          </div>

          {/* Estadísticas en cuadros premium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.origin && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-lg flex flex-col">
                <span className="font-cinzel text-[10px] text-gray-500 uppercase tracking-widest mb-1">Origen</span>
                <span className="font-crimson text-gold-light font-bold text-lg">{item.origin}</span>
              </div>
            )}
            {item.creator && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-lg flex flex-col">
                <span className="font-cinzel text-[10px] text-gray-500 uppercase tracking-widest mb-1">Creador</span>
                <span className="font-crimson text-gold-light font-bold text-lg">{item.creator}</span>
              </div>
            )}
            {item.bearer && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-lg flex flex-col col-span-full">
                <span className="font-cinzel text-[10px] text-gray-500 uppercase tracking-widest mb-1">Poseedor Actual</span>
                <Link href={`/biografias/${item.bearer.slug.current}`} className="font-crimson text-gold-light hover:text-gold-bright hover:underline text-xl transition-colors flex items-center gap-3 mt-1">
                  {bearerImgUrl && <img src={bearerImgUrl} alt={item.bearer.name} className="w-10 h-10 rounded-full border border-gold-dark/30 object-cover" />}
                  {item.bearer.name}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* DERECHA: Descripción e Historia */}
        <div className="w-full lg:w-[60%] flex flex-col">
          <h4 className="font-cinzel text-3xl text-gold-light mb-8 flex items-center gap-4 border-b border-gold-dark/20 pb-4 gold-glow-hover">
            <span className="text-gold-dark text-xl drop-shadow-lg">✦</span> Registros del Artefacto
          </h4>
          <div className="space-y-6 text-gray-300 font-crimson text-xl md:text-2xl leading-[1.7] text-justify opacity-90 prose-gold">
            <PortableText value={item.description} />
          </div>
          
          <div className="mt-16 flex justify-center w-full opacity-30">
            <span className="text-gold-dark text-sm tracking-[1em]">✧ ✦ ✧</span>
          </div>
        </div>

      </div>

      {/* Botón volver */}
      <div className="max-w-[2440px] mx-auto px-6 md:px-12 py-8">
          <Link href="/#museo" className="font-cinzel text-sm text-gold-muted hover:text-gold-light transition-colors tracking-widest uppercase items-center flex gap-2 gold-glow-hover">
            <span className="text-lg">←</span> Volver al Museo
          </Link>
      </div>
    </div>
  );
}
