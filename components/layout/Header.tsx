'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// ─── Categorías de navegación ─────────────────────────────────
// Agrega o quita categorías aquí para actualizar el menú del header
const NAV_CATEGORIES = [
  { label: 'Leyendas',    href: '#leyendas' },
  { label: 'Biografías',  href: '#biografias' },
  { label: 'Museo',       href: '#museo' },
  { label: 'Tierras',     href: '#tierras' },
  { label: 'Videojuegos', href: '#videojuegos' },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) return null;

  // Detecta scroll para activar el blur del header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(8,8,8,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled
            ? '1px solid rgba(201,168,76,0.15)'
            : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* ── Logo y Banner ─────────────────────────────────────────── */}
          <div className="flex items-center gap-4 md:gap-5">
            <Link href="/">
              <motion.img 
                src="/images/demas/banner.webp" 
                alt="Banner / Emblema" 
                className="w-9 sm:w-11 h-auto object-contain cursor-pointer opacity-90 drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]"
                whileHover={{ y: 2, scale: 0.98, opacity: 1 }}
                whileTap={{ y: 8, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
              />
            </Link>

            <Link href="/" className="group relative flex flex-col leading-none select-none">
            {/* Texto "TIERRAS" */}
            <span
              className="font-cinzel text-xs tracking-[0.5em] uppercase"
              style={{ color: 'var(--gold-dark)' }}
            >
              Tierras
            </span>
            {/* Texto "SAGRADAS" */}
            <span
              className="font-cinzel text-xl font-bold text-gold-gradient-animated tracking-[0.15em] uppercase"
            >
              Sagradas
            </span>
            {/* Línea decorativa bajo el logo */}
            <div className="absolute -bottom-2 left-0 w-0 h-px bg-gold-dark group-hover:w-full transition-all duration-300" />
          </Link>
          </div>

          {/* ── Nav Desktop ──────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_CATEGORIES.map((cat) => (
              <NavLink key={cat.href} href={cat.href} label={cat.label} />
            ))}
          </nav>

          {/* ── Botón Mobile ─────────────────────────────────── */}
          <button
            className="md:hidden p-2 transition-colors"
            style={{ color: 'var(--gold)' }}
            onClick={() => setMobileOpen((v: boolean) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Menú Mobile ──────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-[73px] left-0 right-0 z-40 flex flex-col gap-2 px-6 py-4"
            style={{
              background: 'rgba(8,8,8,0.97)',
              borderBottom: '1px solid rgba(201,168,76,0.2)',
              backdropFilter: 'blur(16px)',
            }}
          >
            {NAV_CATEGORIES.map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="font-cinzel text-sm uppercase tracking-widest py-3 px-2 border-b transition-colors"
                style={{
                  color: 'var(--gold)',
                  borderColor: 'rgba(201,168,76,0.1)',
                }}
              >
                {cat.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Componente de enlace de nav con efecto hover ────────────────
function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative px-4 py-2 font-cinzel text-xs tracking-[0.15em] uppercase transition-all duration-300"
      style={{
        color: hovered ? 'var(--gold-light)' : 'var(--gold-muted)',
        textShadow: hovered ? '0 0 8px rgba(255,215,0,0.35)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      {/* Línea inferior animada */}
      <span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px transition-all duration-300"
        style={{
          width: hovered ? '80%' : '0%',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        }}
      />
    </a>
  );
}
