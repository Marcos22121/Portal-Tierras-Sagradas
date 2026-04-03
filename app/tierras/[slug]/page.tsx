import { client } from '@/lib/sanity.client';
import { landBySlugQuery } from '@/lib/sanity.queries';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

const LAND_TYPE_LABELS: Record<string, string> = {
  'punto-de-interes': '🏛 Punto de Interés',
  'region': '🌲 Región',
  'pueblo-ciudad': '🏘 Pueblo / Ciudad',
};

const DANGER_COLORS: Record<string, string> = {
  'bajo': 'text-green-400',
  'medio': 'text-yellow-400',
  'alto': 'text-orange-400',
  'extremo': 'text-red-500',
  'desconocido': 'text-gray-400',
};

export default async function LandPage({ params }: { params: { slug: string } }) {
  const land = await client.fetch(landBySlugQuery, { slug: params.slug });
  if (!land) notFound();

  const heroImgUrl = land.images?.[0] ? urlForImage(land.images[0])?.width(1400).height(800).url() : null;
  const rulerImgUrl = land.ruler?.images?.[0] ? urlForImage(land.ruler.images[0])?.width(200).height(200).url() : null;

  return (
    <main className="min-h-screen bg-obsidian text-white pt-[80px]">
      {/* ── HERO HEADER ─── */}
      <div className="w-full relative h-[45vh] md:h-[60vh] flex-shrink-0 flex items-end justify-center overflow-hidden border-b border-gold-dark/30">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a] z-10" />
        {heroImgUrl && (
          <img src={heroImgUrl} alt={land.name} className="absolute inset-0 w-full h-full object-cover origin-center scale-105 mix-blend-screen opacity-80" />
        )}
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('/images/ui/texture-dark.png')] bg-cover mix-blend-overlay" />

        <div className="relative z-20 w-full px-6 md:px-16 pb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center md:items-start max-w-4xl">
            {land.title && (
              <span className="font-cinzel text-sm md:text-base tracking-[0.4em] text-gold-muted uppercase mb-3 px-4 py-1.5 border border-gold-dark/30 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(201,168,76,0.1)]">
                {land.title}
              </span>
            )}
            <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-bold tracking-[0.05em] uppercase text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] mb-2" style={{ textShadow: '0 0 40px rgba(255,215,0,0.3), 0 5px 20px rgba(0,0,0,0.9)' }}>
              {land.name}
            </h1>
            <span className="font-cinzel text-xs tracking-widest text-gold-muted uppercase mt-2">
              {LAND_TYPE_LABELS[land.landType] || land.landType}
            </span>
          </div>

          {/* Stats flotantes */}
          <div className="hidden md:flex flex-col gap-3 min-w-[280px] mb-2">
            {land.climate && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-row items-center justify-between">
                <span className="font-cinzel text-[11px] text-gray-400 uppercase tracking-widest">Clima</span>
                <span className="font-cinzel text-sm text-gold-light font-bold uppercase drop-shadow-[0_0_5px_rgba(201,168,76,0.4)]">{land.climate}</span>
              </div>
            )}
            {land.biome && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-row items-center justify-between">
                <span className="font-cinzel text-[11px] text-gray-400 uppercase tracking-widest">Bioma</span>
                <span className="font-cinzel text-sm text-gold-light font-bold uppercase drop-shadow-[0_0_5px_rgba(201,168,76,0.4)]">{land.biome}</span>
              </div>
            )}
            {land.dangerLevel && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-row items-center justify-between">
                <span className="font-cinzel text-[11px] text-gray-400 uppercase tracking-widest">Peligrosidad</span>
                <span className={`font-cinzel text-sm font-bold uppercase ${DANGER_COLORS[land.dangerLevel] || 'text-gray-400'}`}>{land.dangerLevel}</span>
              </div>
            )}
            {land.ruler && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-row items-center justify-between">
                <span className="font-cinzel text-[11px] text-gray-400 uppercase tracking-widest">Gobernante</span>
                <Link href={`/biografias/${land.ruler.slug.current}`} className="font-cinzel text-sm text-gold-light font-bold uppercase hover:text-gold-bright hover:underline transition-colors flex items-center gap-2">
                  {rulerImgUrl && <img src={rulerImgUrl} alt={land.ruler.name} className="w-6 h-6 rounded-full border border-gold-dark/30 object-cover" />}
                  {land.ruler.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENIDO PRINCIPAL ─── */}
      <div className="w-full mx-auto px-6 md:px-16 py-12 md:py-20 flex flex-col lg:flex-row gap-16 relative z-20 max-w-[1400px]">
        {/* Descripción inmersiva */}
        <div className="w-full lg:w-3/5 flex flex-col">
          <h4 className="font-cinzel text-3xl text-gold-light mb-8 flex items-center gap-4 border-b border-gold-dark/20 pb-4">
            <span className="text-gold-dark text-xl drop-shadow-lg">✦</span> Archivos del Reino
          </h4>
          <div className="space-y-6 text-gray-300 font-crimson text-xl leading-[1.8] text-justify opacity-90 prose-gold">
            <PortableText value={land.description} />
          </div>

          {/* Ubicación padre */}
          {land.parentLocation && (
            <div className="mt-8 p-4 bg-black/40 border border-gold-dark/15 rounded-sm">
              <span className="font-cinzel text-xs text-gray-500 uppercase tracking-widest">Ubicado en:</span>
              <Link href={`/tierras/${land.parentLocation.slug.current}`} className="block font-cinzel text-lg text-gold-light hover:text-gold-bright transition-colors mt-1">
                {land.parentLocation.name} →
              </Link>
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="w-full lg:w-2/5 flex flex-col gap-12">
          {/* Stats móvil */}
          <div className="md:hidden flex flex-col gap-3 w-full border-t border-gold-dark/20 pt-8">
            {land.climate && (
              <div className="bg-black/40 border border-gold-dark/30 p-4 flex flex-row items-center justify-between shadow-md">
                <span className="font-cinzel text-[10px] text-gray-400 uppercase tracking-widest">Clima</span>
                <span className="font-cinzel text-sm text-gold-light font-bold uppercase">{land.climate}</span>
              </div>
            )}
            {land.biome && (
              <div className="bg-black/40 border border-gold-dark/30 p-4 flex flex-row items-center justify-between shadow-md">
                <span className="font-cinzel text-[10px] text-gray-400 uppercase tracking-widest">Bioma</span>
                <span className="font-cinzel text-sm text-gold-light font-bold uppercase">{land.biome}</span>
              </div>
            )}
            {land.dangerLevel && (
              <div className="bg-black/40 border border-gold-dark/30 p-4 flex flex-row items-center justify-between shadow-md">
                <span className="font-cinzel text-[10px] text-gray-400 uppercase tracking-widest">Peligrosidad</span>
                <span className={`font-cinzel text-sm font-bold uppercase ${DANGER_COLORS[land.dangerLevel] || 'text-gray-400'}`}>{land.dangerLevel}</span>
              </div>
            )}
          </div>

          {/* Sub-ubicaciones */}
          {land.childLocations && land.childLocations.length > 0 && (
            <div className="bg-black/30 border border-gold-dark/10 p-6 md:p-8 rounded-sm shadow-inner">
              <h4 className="font-cinzel text-2xl text-gold-light mb-8 flex items-center gap-3">
                <span className="text-gold-dark text-lg drop-shadow-[0_0_5px_rgba(201,168,76,1)]">✧</span> Puntos de Interés
              </h4>
              <div className="flex flex-col gap-5">
                {land.childLocations.map((child: any) => (
                  <Link key={child._id} href={`/tierras/${child.slug.current}`} className="group relative flex items-center gap-5 p-4 bg-black/50 border border-gold-dark/20 hover:bg-[#0c0c0c] hover:border-gold-dark/60 transition-all rounded-sm cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-12 h-12 rounded-full border border-gold-dark/40 bg-black flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform">
                      <span className="text-gold-muted text-lg font-bold group-hover:text-white transition-colors">⟡</span>
                    </div>
                    <div className="flex flex-col z-10">
                      <span className="font-cinzel text-[17px] text-gold-light group-hover:text-gold-bright transition-colors tracking-widest drop-shadow-md">{child.name}</span>
                      <span className="font-crimson text-sm text-gray-400 italic mt-1 group-hover:text-gray-300 transition-colors uppercase tracking-widest">{LAND_TYPE_LABELS[child.landType] || child.landType}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Galería */}
      {land.images && land.images.length > 1 && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-12 border-t border-gold-dark/10">
          <h4 className="font-cinzel text-xl text-gold-light mb-8 flex items-center gap-3"><span className="text-gold-dark text-sm">✦</span> Galería</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {land.images.slice(1).map((img: any, idx: number) => {
              const imgUrl = urlForImage(img)?.width(600).height(400).url();
              return (
                <div key={idx} className="aspect-[3/2] overflow-hidden border border-gold-dark/20 rounded-sm shadow-lg bg-black/80">
                  {imgUrl && <img src={imgUrl} alt={img.caption || land.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 opacity-90 hover:opacity-100" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Volver */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <Link href="/#tierras" className="font-cinzel text-sm text-gold-muted hover:text-gold-light transition-colors tracking-widest uppercase">← Volver a Tierras</Link>
      </div>
    </main>
  );
}
