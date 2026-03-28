'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    { label: 'Sobre el proyecto', href: '#' },
    { label: 'Historia del mundo', href: '#' },
    { label: 'Cronología', href: '#' },
    { label: 'Mapa del mundo', href: '#' },
  ],
  participar: [
    { label: 'Contribuir', href: '#' },
    { label: 'Foro de lore', href: '#' },
    { label: 'Contacto', href: '#' },
  ],
} as const;

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/studio')) return null;

  return (
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
          <FooterCol title="El Proyecto" links={FOOTER_LINKS.proyecto} />

          {/* ── Participar ───────────────────────────────────────── */}
          <FooterCol title="Participar" links={FOOTER_LINKS.participar} />
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
  );
}

// ─── Componente de columna de links ───────────────────────────────────────────
function FooterCol({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;
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
          <li key={link.href}>
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
          </li>
        ))}
      </ul>
    </div>
  );
}
