'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MythicButton from '@/components/ui/MythicButton';

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORÍAS PRINCIPALES — Editá este array para modificar las secciones.
// Cada objeto tiene: id (ancla), label (texto del botón) y content (JSX vacío por ahora).
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

export default function CategorySections() {
  const [active, setActive] = useState<string | null>('leyendas');
  const sectionRef = useRef<HTMLDivElement>(null);

  const toggle = (id: string) => {
    const next = active === id ? null : id;
    setActive(next);
    // Scroll suave hacia el contenido al abrir
    if (next) {
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

      {/* ── Barra de botones de categorías ───────────────────────
          Estos botones usan la misma clase .btn-mythic que el CTA del Hero.
          El diseño es: negro con bordes dorado-metálico gradiente, texto dorado.
      ─────────────────────────────────────────────────────────── */}
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

      {/* ── Área de contenido desplegable ─────────────────────────
          Por ahora cada sección está vacía. Reemplazá el <p> dentro de
          <SectionContent> con el contenido real cuando esté listo.
      ─────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <SectionContent section={SECTIONS.find((s) => s.id === active)!} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Placeholder de sección ───────────────────────────────────────────────────
function SectionContent({
  section,
}: {
  section: (typeof SECTIONS)[number];
}) {
  return (
    <div
      id={section.id}
      className="relative px-6 md:px-16 lg:px-24 py-20"
      style={{
        background: 'var(--obsidian-surface)',
        borderTop: '1px solid rgba(201,168,76,0.12)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
      }}
    >
      {/* Decoración de esquinas */}
      <Corner pos="top-0 left-0" />
      <Corner pos="top-0 right-0" mirror />
      <Corner pos="bottom-0 left-0" flipV />
      <Corner pos="bottom-0 right-0" mirror flipV />

      <div className="max-w-[1600px] w-full mx-auto text-center">
        {/* Título de la sección */}
        <h2
          className="font-cinzel text-3xl md:text-4xl font-bold mb-4 text-gold-gradient"
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

        {/* Contenido condicional: Placeholder o Videojuegos */}
        {section.id === 'videojuegos' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 text-left mt-10 max-w-[1500px] mx-auto px-4 md:px-0">
            {/* Juego 1 */}
            <div className="border-gold-gradient p-8 flex flex-col items-center" style={{ background: '#050505' }}>
              <div 
                className="w-full relative flex items-center justify-center overflow-hidden mb-6"
                style={{ aspectRatio: '630/500', background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.1)' }}
              >
                {/* La etiqueta img está lista, fallará silenciosamente si la imagen no existe pero es válido */}
                <img src="/images/videojuegos/el-senor-del-reino.png" alt="El Señor Del Reino" className="absolute inset-0 w-full h-full object-cover z-0" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>

              <h3 className="font-cinzel text-2xl font-bold mb-3 text-center" style={{ color: 'var(--gold-light)' }}>
                Tierras Sagradas: El Señor Del Reino
              </h3>

              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['Decisiones', 'Elige tu camino', 'Mejoras', 'Narrativo'].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-cinzel tracking-widest uppercase" style={{ border: '1px solid rgba(139, 105, 20, 0.3)', color: 'var(--gold-muted)', background: 'rgba(0,0,0,0.5)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-crimson flex-grow text-gray-400 text-center mb-8 max-w-[600px] text-lg">
                Toma el control y forja el destino de tu propio reino. Tus decisiones alterarán el curso de la historia en las Tierras Sagradas.
              </p>

              <div className="mt-auto">
                <MythicButton href="/videojuegos/el-senor-del-reino">
                  Visitar página
                </MythicButton>
              </div>
            </div>

            {/* Juego 2 */}
            <div className="border-gold-gradient p-8 flex flex-col items-center" style={{ background: '#050505' }}>
              <div 
                className="w-full relative flex items-center justify-center overflow-hidden mb-6"
                style={{ aspectRatio: '630/500', background: '#0a0a0a', border: '1px solid rgba(201,168,76,0.1)' }}
              >
                <img src="/images/videojuegos/peak-of-binohmo-sword.png" alt="Peak of Binohmo Sword" className="absolute inset-0 w-full h-full object-cover z-0" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>

              <h3 className="font-cinzel text-2xl font-bold mb-3 text-center" style={{ color: 'var(--gold-light)' }}>
                Peak of Binohmo Sword
              </h3>

              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {['Clicker', 'Incremental', 'Forja', 'Minerales'].map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-cinzel tracking-widest uppercase" style={{ border: '1px solid rgba(139, 105, 20, 0.3)', color: 'var(--gold-muted)', background: 'rgba(0,0,0,0.5)' }}>
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-crimson flex-grow text-gray-400 text-center mb-8 max-w-[600px] text-lg">
                Forja la espada legendaria definitiva. Recolecta minerales raros, mejora tu yunque y asciende al pico del poder.
              </p>

              <div className="mt-auto">
                <MythicButton href="/videojuegos/peak-of-binohmo-sword">
                  Visitar página
                </MythicButton>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-12 gap-3"
            style={{
              border: '1px dashed rgba(201,168,76,0.15)',
              borderRadius: '2px',
            }}
          >
            <span style={{ color: 'var(--gold-dark)', fontSize: '2rem' }}>✦</span>
            <p className="font-cinzel text-sm tracking-widest uppercase" style={{ color: 'rgba(201,168,76,0.3)' }}>
              Contenido próximamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Decoración de esquinas ────────────────────────────────────────────────────
function Corner({
  pos,
  mirror = false,
  flipV = false,
}: {
  pos: string;
  mirror?: boolean;
  flipV?: boolean;
}) {
  return (
    <span
      className={`absolute ${pos} w-8 h-8`}
      style={{
        borderTop: flipV ? 'none' : '1px solid var(--gold-dark)',
        borderBottom: flipV ? '1px solid var(--gold-dark)' : 'none',
        borderLeft: mirror ? 'none' : '1px solid var(--gold-dark)',
        borderRight: mirror ? '1px solid var(--gold-dark)' : 'none',
        opacity: 0.6,
      }}
    />
  );
}
