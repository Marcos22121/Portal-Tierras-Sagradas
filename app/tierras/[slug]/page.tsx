import { client } from '@/lib/sanity.client';
import { landBySlugQuery } from '@/lib/sanity.queries';
import { urlForImage } from '@/lib/sanity.image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import InteractiveGallery from '@/components/articles/InteractiveGallery';
import LandContent from '@/components/articles/LandContent';

export const revalidate = 60;

const LAND_TYPE_LABELS: Record<string, string> = {
  'punto-de-interes': 'Punto de Interés',
  'region': 'Región',
  'pueblo-ciudad': 'Pueblo / Ciudad',
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

  // Consolidar todas las imágenes únicas para la galería interactiva
  const galleryImages = [
    ...(land.headerImage ? [land.headerImage] : []),
    ...(land.images || []),
  ].filter((img, index, self) => 
    index === self.findIndex((t) => t.asset?._ref === img.asset?._ref)
  );

  const heroImgUrl = land.headerImage 
    ? urlForImage(land.headerImage)?.width(1600).height(900).url() 
    : (land.images?.[0] ? urlForImage(land.images[0])?.width(1600).height(900).url() : null);
  
  const sideImgUrl = land.images?.[1] ? urlForImage(land.images[1])?.width(600).height(900).url() : null;
  const rulerImgUrl = land.ruler?.images?.[0] ? urlForImage(land.ruler.images[0])?.width(200).height(200).url() : null;

  return (
    <div className="min-h-screen bg-obsidian text-white pt-[80px]">
      {/* ── HERO HEADER ─── */}
      <div className="w-full relative h-[50vh] md:h-[65vh] flex-shrink-0 flex items-end justify-center overflow-hidden border-b border-gold-dark/30">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a] z-10" />
        {heroImgUrl && (
          <img src={heroImgUrl} alt={land.name} className="absolute inset-0 w-full h-full object-cover origin-center scale-105 opacity-80" />
        )}
        <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-conic-gradient(rgba(201,168,76,0.03) 0% 25%, transparent 0% 50%)', backgroundSize: '4px 4px' }} />

        <div className="relative z-20 w-full px-6 md:px-12 pb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-[92vw] mx-auto">
          <div className="flex flex-col items-center md:items-start max-w-4xl">
            {land.title && (
              <span className="font-cinzel text-sm md:text-base tracking-[0.4em] text-gold-muted uppercase mb-3 px-4 py-1.5 border border-gold-dark/30 bg-black/40 backdrop-blur-sm shadow-[0_0_15px_rgba(201,168,76,0.1)] gold-glow-hover">
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
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-row items-center justify-between gold-glow-hover">
                <span className="font-cinzel text-[11px] text-gray-400 uppercase tracking-widest">Clima</span>
                <span className="font-cinzel text-sm text-gold-light font-bold uppercase drop-shadow-[0_0_5px_rgba(201,168,76,0.4)]">{land.climate}</span>
              </div>
            )}
            {land.biome && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-row items-center justify-between gold-glow-hover">
                <span className="font-cinzel text-[11px] text-gray-400 uppercase tracking-widest">Bioma</span>
                <span className="font-cinzel text-sm text-gold-light font-bold uppercase drop-shadow-[0_0_5px_rgba(201,168,76,0.4)]">{land.biome}</span>
              </div>
            )}
            {land.dangerLevel && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-row items-center justify-between gold-glow-hover">
                <span className="font-cinzel text-[11px] text-gray-400 uppercase tracking-widest">Peligrosidad</span>
                <span className={`font-cinzel text-sm font-bold uppercase ${DANGER_COLORS[land.dangerLevel] || 'text-gray-400'}`}>{land.dangerLevel}</span>
              </div>
            )}
            {land.ruler && (
              <div className="bg-black/60 backdrop-blur-md border border-gold-dark/30 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-row items-center justify-between gold-glow-hover">
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
      <div className="w-full mx-auto px-6 md:px-12 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative z-20 max-w-[92vw]">
        {/* Descripción inmersiva - 100% Width */}
        <LandContent 
          description={land.description} 
          sideImgUrl={sideImgUrl} 
          landName={land.name} 
        />

        {/* Panel lateral REORGANIZADO a lo ancho para no apretar */}
        {((land.childLocations && land.childLocations.length > 0) || land.parentLocation) && (
          <div className="lg:col-span-12 flex flex-col md:flex-row gap-12 mt-12 bg-black/20 p-8 border border-gold-dark/10 rounded-sm shadow-2xl backdrop-blur-md">
            {/* Sub-ubicaciones (Si existen) */}
            {land.childLocations && land.childLocations.length > 0 && (
              <div className="flex-grow w-full md:w-2/3">
                <h4 className="font-cinzel text-xl text-gold-light mb-8 flex items-center gap-3 gold-glow-hover">
                  <span className="text-gold-dark text-lg drop-shadow-[0_0_5px_rgba(201,168,76,1)]">✧</span> Puntos de Interés
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {land.childLocations.map((child: any) => (
                    <Link key={child._id} href={`/tierras/${child.slug.current}`} className="group relative flex items-center gap-4 p-4 bg-black/40 border border-gold-dark/15 hover:bg-[#0c0c0c] hover:border-gold-dark/60 transition-all rounded-sm cursor-pointer gold-glow-hover">
                      <div className="w-10 h-10 rounded-full border border-gold-dark/40 bg-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <span className="text-gold-muted text-sm font-bold group-hover:text-white transition-colors">⟡</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-cinzel text-base text-gold-light group-hover:text-gold-bright transition-colors tracking-widest">{child.name}</span>
                        <span className="font-crimson text-xs text-gray-400 italic uppercase tracking-widest leading-none mt-1">{LAND_TYPE_LABELS[child.landType] || child.landType}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Ubicación padre (Como un panel extra) */}
            {land.parentLocation && (
              <div className="w-full md:w-1/3 flex flex-col justify-center gap-4 bg-gold-dark/5 p-6 border border-gold-dark/20 relative overflow-hidden group">
                <div className="text-gold-dark absolute -right-6 -bottom-6 text-7xl opacity-10 font-cinzel select-none group-hover:scale-110 transition-transform">✦</div>
                <span className="font-cinzel text-xs text-gold-dark/50 uppercase tracking-widest">Pertenece a:</span>
                <Link href={`/tierras/${land.parentLocation.slug.current}`} className="block font-cinzel text-2xl text-gold-light hover:text-gold-bright transition-colors gold-glow-hover">
                  {land.parentLocation.name} →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Galería */}
      {galleryImages.length > 0 && (
        <div className="max-w-[92vw] mx-auto px-6 md:px-12 py-12 border-t border-gold-dark/10">
          <h4 className="font-cinzel text-xl text-gold-light mb-8 flex items-center gap-3 gold-glow-hover">
            <span className="text-gold-dark text-sm">✦</span> Galería del Reino
          </h4>
          <InteractiveGallery images={galleryImages} landName={land.name} />
        </div>
      )}
 
      {/* Volver */}
      <div className="max-w-[92vw] mx-auto px-6 md:px-12 py-8">
        <Link href="/#tierras" className="font-cinzel text-sm text-gold-muted hover:text-gold-light transition-colors tracking-widest uppercase items-center flex gap-2 gold-glow-hover">
          <span className="text-lg">←</span> Volver a Tierras
        </Link>
      </div>

    </div>
  );
}
