import { client } from '@/lib/sanity.client';
import { biographyBySlugQuery } from '@/lib/sanity.queries';
import { urlForImage } from '@/lib/sanity.image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export default async function BiographyPage({ params }: { params: { slug: string } }) {
  const bio = await client.fetch(biographyBySlugQuery, { slug: params.slug });
  if (!bio) notFound();

  const mainImgUrl = bio.images?.[0] ? urlForImage(bio.images[0])?.width(800).height(1200).url() : null;

  return (
    <main className="min-h-screen bg-obsidian text-white pt-[80px]">
      {/* ── HERO HEADER ─── */}
      <div className="relative w-full max-w-[1400px] mx-auto flex flex-col md:flex-row border-b border-gold-dark/20">
        {/* Imagen izquierda */}
        <div className="w-full h-[50vh] md:w-[40%] lg:w-[45%] md:h-[85vh] relative overflow-hidden bg-black/80 flex-shrink-0 border-b md:border-b-0 md:border-r border-[rgba(201,168,76,0.15)] flex items-center justify-center">
          {mainImgUrl && (
            <img src={mainImgUrl} alt={bio.name} className="absolute inset-0 w-full h-full object-cover lg:object-top opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-r" />
          <span className="text-gold-dark/10 text-9xl absolute z-[-1]">✧</span>
        </div>

        {/* Contenido derecho */}
        <div className="w-full md:w-[60%] lg:w-[55%] p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col items-start text-left">
          {/* Título decorativo */}
          {bio.title && (
            <span className="font-crimson italic text-gold-muted text-sm tracking-widest uppercase mb-2">{bio.title}</span>
          )}
          <span className="font-crimson italic text-gray-400 mb-1 lg:text-lg tracking-widest uppercase">{bio.shortDescription || ''}</span>
          <h1
            className="font-cinzel text-4xl lg:text-6xl font-bold tracking-[0.1em] uppercase mb-10 pb-6 border-b border-gold-dark/20 w-full"
            style={{
              background: 'var(--gradient-gold)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {bio.name}
          </h1>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-3 mb-8">
            {bio.faction && (
              <span className="font-cinzel text-[10px] px-3 py-1 border border-gold-dark/30 bg-black/50 text-gold-muted uppercase tracking-widest">
                Facción: {bio.faction}
              </span>
            )}
            {bio.religion && (
              <span className="font-cinzel text-[10px] px-3 py-1 border border-gold-dark/30 bg-black/50 text-gold-muted uppercase tracking-widest">
                Religión: {bio.religion}
              </span>
            )}
            {bio.placeOfOrigin && (
              <span className="font-cinzel text-[10px] px-3 py-1 border border-gold-dark/30 bg-black/50 text-gold-muted uppercase tracking-widest">
                Origen: {bio.placeOfOriginRef ? (
                  <Link href={`/tierras/${bio.placeOfOriginRef.slug.current}`} className="text-gold-light hover:underline">{bio.placeOfOrigin}</Link>
                ) : bio.placeOfOrigin}
              </span>
            )}
          </div>

          {/* Biografía */}
          <h4 className="font-cinzel text-xl text-gold-light mb-4 flex items-center gap-3"><span className="text-gold-dark text-sm">✦</span> Biografía</h4>
          <div className="space-y-4 mb-10 text-gray-300 font-crimson text-lg leading-relaxed text-justify opacity-90 prose-gold">
            <PortableText value={bio.biography} />
          </div>

          {/* Características */}
          {bio.characteristics && bio.characteristics.length > 0 && (
            <>
              <h4 className="font-cinzel text-xl text-gold-light mb-4 flex items-center gap-3"><span className="text-gold-dark text-sm">✦</span> Características</h4>
              <ul className="mb-12 font-crimson text-gray-300 text-lg space-y-3 pl-4 opacity-90">
                {bio.characteristics.map((char: string, idx: number) => (
                  <li key={idx} className="relative"><span className="absolute -left-4 text-gold-dark">·</span> {char}</li>
                ))}
              </ul>
            </>
          )}

          {/* Equipamiento */}
          {bio.equipment && bio.equipment.length > 0 && (
            <div className="mt-4 pt-8 w-full border-t border-gold-dark/20">
              <h4 className="font-cinzel text-xl text-gold-light mb-6 flex items-center gap-3"><span className="text-gold-dark text-sm">✦</span> Armamento y Artefactos</h4>
              <div className="flex flex-col gap-6 w-full">
                {bio.equipment.map((item: any) => {
                  const itemImgUrl = item.coverImage ? urlForImage(item.coverImage)?.width(200).height(200).url() : null;
                  return (
                    <div key={item._id} className="flex flex-col sm:flex-row gap-6 items-start bg-black/40 border border-[rgba(201,168,76,0.1)] p-6 rounded-sm w-full">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 border border-gold-dark/20 rounded shadow-md overflow-hidden flex items-center justify-center bg-black/60">
                        {itemImgUrl ? (
                          <img src={itemImgUrl} alt={item.name} className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <span className="text-gold-dark/40 text-2xl">✦</span>
                        )}
                      </div>
                      <div className="flex flex-col flex-grow items-start h-full">
                        <h5 className="font-cinzel text-lg text-gold-light mb-2">{item.name}</h5>
                        <Link
                          href={`/museo/${item.slug.current}`}
                          className="inline-flex mt-auto border-b border-gold-dark/40 text-gold-muted hover:text-gold-light hover:border-gold-light pb-0.5 font-cinzel text-[11px] font-bold tracking-[0.2em] uppercase transition-all"
                        >
                          Investigar artefacto →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leyendas donde aparece */}
          {bio.legends && bio.legends.length > 0 && (
            <div className="mt-12 pt-8 w-full border-t border-gold-dark/20">
              <h4 className="font-cinzel text-xl text-gold-light mb-6 flex items-center gap-3"><span className="text-gold-dark text-sm">✦</span> Leyendas donde aparece</h4>
              <div className="flex flex-col gap-4">
                {bio.legends.map((legend: any) => (
                  <Link key={legend._id} href={`/articulos/${legend.slug.current}`} className="group flex items-center gap-4 p-4 bg-black/40 border border-gold-dark/15 hover:border-gold-dark/50 transition-all rounded-sm">
                    <span className="text-gold-dark text-lg">📜</span>
                    <div>
                      <h5 className="font-cinzel text-base text-gold-light group-hover:text-gold-bright transition-colors">{legend.title}</h5>
                      {legend.era && <span className="font-crimson text-xs text-gray-500">{legend.era.title}</span>}
                    </div>
                    <span className="ml-auto text-gold-dark/50 group-hover:text-gold-light transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Imágenes adicionales */}
      {bio.images && bio.images.length > 1 && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 py-16 border-t border-gold-dark/10">
          <h4 className="font-cinzel text-xl text-gold-light mb-8 flex items-center gap-3"><span className="text-gold-dark text-sm">✦</span> Galería</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bio.images.slice(1).map((img: any, idx: number) => {
              const imgUrl = urlForImage(img)?.width(500).height(750).url();
              return (
                <div key={idx} className="aspect-[2/3] overflow-hidden border border-gold-dark/20 rounded-sm shadow-lg bg-black/80">
                  {imgUrl && <img src={imgUrl} alt={img.caption || bio.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 opacity-90 hover:opacity-100" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
