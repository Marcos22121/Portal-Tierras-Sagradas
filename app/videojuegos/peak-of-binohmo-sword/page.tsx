'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── TIPOS ──────────────────────────────────────────────────────────────────────
type MainSectionId = 'descubre' | 'wiki' | 'trascendencias' | 'condensadora' | 'detras';
type WikiSubId =
  | 'minerales' | 'minerales-miticos'
  | 'armas-t1' | 'armas-t2' | 'armas-t3' | 'armas-miticas'
  | 'upgrades' | 'habilidades' | 'gemas' | 'pergaminos';

interface WikiItem { id: string; name: string; imagePath: string; rarity: string; description: string; stat?: string; }
interface WikiSub { id: WikiSubId; label: string; icon: string; items: WikiItem[]; }

// ─── DATOS DE NAVEGACIÓN PRINCIPAL ──────────────────────────────────────────────
const MAIN_SECTIONS: { id: MainSectionId; label: string; rune: string; subtitle: string }[] = [
  { id: 'descubre',       label: 'Descubre',           rune: '◉', subtitle: 'El Juego'            },
  { id: 'wiki',           label: 'Wiki',               rune: '✦', subtitle: 'Compendio'           },
  { id: 'trascendencias', label: 'Trascendencias',     rune: '◈', subtitle: 'El Sistema'          },
  { id: 'condensadora',   label: 'Condensadora',       rune: '◎', subtitle: 'Mecánica'            },
  { id: 'detras',         label: 'Detrás de la Forja', rune: '⚒', subtitle: 'Dev'                 },
];

// ─── DATOS WIKI ──────────────────────────────────────────────────────────────────
const WIKI_SUBSECTIONS: WikiSub[] = [
  { id: 'minerales',        label: 'Minerales',       icon: '◈', items: [
    { id: 'hierro', name: 'Hierro Bruto',    imagePath: '/images/juego/minerales/hierro.webp',    rarity: 'Común',    description: 'El mineral más básico. Fundamento de toda forja primitiva y primer escalón del ascenso.', stat: 'Valor: 1 moneda de forja' },
    { id: 'cobre',  name: 'Cobre Andante',   imagePath: '/images/juego/minerales/cobre.webp',     rarity: 'Común',    description: 'Mineral conductor extraído de las venas superficiales de las montañas del oeste.', stat: 'Valor: 2 monedas de forja' },
  ]},
  { id: 'minerales-miticos',label: 'Minerales Míticos',icon: '❋', items: [
    { id: 'obsidiara', name: 'Obsidiara Viva', imagePath: '/images/juego/minerales/obsidiara.webp', rarity: 'Mítico', description: 'Un mineral imposible que palpita como si tuviese un corazón preso. Solo el forjador digno puede manipularlo.', stat: 'Valor: 1.200 monedas de forja' },
  ]},
  { id: 'armas-t1',         label: 'Armas · Tier 1',  icon: '⚔', items: [
    { id: 'espada-rustica', name: 'Espada Rústica', imagePath: '/images/juego/armas/espada-rustica.webp', rarity: 'Común', description: 'Forjada con hierro bruto en horas de aprendizaje. Su filo es torpe pero su peso enseña la virtud de la disciplina.', stat: 'Daño Base: +8' },
  ]},
  { id: 'armas-t2',         label: 'Armas · Tier 2',  icon: '⚔', items: [
    { id: 'hoja-ardiente', name: 'Hoja Ardiente', imagePath: '/images/juego/armas/hoja-ardiente.webp', rarity: 'Raro', description: 'Templada en fuentes volcánicas selladas desde la Era del Cisma. Arde con una energía que nunca se extingue.', stat: 'Daño Base: +48 • Fuego: +12' },
  ]},
  { id: 'armas-t3',         label: 'Armas · Tier 3',  icon: '⚔', items: [
    { id: 'ferrolumbre', name: 'Ferrolumbre', imagePath: '/images/juego/armas/ferrolumbre.webp', rarity: 'Legendario', description: 'Una espada nacida del último secreto de la lava primigenia. Su sola presencia altera el campo magnético.', stat: 'Daño: +180 • Aura: +40' },
  ]},
  { id: 'armas-miticas',    label: 'Armas Míticas',   icon: '✸', items: [
    { id: 'espada-binohmo', name: 'Espada de Binohmo', imagePath: '/images/juego/armas/espada-binohmo.webp', rarity: 'Divino', description: 'La cima absoluta. Forjada por la mano de Binohmo para un único guerrero destinado a ascender al pico.', stat: 'Daño: ∞ • Poder Divino Activo' },
  ]},
  { id: 'upgrades',         label: 'Upgrades',         icon: '▲', items: [
    { id: 'yunque', name: 'Yunque Reforzado', imagePath: '/images/juego/upgrades/yunque.webp', rarity: 'Mejora', description: 'Reduce el tiempo de forja en un 20% y aumenta la probabilidad de resultados excepcionales.', stat: 'Eficiencia: +20%' },
  ]},
  { id: 'habilidades',      label: 'Habilidades',      icon: '◎', items: [
    { id: 'golpe', name: 'Golpe Maestro', imagePath: '/images/juego/habilidades/golpe-maestro.webp', rarity: 'Habilidad', description: 'Técnica ancestral transmitida entre gremios de forjadores del pico. Duplica la producción temporalmente.', stat: 'Duración: 30s • Bonus: ×2' },
  ]},
  { id: 'gemas',            label: 'Gemas',             icon: '◆', items: [
    { id: 'zafiro', name: 'Zafiro del Tiempo', imagePath: '/images/juego/gemas/zafiro-tiempo.webp', rarity: 'Épico', description: 'Cristalizada en el instante exacto en que el tiempo se partió durante la Gran Fractura. Encaja en ranuras Tier 3.', stat: 'Velocidad: +35%' },
  ]},
  { id: 'pergaminos',       label: 'Pergaminos',        icon: '📜', items: [
    { id: 'codice', name: 'Códice del Forjador', imagePath: '/images/juego/pergaminos/codice-forja.webp', rarity: 'Raro', description: 'Manuscrito fragmentado que revela los métodos secretos de aleación de los antiguos maestros.', stat: 'Desbloquea: Receta Antigua I' },
  ]},
];

const SIDEBAR_GROUPS = [
  { label: 'Recursos',    ids: ['minerales', 'minerales-miticos'] as WikiSubId[]                               },
  { label: 'Arsenal',     ids: ['armas-t1', 'armas-t2', 'armas-t3', 'armas-miticas'] as WikiSubId[]           },
  { label: 'Progresión',  ids: ['upgrades', 'habilidades', 'gemas', 'pergaminos'] as WikiSubId[]               },
];

const RARITY_COLORS: Record<string, string> = {
  'Común':     'text-gray-300 border-gray-500/30',
  'Raro':      'text-blue-300 border-blue-500/30',
  'Épico':     'text-purple-300 border-purple-500/30',
  'Legendario':'text-amber-300 border-amber-500/30',
  'Mítico':    'text-rose-300 border-rose-500/30',
  'Divino':    'text-yellow-200 border-yellow-500/30',
  'Mejora':    'text-teal-300 border-teal-500/30',
  'Habilidad': 'text-cyan-300 border-cyan-500/30',
};

// ─── PLACEHOLDER SECTION ─────────────────────────────────────────────────────────
function ComingSoonSection({ title, rune, subtitle }: { title: string; rune: string; subtitle: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center min-h-[40vh]">
      <div
        className="w-20 h-20 rounded-full border border-gold-dark/30 flex items-center justify-center mb-6"
        style={{ background: 'rgba(201,168,76,0.04)', boxShadow: '0 0 40px rgba(201,168,76,0.08) inset' }}
      >
        <span className="text-3xl" style={{ color: 'var(--gold-dark)' }}>{rune}</span>
      </div>
      <span
        className="font-cinzel text-xs tracking-[0.5em] uppercase mb-3"
        style={{ color: 'var(--gold-dark)', opacity: 0.5 }}
      >
        {subtitle}
      </span>
      <h3
        className="font-cinzel text-2xl md:text-3xl font-bold mb-4"
        style={{ color: 'var(--gold-light)' }}
      >
        {title}
      </h3>
      <p className="font-crimson text-lg text-gray-500 max-w-md">
        Esta sección está en construcción. Pronto se revelará su contenido completo.
      </p>
      <div className="flex items-center gap-4 mt-8 opacity-20">
        <div className="h-px w-16" style={{ background: 'var(--gold-dark)' }} />
        <span style={{ color: 'var(--gold-dark)', fontSize: '0.55rem' }}>✦ ✦ ✦</span>
        <div className="h-px w-16" style={{ background: 'var(--gold-dark)' }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function PeakOfBinohmoSwordPage() {
  const [activeMain, setActiveMain] = useState<MainSectionId>('descubre');
  const [activeWikiSub, setActiveWikiSub] = useState<WikiSubId>('minerales');
  const activeSub = WIKI_SUBSECTIONS.find(s => s.id === activeWikiSub)!;

  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>

      {/* ═══ HERO BANNER ═══════════════════════════════════════════════════════ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(260px, 35vh, 420px)', marginTop: '72px' }}
      >
        <img
          src="/images/videojuegos/peak-of-binohmo-sword.png"
          alt="Peak of Binohmo Sword"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.4) saturate(0.7)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/25 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/60 z-10" />

        {/* Línea dorada superior */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, #FFD700, #C9A84C, transparent)' }} />

        {/* Contenido Hero */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <span
            className="font-cinzel text-xs md:text-sm tracking-[0.5em] uppercase mb-3 px-6 py-1.5 border"
            style={{ color: 'rgba(139,105,20,0.9)', borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          >
            Videojuego · Tierras Sagradas
          </span>
          <h1
            className="font-cinzel font-black uppercase tracking-[0.08em] leading-none"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 5rem)',
              background: 'linear-gradient(135deg, #8B6914 0%, #C9A84C 28%, #FFD700 50%, #C9A84C 72%, #8B6914 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shine 4s linear infinite',
              filter: 'drop-shadow(0 0 25px rgba(201,168,76,0.25))',
            }}
          >
            Peak of Binohmo Sword
          </h1>
          <p className="font-crimson mt-3 text-lg md:text-xl opacity-60" style={{ color: 'var(--gold-light)' }}>
            Forja la espada legendaria. Asciende al pico del poder.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] z-20"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }} />
      </div>

      {/* ═══ STATS BAR ═════════════════════════════════════════════════════════ */}
      <div className="flex justify-center px-6">
        <div
          className="flex flex-wrap justify-center gap-px border border-gold-dark/20 overflow-hidden"
          style={{ background: 'rgba(5,5,5,0.98)', maxWidth: '860px', width: '100%' }}
        >
          {[
            { label: 'Género',  value: 'Clicker · Incremental' },
            { label: 'Mundos',  value: '3 Reinos'              },
            { label: 'Armas',   value: '12+ Únicas'            },
            { label: 'Estado',  value: 'En Desarrollo'         },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center px-6 py-3 flex-1 min-w-[110px]"
              style={{ background: 'rgba(10,10,10,0.8)', borderRight: i < 3 ? '1px solid rgba(201,168,76,0.08)' : 'none' }}
            >
              <span className="font-cinzel text-[9px] tracking-[0.3em] uppercase" style={{ color: 'var(--gold-dark)' }}>
                {stat.label}
              </span>
              <span className="font-cinzel text-sm mt-1 font-bold" style={{ color: 'var(--gold-light)' }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ NAVEGACIÓN PRINCIPAL — "LOSAS RÚNICAS" ════════════════════════════ */}
      {/*
        Diseño: 5 losas verticales conectadas por una línea central.
        Cada losa tiene proporción vertical, con la runa arriba, el nombre al centro
        y un subtítulo abajo. La activa se "enciende" con glow dorado.
        En mobile se vuelve un carrusel horizontal scrolleable.
      */}
      <div className="max-w-[1100px] mx-auto px-4 md:px-8 mt-14 mb-2">

        {/* Contenedor del rail rúnico */}
        <div className="relative flex items-stretch justify-center gap-0">

          {/* Línea horizontal central (decorativa) */}
          <div
            className="absolute top-1/2 left-0 right-0 h-[1px] -translate-y-1/2 pointer-events-none hidden md:block"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15) 15%, rgba(201,168,76,0.15) 85%, transparent)' }}
          />

          {/* Cada losa */}
          {MAIN_SECTIONS.map((sec, idx) => {
            const isActive = activeMain === sec.id;
            return (
              <React.Fragment key={sec.id}>
                {/* Conector entre losas */}
                {idx > 0 && (
                  <div className="hidden md:flex items-center justify-center w-6 flex-shrink-0 relative">
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: isActive || activeMain === MAIN_SECTIONS[idx - 1].id ? 'var(--gold-dark)' : 'rgba(201,168,76,0.2)' }}
                    />
                  </div>
                )}

                <button
                  onClick={() => setActiveMain(sec.id)}
                  className="relative group flex flex-col items-center justify-center outline-none cursor-pointer transition-all duration-400 flex-1 min-w-0"
                  style={{
                    padding: 'clamp(20px, 3vw, 32px) clamp(10px, 2vw, 20px)',
                    border: `1px solid ${isActive ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.1)'}`,
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)'
                      : 'rgba(8,8,8,0.7)',
                    boxShadow: isActive ? '0 0 40px rgba(201,168,76,0.12) inset, 0 0 20px rgba(201,168,76,0.06)' : 'none',
                    transition: 'all 0.35s ease',
                  }}
                >
                  {/* Runa / Icono */}
                  <span
                    className="text-2xl mb-3 transition-all duration-300"
                    style={{
                      color: isActive ? 'var(--gold-light)' : 'rgba(139,105,20,0.45)',
                      textShadow: isActive ? '0 0 20px rgba(201,168,76,0.6)' : 'none',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    {sec.rune}
                  </span>

                  {/* Nombre */}
                  <span
                    className="font-cinzel font-bold text-center leading-tight transition-colors duration-300"
                    style={{
                      fontSize: 'clamp(0.65rem, 1.1vw, 0.85rem)',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--gold-light)' : 'rgba(180,155,100,0.45)',
                    }}
                  >
                    {sec.label}
                  </span>

                  {/* Subtítulo */}
                  <span
                    className="font-cinzel text-center mt-1 hidden md:block"
                    style={{
                      fontSize: '0.55rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: isActive ? 'rgba(201,168,76,0.5)' : 'rgba(139,105,20,0.25)',
                    }}
                  >
                    {sec.subtitle}
                  </span>

                  {/* Indicador activo inferior */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-400"
                    style={{
                      width: isActive ? '40%' : '0%',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                    }}
                  />

                  {/* Hover glow (solo inactivos) */}
                  {!isActive && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: 'rgba(201,168,76,0.024)' }}
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Separador ornamental debajo del rail */}
        <div className="flex items-center justify-center gap-4 mt-4 opacity-25">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dark))' }} />
          <span style={{ color: 'var(--gold-dark)', fontSize: '0.55rem' }}>✦ ✦ ✦</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, var(--gold-dark))' }} />
        </div>
      </div>

      {/* ═══ CONTENIDO DE SECCIONES ════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-16 py-12 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMain}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >

            {/* ─── DESCUBRE ─────────────────────────────────────────────── */}
            {activeMain === 'descubre' && (
              <ComingSoonSection title="Descubre Nuestro Juego" rune="◉" subtitle="El Juego" />
            )}

            {/* ─── TRASCENDENCIAS ───────────────────────────────────────── */}
            {activeMain === 'trascendencias' && (
              <ComingSoonSection title="Trascendencias" rune="◈" subtitle="El Sistema" />
            )}

            {/* ─── CONDENSADORA ─────────────────────────────────────────── */}
            {activeMain === 'condensadora' && (
              <ComingSoonSection title="Condensadora" rune="◎" subtitle="Mecánica" />
            )}

            {/* ─── DETRÁS DE LA FORJA ───────────────────────────────────── */}
            {activeMain === 'detras' && (
              <ComingSoonSection title="Detrás de la Forja" rune="⚒" subtitle="Dev" />
            )}

            {/* ─── WIKI ─────────────────────────────────────────────────── */}
            {activeMain === 'wiki' && (
              <div>
                {/* Encabezado Wiki */}
                <div className="flex flex-col items-center text-center mb-12">
                  <span className="font-cinzel text-xs tracking-[0.5em] uppercase mb-3" style={{ color: 'var(--gold-dark)', opacity: 0.7 }}>
                    Compendio Oficial
                  </span>
                  <h2
                    className="font-cinzel text-3xl md:text-4xl font-bold"
                    style={{
                      background: 'var(--gradient-gold)', backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Wiki del Juego
                  </h2>
                </div>

                {/* Layout Wiki: Sidebar + Contenido */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                  {/* ─ Sidebar ─ */}
                  <aside className="w-full lg:w-[250px] lg:min-w-[250px] flex-shrink-0 lg:sticky top-[90px]">
                    <div
                      className="border border-gold-dark/20 overflow-hidden"
                      style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)' }}
                    >
                      <div
                        className="px-5 py-4 border-b border-gold-dark/15 flex items-center gap-3"
                        style={{ background: 'rgba(201,168,76,0.03)' }}
                      >
                        <span style={{ color: 'var(--gold-dark)' }}>✦</span>
                        <span className="font-cinzel text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--gold-light)' }}>
                          Categorías
                        </span>
                      </div>

                      {SIDEBAR_GROUPS.map((group, gIdx) => (
                        <div key={group.label} className={gIdx > 0 ? 'border-t border-gold-dark/10' : ''}>
                          <div className="px-5 pt-4 pb-2">
                            <span className="font-cinzel text-[9px] tracking-[0.4em] uppercase opacity-35" style={{ color: 'var(--gold-dark)' }}>
                              {group.label}
                            </span>
                          </div>
                          {group.ids.map((subId) => {
                            const sub = WIKI_SUBSECTIONS.find(s => s.id === subId)!;
                            const isActive = activeWikiSub === subId;
                            return (
                              <button
                                key={subId}
                                onClick={() => setActiveWikiSub(subId)}
                                className="w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-200 outline-none cursor-pointer relative"
                                style={{
                                  background: isActive ? 'rgba(201,168,76,0.07)' : 'transparent',
                                  borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
                                }}
                              >
                                <span className="text-sm flex-shrink-0 transition-all" style={{ color: isActive ? 'var(--gold-light)' : 'rgba(139,105,20,0.5)', opacity: isActive ? 1 : 0.7 }}>{sub.icon}</span>
                                <span className="font-cinzel text-[11px] tracking-wider uppercase transition-colors truncate" style={{ color: isActive ? 'var(--gold-light)' : 'rgba(180,150,90,0.5)' }}>
                                  {sub.label}
                                </span>
                                <span className="ml-auto font-cinzel text-[9px] flex-shrink-0 tabular-nums" style={{ color: isActive ? 'var(--gold-dark)' : 'rgba(100,80,40,0.4)' }}>
                                  {sub.items.length}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ))}

                      <div className="px-5 py-4 border-t border-gold-dark/10 flex justify-center">
                        <span className="font-cinzel text-[9px] tracking-[0.4em]" style={{ color: 'rgba(139,105,20,0.2)' }}>✦ ✦ ✦</span>
                      </div>
                    </div>
                  </aside>

                  {/* ─ Contenido Wiki ─ */}
                  <main className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeWikiSub}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                      >
                        {/* Header sub */}
                        <div className="flex items-center gap-4 mb-8 pb-5 border-b border-gold-dark/12">
                          <span className="text-2xl flex-shrink-0" style={{ color: 'var(--gold-dark)' }}>{activeSub.icon}</span>
                          <div>
                            <h3 className="font-cinzel font-bold text-xl md:text-2xl" style={{ color: 'var(--gold-light)' }}>
                              {activeSub.label}
                            </h3>
                            <p className="font-cinzel text-[10px] tracking-[0.3em] uppercase mt-1 opacity-40" style={{ color: 'var(--gold-dark)' }}>
                              {activeSub.items.length} {activeSub.items.length === 1 ? 'entrada' : 'entradas'}
                            </p>
                          </div>
                        </div>

                        {/* Grid de items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                          {activeSub.items.map((item) => (
                            <div
                              key={item.id}
                              className="group flex flex-col border border-gold-dark/12 hover:border-gold-dark/45 transition-all duration-300 overflow-hidden"
                              style={{ background: 'rgba(8,8,8,0.7)' }}
                            >
                              {/* Imagen 1:1 */}
                              <div
                                className="w-full aspect-square relative overflow-hidden bg-black/60 flex items-center justify-center"
                                style={{ borderBottom: '1px solid rgba(201,168,76,0.06)' }}
                              >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 70%)' }} />
                                <img
                                  src={item.imagePath}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML += `<span style="color:rgba(201,168,76,0.12);font-size:4rem;position:absolute;">${activeSub.icon}</span>`;
                                  }}
                                />
                                <div className="absolute top-3 right-3 z-10">
                                  <span className={`font-cinzel text-[9px] tracking-[0.2em] uppercase px-2 py-1 border ${RARITY_COLORS[item.rarity] ?? 'text-gray-300 border-gray-500/30'}`} style={{ backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.55)' }}>
                                    {item.rarity}
                                  </span>
                                </div>
                              </div>

                              {/* Datos */}
                              <div className="p-5 flex flex-col flex-grow">
                                <h4 className="font-cinzel font-bold text-lg mb-2" style={{ color: 'var(--gold-light)' }}>
                                  {item.name}
                                </h4>
                                <p className="font-crimson text-sm text-gray-400 leading-relaxed flex-grow mb-4">
                                  {item.description}
                                </p>
                                {item.stat && (
                                  <div
                                    className="font-cinzel text-[10px] tracking-[0.2em] uppercase px-3 py-2 border-l-2 mt-auto"
                                    style={{ color: 'var(--gold-dark)', borderColor: 'var(--gold-dark)', background: 'rgba(201,168,76,0.03)' }}
                                  >
                                    {item.stat}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}

                          {/* Card próximamente */}
                          <div
                            className="flex flex-col items-center justify-center border border-dashed border-gold-dark/12 aspect-square p-8 text-center opacity-30 hover:opacity-50 transition-opacity"
                            style={{ background: 'rgba(5,5,5,0.5)' }}
                          >
                            <span style={{ color: 'var(--gold-dark)', fontSize: '2.5rem' }}>✦</span>
                            <p className="font-cinzel text-xs tracking-[0.3em] uppercase mt-4" style={{ color: 'var(--gold-dark)' }}>
                              Próximamente
                            </p>
                          </div>
                        </div>

                      </motion.div>
                    </AnimatePresence>
                  </main>

                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Keyframe animación del título */}
      <style>{`
        @keyframes shine {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
