'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Columnas del footer ──────────────────────────────────────────────────────
const FOOTER_LINKS = {
  explorar: [
    { label: 'Leyendas', href: '#leyendas' },
    { label: 'Biografías', href: '#biografias' },
    { label: 'Museo', href: '#museo' },
    { label: 'Tierras', href: '#tierras' },
    { label: 'Videojuegos', href: '#videojuegos' },
  ],
  proyecto: [
    { label: 'Sobre el proyecto', action: 'about' },
    { label: 'Historia del mundo', href: '#' },
    { label: 'Cronología', href: '#' },
    { label: 'Mapa del mundo', href: '#' },
  ],
  participar: [
    { label: 'Contribuir', href: '#' },
    { label: 'Foro de lore', href: '#' },
    { label: 'Contacto', action: 'contact' },
  ],
} as const;

export default function Footer() {
  const pathname = usePathname();
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  if (pathname?.startsWith('/studio')) return null;

  return (
    <>
      <footer
        className="relative pt-16 pb-8 px-6"
      style={{
        background: 'rgba(5, 5, 5, 0.4)',
        backdropFilter: 'blur(3px)',
        borderTop: '1px solid rgba(201,168,76,0.2)',
      }}
    >
      {/* ── Línea dorada decorativa superior ───────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--gold-dark), var(--gold), var(--gold-dark), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* ── Fila principal ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* ── Identidad del sitio ──────────────────────────────── */}
          <div className="flex flex-col gap-5">
            {/* Logo */}
            <div className="flex flex-col leading-none">
              <span
                className="font-cinzel text-[10px] tracking-[0.5em] uppercase"
                style={{ color: 'var(--gold-dark)' }}
              >
                Tierras
              </span>
              <span
                className="font-cinzel text-xl font-bold tracking-[0.15em] uppercase text-gold-gradient"
                style={{
                  background: 'var(--gradient-gold)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sagradas
              </span>
            </div>

            {/* Descripción lore */}
            <p
              className="font-crimson text-sm leading-relaxed"
              style={{ color: 'rgba(180,170,150,0.6)' }}
            >
              Portal enciclopédico de la mitología de Tierras Sagradas. Un universo
              de leyendas, dioses y héroes que aguarda ser descubierto.
            </p>

            {/* Ornamento */}
            <div
              className="w-12 h-px mt-1"
              style={{ background: 'linear-gradient(90deg, var(--gold-dark), transparent)' }}
            />

            {/* Frase lore */}
            <p
              className="font-crimson italic text-xs"
              style={{ color: 'rgba(201,168,76,0.45)' }}
            >
              &quot;El mundo fue escrito antes de que el primer hombre aprendiese a leer.&quot;
            </p>
          </div>

          {/* ── Explorar ─────────────────────────────────────────── */}
          <FooterCol title="Explorar" links={FOOTER_LINKS.explorar} />

          {/* ── Proyecto ─────────────────────────────────────────── */}
          <FooterCol 
            title="El Proyecto" 
            links={FOOTER_LINKS.proyecto} 
            onAction={(action) => {
              if (action === 'about') setShowAbout(true);
            }}
          />

          {/* ── Participar ───────────────────────────────────────── */}
          <FooterCol 
            title="Participar" 
            links={FOOTER_LINKS.participar} 
            onAction={(action) => {
              if (action === 'contact') setShowContact(true);
            }} 
          />
        </div>

        {/* ── Separador ornamental ────────────────────────────────── */}
        <div className="ornament-divider mb-8">
          <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: '0.6rem' }}>✦</span>
        </div>

        {/* ── Pie de página ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="font-cinzel text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(201,168,76,0.3)' }}
          >
            © {new Date().getFullYear()} Tierras Sagradas — Todos los derechos reservados
          </p>

          <p
            className="font-crimson text-xs italic"
            style={{ color: 'rgba(180,170,150,0.3)' }}
          >
            Forjado en las llamas del mito
          </p>
        </div>
      </div>
    </footer>

    <AnimatePresence>
      {/* Modal de Contacto */}
      {showContact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative p-8 md:p-10 max-w-md w-full border border-gold-dark/30 flex flex-col items-center text-center shadow-[0_0_50px_rgba(201,168,76,0.1)]"
              style={{ background: 'linear-gradient(135deg, rgba(15,15,15,0.98) 0%, rgba(5,5,5,0.99) 100%)' }}
            >
              <button 
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-5 text-2xl outline-none transition-colors duration-300"
                style={{ color: 'rgba(201,168,76,0.5)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(201,168,76,0.5)')}
              >
                ×
              </button>
              
              <h3 className="font-cinzel text-xl font-bold uppercase tracking-[0.15em] mb-2" style={{ color: 'var(--gold-light)' }}>
                Establecer Contacto
              </h3>
              <div className="w-16 h-px mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dark), transparent)' }} />
              
              <p className="font-crimson text-base leading-relaxed mb-8" style={{ color: 'rgba(180,170,150,0.7)' }}>
                Si los heraldos fallan, envía tus pergaminos directamente al templo. Los escribas del santuario te responderán a la brevedad.
              </p>
              
              <div className="px-6 py-4 border border-gold-dark/20 w-full mb-2 group hover:border-gold-dark/40 transition-colors duration-300 bg-black/40">
                <span className="font-cinzel text-[13px] md:text-sm tracking-[0.1em] md:tracking-[0.15em]" style={{ color: 'var(--gold)' }}>
                  sacredlands1@outlook.com
                </span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Sobre el Proyecto */}
        {showAbout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 backdrop-blur-sm bg-black/80">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative p-8 md:p-14 max-w-2xl w-full border border-gold-dark/30 flex flex-col items-center text-center shadow-[0_0_80px_rgba(201,168,76,0.15)]"
              style={{ background: 'linear-gradient(135deg, rgba(20,15,5,0.98) 0%, rgba(5,5,5,0.99) 100%)' }}
            >
              <button 
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-6 text-3xl outline-none transition-colors duration-300"
                style={{ color: 'rgba(201,168,76,0.5)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(201,168,76,0.5)')}
              >
                ×
              </button>
              
              <div className="mb-8 relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border border-gold-dark/50 shadow-[0_0_30px_rgba(201,168,76,0.2)]">
                <img src="/images/pobs/LogoTS.png" alt="Tierras Sagradas Logo" className="w-full h-full object-cover" />
              </div>
              
              <h3 className="font-cinzel text-2xl md:text-3xl font-bold uppercase tracking-[0.1em] mb-3" style={{ color: 'var(--gold-light)' }}>
                Tierras Sagradas
              </h3>
              <div className="w-32 h-px mb-8" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-dark), transparent)' }} />
              
              <p className="font-crimson text-base md:text-xl leading-relaxed mb-6" style={{ color: 'rgba(190,180,160,0.85)' }}>
                Nacido desde la imaginación de dos amigos de Argentina, este proyecto pronto se expandió mucho más allá de simples historias.
              </p>
              
              <p className="font-crimson text-base md:text-xl leading-relaxed" style={{ color: 'rgba(190,180,160,0.85)' }}>
                Hoy en día, Tierras Sagradas es una <strong style={{ color: 'var(--gold)' }}>mitología entera y viva</strong>: dioses colosales, imperios asombrosos, ciudades caídas, leyendas, armas destructivas, minerales puros y videojuegos que siguen expandiéndose constantemente.
              </p>
              
              <div className="mt-10">
                <span className="font-cinzel text-[11px] md:text-xs tracking-[0.3em] uppercase opacity-40" style={{ color: 'var(--gold-dark)' }}>
                  Forjado en Argentina con pasión
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Componente de columna de links ───────────────────────────────────────────
function FooterCol({
  title,
  links,
  onAction,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href?: string; action?: string }>;
  onAction?: (action: string) => void;
}) {
  const playHoverSound = () => {
    const audio = new Audio('/sfx/uitic.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {
      // Ignorar el error si el navegador bloquea el autoplay antes de la interacción del usuario
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Título de columna */}
      <h4
        className="font-cinzel text-xs tracking-[0.3em] uppercase font-semibold"
        style={{ color: 'var(--gold)' }}
      >
        {title}
      </h4>

      {/* Línea decorativa */}
      <div
        className="w-8 h-px"
        style={{ background: 'linear-gradient(90deg, var(--gold-dark), transparent)' }}
      />

      {/* Links */}
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <a
                href={link.href}
                onMouseEnter={playHoverSound}
                className="footer-link font-crimson text-sm group flex items-center gap-2"
              >
                <span
                  className="w-2 h-px transition-all duration-300 group-hover:w-4"
                  style={{ background: 'var(--gold-dark)', display: 'inline-block' }}
                />
                {link.label}
              </a>
            ) : (
              <button
                onClick={() => link.action && onAction?.(link.action)}
                onMouseEnter={playHoverSound}
                className="footer-link font-crimson text-sm group flex items-center gap-2 focus:outline-none"
              >
                <span
                  className="w-2 h-px transition-all duration-300 group-hover:w-4"
                  style={{ background: 'var(--gold-dark)', display: 'inline-block' }}
                />
                {link.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
