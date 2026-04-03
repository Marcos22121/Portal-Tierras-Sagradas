'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import MythicButton from '@/components/ui/MythicButton';
import CosmosBackground from '@/components/ui/CosmosBackground';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity.image';

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORÍAS PRINCIPALES
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 'leyendas',
    label: 'Leyendas',
    description: 'Los grandes mitos que dieron forma al mundo.',
  },
  {
    id: 'biografias',
    label: 'Biografías',
    description: 'Las historias de quienes marcaron la eternidad.',
  },
  {
    id: 'museo',
    label: 'Museo',
    description: 'Artefactos, reliquias y objetos de poder.',
  },
  {
    id: 'tierras',
    label: 'Tierras',
    description: 'Los reinos, continentes y lugares sagrados.',
  },
  {
    id: 'videojuegos',
    label: 'Videojuegos',
    description: 'Juegos ambientados en el universo Tierras Sagradas.',
  },
] as const;

// ── Museo sub-categories (para el filtro de tabs) ──────────────────────────
const MUSEO_TABS = [
  { id: 'armamento', label: 'Armamento Sagrado' },
  { id: 'reliquia', label: 'Reliquias Arcanas' },
  { id: 'runa', label: 'Runas' },
] as const;

// ── Tierras type labels ────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// TIPO DE PROPS
// ─────────────────────────────────────────────────────────────────────────────
interface CategorySectionsProps {
  dynamicEras?: any[];
  biographies?: any[];
  museumItems?: any[];
  lands?: any[];
}

export default function CategorySections({
  dynamicEras = [],
  biographies = [],
  museumItems = [],
  lands = [],
}: CategorySectionsProps) {
  const [active, setActive] = useState<string | null>('leyendas');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Escuchar cambios de ancla en la URL (desde el Header)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (SECTIONS.some(s => s.id === hash)) {
        setActive(hash);
        setTimeout(() => {
          sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const toggle = (id: string) => {
    if (active === id) {
      setActive(null);
      window.history.pushState(null, '', window.location.pathname);
    } else {
      setActive(id);
      window.history.pushState(null, '', '#' + id);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <section className="relative" ref={sectionRef} id="categorias">
      {/* ── Línea ornamental superior ──────────────────────────── */}
      <div
        className="w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
        }}
      />

      {/* ── Barra de botones de categorías ─────────────────────── */}
      <div
        className="flex flex-wrap justify-center gap-4 px-6 py-10"
        style={{ background: 'var(--obsidian)' }}
      >
        {SECTIONS.map((sec) => {
          const isActive = active === sec.id;
          return (
            <MythicButton
              key={sec.id}
              onClick={() => toggle(sec.id)}
              className="min-w-[160px]"
              style={
                isActive
                  ? {
                      background: 'rgba(201,168,76,0.08)',
                      boxShadow: '0 0 16px rgba(255,215,0,0.2), inset 0 0 12px rgba(255,215,0,0.05)',
                    }
                  : {}
              }
            >
              {sec.label}
            </MythicButton>
          );
        })}
      </div>

      {/* ── Área de contenido desplegable ─────────────────────── */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="min-h-[400px]">
              <SectionContent
                section={SECTIONS.find((s) => s.id === active)!}
                dynamicEras={dynamicEras}
                biographies={biographies}
                museumItems={museumItems}
                lands={lands}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── CONTENIDO DE CADA SECCIÓN ────────────────────────────────────────────────
function SectionContent({
  section,
  dynamicEras,
  biographies,
  museumItems,
  lands,
}: {
  section: (typeof SECTIONS)[number];
  dynamicEras: any[];
  biographies: any[];
  museumItems: any[];
  lands: any[];
}) {
  const [openEra, setOpenEra] = useState<string | null>(null);
  const [museoActiveCategory, setMuseoActiveCategory] = useState<string>('armamento');

  const toggleEra = (eraId: string) => {
    setOpenEra((prev: string | null) => (prev === eraId ? null : eraId));
  };

  return (
    <div
      id={section.id}
      className="relative px-6 md:px-16 lg:px-24 py-20 overflow-hidden min-h-[600px] flex flex-col items-center"
      style={{
        background: 'var(--obsidian-surface)',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}
    >
      <CosmosBackground />

      <div className="max-w-[1600px] w-full mx-auto text-center relative z-10">
        {/* Título de la sección */}
        <h2
          className="font-cinzel text-3xl md:text-4xl font-bold mb-4 text-gold-gradient gold-glow-hover"
          style={{
            background: 'var(--gradient-gold)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {section.label}
        </h2>

        {/* Separador ornamental */}
        <div className="ornament-divider mb-8">
          <span style={{ color: 'var(--gold-dark)', fontSize: '0.7rem' }}>✦</span>
        </div>

        <p className="font-crimson text-lg mb-10 max-w-3xl mx-auto" style={{ color: 'rgba(208,200,180,0.6)' }}>
          {section.description}
        </p>

        {/* ═══════════════════════════════════════════════════════════
            LEYENDAS — Eras dinámicas desde Sanity
        ═══════════════════════════════════════════════════════════ */}
        {section.id === 'leyendas' ? (
          <div className="flex flex-col gap-8 mt-12 w-full text-left">
            {dynamicEras.length > 0 ? dynamicEras.map((era: any) => {
              const isOpen = openEra === era._id;
              const eraBgUrl = era.coverImage ? urlForImage(era.coverImage)?.url() : null;
              return (
                <div key={era._id} className="border border-[rgba(201,168,76,0.2)] rounded-sm overflow-hidden" style={{ background: 'rgba(5,5,5,0.6)', backdropFilter: 'blur(10px)' }}>
                  <button
                    onClick={() => toggleEra(era._id)}
                    className="w-full relative group cursor-pointer overflow-hidden min-h-[160px] flex items-center p-6 md:p-10 border-0 outline-none text-left"
                  >
                    {eraBgUrl && <img src={eraBgUrl} alt={era.title} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 z-0" />}
                    <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)' }} />
                    <div className="relative z-10 flex flex-col items-start text-left w-full pr-16 md:w-2/3">
                      <span className="font-cinzel text-xs tracking-widest text-gold border border-gold-dark/30 px-2 py-1 mb-3 bg-black/50">ERA HISTÓRICA</span>
                      <h3 className="font-cinzel text-3xl md:text-5xl font-bold text-gold-light mb-3 drop-shadow-md">{era.title}</h3>
                      <p className="font-crimson text-gray-300 max-w-3xl text-lg opacity-90 leading-relaxed">{era.description || 'Sin descripción disponible.'}</p>
                    </div>
                    <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center border-2 border-gold-dark/40 rounded-full w-12 h-12 group-hover:border-gold-light group-hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all bg-black/60">
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown className="text-gold-light w-6 h-6" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="border-t border-[rgba(201,168,76,0.3)] bg-[#030303]/90"
                      >
                        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                          <div className="hidden md:block absolute left-4 md:left-8 top-10 bottom-10 w-px bg-gold-dark/20" />
                          {era.articles && era.articles.length > 0 ? era.articles.map((story: any) => {
                            const storyBgUrl = story.coverImage ? urlForImage(story.coverImage)?.width(600).height(400).url() : null;
                            return (
                              <div key={story._id} className="border border-gold-dark/20 p-5 flex flex-col group hover:border-gold-dark/70 transition-colors relative bg-[#0a0a0a]/80">
                                <div className="w-full aspect-[3/2] relative mb-6 overflow-hidden border border-gold-dark/20 bg-black/60 flex items-center justify-center rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.6)]">
                                  {storyBgUrl && <img src={storyBgUrl} alt={story.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />}
                                  <span className="text-gold-dark/20 text-4xl absolute z-[-1]">✦</span>
                                </div>
                                <h4 className="font-cinzel text-xl text-gold-light mb-3 group-hover:text-gold-bright transition-colors">{story.title}</h4>
                                <p className="font-crimson text-sm text-gray-400 mb-6 flex-grow">{story.excerpt || 'Haz clic para leer el relato.'}</p>
                                <div className="mt-auto">
                                  <Link href={`/leyendas/${story.slug.current}`} className="inline-flex items-center gap-2 font-cinzel text-xs tracking-widest text-gold-muted group-hover:text-amber-400 hover:underline uppercase transition-colors">
                                    <span>Leer Historia Completa</span><span className="text-xl leading-none">→</span>
                                  </Link>
                                </div>
                              </div>
                            );
                          }) : (
                            <div className="col-span-full border border-dashed border-gold-dark/20 p-6 opacity-60 text-center bg-black/40">
                              <span className="text-gold-dark text-3xl mb-2 inline-block">✦</span>
                              <p className="font-cinzel tracking-widest text-gold-muted uppercase text-sm mt-3 leading-relaxed">Sin crónicas disponibles<br/>Nuevos descubrimientos esperan</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }) : (
              <EmptyState message="No hay eras descubiertas. Visita el panel de Sanity para crear Eras." />
            )}
          </div>

        /* ═══════════════════════════════════════════════════════════
            BIOGRAFÍAS — Cards con Link a /biografias/[slug]
        ═══════════════════════════════════════════════════════════ */
        ) : section.id === 'biografias' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-10 w-full max-w-[1500px] mx-auto text-left">
            {biographies.length > 0 ? biographies.map((bio: any) => {
              const bioImgUrl = bio.images?.[0] ? urlForImage(bio.images[0])?.width(600).height(800).url() : null;
              return (
                <Link
                  key={bio._id}
                  href={`/biografias/${bio.slug.current}`}
                  className="group relative flex flex-col items-center border border-[rgba(201,168,76,0.2)] rounded-sm overflow-hidden text-center hover:border-gold-dark/60 transition-all duration-300 w-full hover:-translate-y-1 shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
                  style={{ background: 'rgba(5,5,5,0.7)', backdropFilter: 'blur(5px)' }}
                >
                  {/* Imagen vertical portrait */}
                  <div className="w-full relative aspect-[3/4] overflow-hidden bg-black/80 flex items-center justify-center border-b border-[rgba(201,168,76,0.15)]">
                    {bioImgUrl && <img src={bioImgUrl} alt={bio.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />}
                    <span className="text-gold-dark/20 text-6xl absolute z-[-1]">✧</span>
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] z-10 pointer-events-none" />
                  </div>
                  {/* Nombre y subtítulo */}
                  <div className="w-full pt-6 pb-8 px-4 flex flex-col items-center flex-grow relative z-20">
                    <span className="font-crimson text-xs italic text-gray-400 mb-2 tracking-widest uppercase">{bio.shortDescription || ''}</span>
                    <h3
                      className="font-cinzel text-xl md:text-2xl font-bold tracking-[0.1em] uppercase group-hover:scale-105 transition-transform gold-glow-hover"
                      style={{
                        background: 'var(--gradient-gold)',
                        backgroundSize: '200% auto',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {bio.name}
                    </h3>
                    {bio.faction && (
                      <span className="font-crimson text-xs text-gray-500 mt-2 tracking-widest">{bio.faction}</span>
                    )}
                    <div className="mt-5 text-gold-dark text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-block border-b border-gold-dark pb-1 text-gold-light tracking-widest font-cinzel">Examinar Registro</span>
                    </div>
                  </div>
                </Link>
              );
            }) : (
              <div className="col-span-full"><EmptyState message="No hay biografías registradas. Crea personajes en Sanity." /></div>
            )}
          </div>

        /* ═══════════════════════════════════════════════════════════
            MUSEO — Tabs de subcategoría + Grid con Link a /museo/[slug]
        ═══════════════════════════════════════════════════════════ */
        ) : section.id === 'museo' ? (
          <div className="flex flex-col mt-10 w-full max-w-[1500px] mx-auto text-left relative z-20">
            {/* Sub-categorías del Museo como tabs */}
            <div className="flex justify-center mb-14 relative w-full">
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-dark/30 to-transparent -translate-y-1/2 z-0" />
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 relative z-10 px-4">
                {MUSEO_TABS.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setMuseoActiveCategory(cat.id)}
                    className={`relative group px-6 py-3 border overflow-hidden transition-all duration-300 ${
                      museoActiveCategory === cat.id
                        ? 'border-gold-light bg-gold-dark/10 shadow-[0_0_15px_rgba(201,168,76,0.3)]'
                        : 'border-[rgba(201,168,76,0.2)] bg-black/80 hover:border-gold-dark/60'
                    }`}
                  >
                    {museoActiveCategory === cat.id && (
                      <motion.div
                        layoutId="museoNavPremiumGlow"
                        className="absolute inset-0 bg-gradient-radial from-gold-light/20 to-transparent opacity-70"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gold-light/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className={`relative z-10 font-cinzel text-xs md:text-sm tracking-[0.25em] font-bold uppercase transition-colors ${
                      museoActiveCategory === cat.id ? 'text-gold-light drop-shadow-md' : 'text-gray-400 group-hover:text-gold-muted'
                    }`}>
                      <span>{cat.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de artefactos 1:1 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={museoActiveCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10 pb-10"
              >
                {museumItems.filter((a: any) => a.itemType === museoActiveCategory).length > 0 ? (
                  museumItems.filter((a: any) => a.itemType === museoActiveCategory).map((artifact: any) => {
                    const artifactImgUrl = artifact.coverImage ? urlForImage(artifact.coverImage)?.width(400).height(400).url() : null;
                    return (
                      <Link
                        key={artifact._id}
                        href={`/museo/${artifact.slug.current}`}
                        className="group relative flex flex-col items-center bg-[#070707] border border-[rgba(201,168,76,0.15)] hover:border-gold-light/60 rounded-sm overflow-hidden text-center transition-all duration-300 w-full hover:-translate-y-2 shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
                      >
                        <div className="w-full aspect-square relative overflow-hidden flex items-center justify-center p-6 bg-black">
                          <div className="absolute inset-0 bg-gradient-radial from-gold-dark/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          {artifactImgUrl ? (
                            <img src={artifactImgUrl} alt={artifact.name} className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(201,168,76,0.1)] group-hover:scale-110 group-hover:drop-shadow-[0_0_25px_rgba(201,168,76,0.4)] transition-all duration-500" />
                          ) : (
                            <span className="text-gold-dark/40 text-5xl absolute z-0">✦</span>
                          )}
                        </div>
                        <div className="w-full p-4 relative h-20 flex flex-col items-center justify-center border-t border-[rgba(201,168,76,0.2)]">
                          <span className="font-cinzel text-xs md:text-sm font-bold text-gold-muted group-hover:text-gold-light transition-colors uppercase tracking-widest text-balance drop-shadow-md">
                            {artifact.name}
                          </span>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="col-span-full py-24 flex flex-col items-center justify-center border border-dashed border-gold-dark/20 bg-black/40">
                    <span className="text-gold-dark/50 text-5xl mb-4">✧</span>
                    <p className="font-cinzel text-sm tracking-widest text-gold-muted/80 uppercase text-center max-w-md leading-relaxed">
                      El pasillo de esta categoría<br/>aún yace vacío...
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        /* ═══════════════════════════════════════════════════════════
            TIERRAS — Cards con Link a /tierras/[slug]
        ═══════════════════════════════════════════════════════════ */
        ) : section.id === 'tierras' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full max-w-[1100px] mx-auto text-left">
            {lands.length > 0 ? lands.map((tierra: any) => {
              const tierraImgUrl = tierra.images?.[0] ? urlForImage(tierra.images[0])?.width(800).height(600).url() : null;
              return (
                <div key={tierra._id} className="group relative flex flex-col bg-black/50 border border-gold-dark/20 rounded-sm overflow-hidden p-5 hover:border-gold-light/40 transition-all duration-300">
                  {/* Imagen */}
                  <div className="w-full aspect-[4/3] xl:aspect-[16/10] overflow-hidden rounded relative mb-5 shadow-lg shadow-black/80">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                    {tierraImgUrl && <img src={tierraImgUrl} alt={tierra.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative z-0" />}
                    <span className="text-gold-dark/30 text-[4rem] absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">✧</span>
                    <span className="absolute bottom-4 left-4 z-20 font-cinzel text-xs tracking-widest text-gold-light px-2 py-1 bg-black/60 border border-gold-dark/50 uppercase backdrop-blur-sm">
                      {LAND_TYPE_LABELS[tierra.landType] || tierra.landType}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-2xl font-bold text-gold-gradient mb-3 tracking-wide gold-glow-hover">{tierra.name}</h3>
                  {tierra.title && <p className="font-crimson text-sm text-gold-muted italic mb-2">{tierra.title}</p>}

                  {/* Metadata badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tierra.dangerLevel && (
                      <span className={`font-cinzel text-[10px] tracking-widest uppercase px-2 py-1 border border-gold-dark/20 bg-black/50 ${DANGER_COLORS[tierra.dangerLevel] || 'text-gray-400'}`}>
                        Peligro: {tierra.dangerLevel}
                      </span>
                    )}
                    {tierra.ruler && (
                      <span className="font-cinzel text-[10px] tracking-widest uppercase text-gold-muted px-2 py-1 border border-gold-dark/20 bg-black/50">
                        Gobernante: {tierra.ruler.name}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex justify-between items-center w-full border-t border-gold-dark/10 pt-6">
                    <Link
                      href={`/tierras/${tierra.slug.current}`}
                      className="inline-flex items-center gap-2 font-cinzel text-sm md:text-base tracking-widest text-gold-light group-hover:text-gold-bright uppercase transition-colors hover:scale-105 transform origin-left"
                    >
                      <span>Explorar Tierra</span><span>→</span>
                    </Link>
                    <span className="text-gold-dark/30 text-xl">✧</span>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full"><EmptyState message="No hay tierras cartografiadas. Crea lugares en Sanity." /></div>
            )}
          </div>

        /* ═══════════════════════════════════════════════════════════
            VIDEOJUEGOS — Estático (sin cambios)
        ═══════════════════════════════════════════════════════════ */
        ) : section.id === 'videojuegos' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 text-left mt-10 max-w-[1500px] mx-auto px-4 md:px-0">
            <div className="border-gold-gradient p-8 flex flex-col items-center" style={{ background: 'rgba(5, 5, 5, 0.4)', backdropFilter: 'blur(4px)' }}>
              <div className="w-full relative flex items-center justify-center overflow-hidden mb-6" style={{ aspectRatio: '630/500', background: 'rgba(10, 10, 10, 0.5)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <img src="/images/videojuegos/el-senor-del-reino.png" alt="El Señor Del Reino" className="absolute inset-0 w-full h-full object-cover z-0" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <h3 className="font-cinzel text-2xl font-bold mb-3 text-center" style={{ color: 'var(--gold-light)' }}>Tierras Sagradas: El Señor Del Reino</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['Decisiones', 'Elige tu camino', 'Mejoras', 'Narrativo'].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-cinzel tracking-widest uppercase" style={{ border: '1px solid rgba(139, 105, 20, 0.3)', color: 'var(--gold-muted)', background: 'rgba(0,0,0,0.5)' }}>{tag}</span>
                ))}
              </div>
              <p className="font-crimson flex-grow text-gray-400 text-center mb-8 max-w-[600px] text-lg">Toma el control y forja el destino de tu propio reino. Tus decisiones alterarán el curso de la historia en las Tierras Sagradas.</p>
              <div className="mt-auto"><MythicButton href="/videojuegos/el-senor-del-reino">Visitar página</MythicButton></div>
            </div>

            <div className="border-gold-gradient p-8 flex flex-col items-center" style={{ background: 'rgba(5, 5, 5, 0.4)', backdropFilter: 'blur(4px)' }}>
              <div className="w-full relative flex items-center justify-center overflow-hidden mb-6" style={{ aspectRatio: '630/500', background: 'rgba(10, 10, 10, 0.5)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <img src="/images/videojuegos/peak-of-binohmo-sword.png" alt="Peak of Binohmo Sword" className="absolute inset-0 w-full h-full object-cover z-0" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
              <h3 className="font-cinzel text-2xl font-bold mb-3 text-center" style={{ color: 'var(--gold-light)' }}>Peak of Binohmo Sword</h3>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['Clicker', 'Incremental', 'Forja', 'Minerales'].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-cinzel tracking-widest uppercase" style={{ border: '1px solid rgba(139, 105, 20, 0.3)', color: 'var(--gold-muted)', background: 'rgba(0,0,0,0.5)' }}>{tag}</span>
                ))}
              </div>
              <p className="font-crimson flex-grow text-gray-400 text-center mb-8 max-w-[600px] text-lg">Forja la espada legendaria definitiva. Recolecta minerales raros, mejora tu yunque y asciende al pico del poder.</p>
              <div className="mt-auto"><MythicButton href="/videojuegos/peak-of-binohmo-sword">Visitar página</MythicButton></div>
            </div>
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-3" style={{ border: '1px dashed rgba(201,168,76,0.15)', borderRadius: '2px' }}>
            <span style={{ color: 'var(--gold-dark)', fontSize: '2rem' }}>✦</span>
            <p className="font-cinzel text-sm tracking-widest uppercase" style={{ color: 'rgba(201,168,76,0.3)' }}>Contenido próximamente</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Empty state reutilizable ─────────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-24 border border-dashed border-gold-dark/20 bg-black/40 flex flex-col items-center justify-center text-center w-full">
      <span className="text-gold-dark/50 text-5xl mb-4 inline-block drop-shadow-lg">✧</span>
      <p className="font-crimson text-lg text-gray-500 max-w-lg">{message}</p>
    </div>
  );
}
