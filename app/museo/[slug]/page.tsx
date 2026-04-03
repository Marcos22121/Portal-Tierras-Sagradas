import { client } from '@/lib/sanity.client';
import { museumItemBySlugQuery } from '@/lib/sanity.queries';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

const TYPE_LABELS: Record<string, string> = {
  armamento: '⚔ Armamento Sagrado',
  reliquia: '💎 Reliquia Arcana',
  runa: '✦ Runa',
};

export default async function MuseoItemPage({ params }: { params: { slug: string } }) {
  const item = await client.fetch(museumItemBySlugQuery, { slug: params.slug });
  if (!item) notFound();

  const coverUrl = item.coverImage ? urlForImage(item.coverImage)?.width(800).height(800).url() : null;
  const bearerImgUrl = item.bearer?.images?.[0] ? urlForImage(item.bearer.images[0])?.width(200).height(200).url() : null;

  return (
    <main className="min-h-screen bg-obsidian text-white pt-[80px]">
      <div className="relative w-full max-w-[1200px] mx-auto flex flex-col md:flex-row border border-gold-light/20 rounded-sm overflow-hidden mt-8 md:mt-16 shadow-[0_0_120px_rgba(201,168,76,0.15)]">
        {/* Línea dorada superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-light to-transparent opacity-80 z-20" />

        {/* IZQUIERDA: Imagen 1:1 del artefacto */}
        <div className="w-full h-72 md:w-[45%] md:h-auto md:min-h-[70vh] relative overflow-hidden bg-[#030303] flex-shrink-0 border-b md:border-b-0 md:border-r border-[rgba(201,168,76,0.1)] flex items-center justify-center p-6 md:p-14">
          <div className="absolute inset-0 bg-gradient-radial from-gold-dark/15 to-transparent" />
          {coverUrl ? (
            <img src={coverUrl} alt={item.name} className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(201,168,76,0.3)]" />
          ) : (
            <span className="text-gold-dark/30 text-[6rem] md:text-[10rem] absolute drop-shadow-2xl">✦</span>
          )}
        </div>

        {/* DERECHA: Datos del artefacto */}
        <div className="w-full md:w-[55%] p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col items-start text-left relative">
          {/* Etiqueta de tipo */}
          <span className="font-cinzel text-xs tracking-widest text-gold-light px-3 py-1 bg-gold-dark/20 border border-gold-dark/40 uppercase mb-4 shadow-[0_0_10px_rgba(201,168,76,0.2)]">
            {TYPE_LABELS[item.itemType] || item.itemType}
          </span>

          <h1 className="font-cinzel text-2xl lg:text-4xl xl:text-5xl font-bold tracking-wider text-gold-light mb-6 drop-shadow-md leading-tight">
            {item.name}
          </h1>

          {/* Estadísticas */}
          <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 mb-8 bg-black/50 p-6 border border-gold-dark/20 rounded-sm">
            {item.origin && (
              <div className="flex flex-col">
                <span className="font-cinzel text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">Origen</span>
                <span className="font-crimson text-gold-muted text-base sm:text-lg">{item.origin}</span>
              </div>
            )}
            {item.creator && (
              <div className="flex flex-col">
                <span className="font-cinzel text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">Creador</span>
                <span className="font-crimson text-gold-muted text-base sm:text-lg">{item.creator}</span>
              </div>
            )}
            {item.bearer && (
              <div className="flex flex-col col-span-2">
                <span className="font-cinzel text-[10px] sm:text-xs text-gray-500 uppercase tracking-[0.2em] mb-1">Poseedor</span>
                <Link href={`/biografias/${item.bearer.slug.current}`} className="font-crimson text-gold-light hover:text-gold-bright hover:underline text-base sm:text-lg transition-colors flex items-center gap-3">
                  {bearerImgUrl && <img src={bearerImgUrl} alt={item.bearer.name} className="w-8 h-8 rounded-full border border-gold-dark/30 object-cover" />}
                  {item.bearer.name}
                </Link>
              </div>
            )}
          </div>

          {/* Descripción */}
          <h4 className="font-cinzel text-lg text-gold-dark mb-4 flex items-center gap-3"><span className="text-gold-dark/50 text-sm">✦</span> Registros del Artefacto</h4>
          <div className="space-y-4 mb-8 text-gray-300 font-crimson text-base md:text-lg leading-relaxed text-justify opacity-90 pb-8 prose-gold">
            <PortableText value={item.description} />
          </div>

          <div className="mt-auto pt-6 flex justify-center w-full opacity-60 border-t border-gold-dark/10">
            <span className="text-gold-dark text-xs sm:text-sm tracking-[0.5em]">✧ ✦ ✧</span>
          </div>
        </div>
      </div>

      {/* Botón volver */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Link href="/#museo" className="font-cinzel text-sm text-gold-muted hover:text-gold-light transition-colors tracking-widest uppercase">← Volver al Museo</Link>
      </div>
    </main>
  );
}
