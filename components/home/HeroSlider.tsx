'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// SLIDES — Editá el array de abajo para cambiar las imágenes del hero slider.
// Reemplazá el campo `image` con la ruta de la imagen que quieras usar.
// Podés usar rutas relativas (ej: '/images/slide1.jpg') o URLs externas.
// ─────────────────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    image: '/images/hero/slide1.jpg', // ← CAMBIÁ ESTA RUTA
    title: 'Un mundo forjado por los dioses',
    subtitle: 'Donde la magia teje el destino de héroes, bestias y civilizaciones olvidadas.',
  },
  {
    id: 2,
    image: '/images/hero/slide2.jpg', // ← CAMBIÁ ESTA RUTA
    title: 'Las crónicas del Origen',
    subtitle: 'Desde el Vacío Primigenio hasta las guerras que dividieron el cielo.',
  },
  {
    id: 3,
    image: '/images/hero/slide3.jpg', // ← CAMBIÁ ESTA RUTA
    title: 'Leyendas que no mueren',
    subtitle: 'Los nombres que el tiempo grabó en piedra, sangre y estrella.',
  },
];

// Duración de cada slide en milisegundos (5000 = 5 seg, 10000 = 10 seg)
const SLIDE_DURATION = 7000;

// Color de placeholder cuando la imagen no carga
const PLACEHOLDER_GRADIENT = 'linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)';

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [loaded, setLoaded] = useState<boolean[]>(SLIDES.map(() => false));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number, dir = 1) => {
      setDirection(dir);
      setCurrent(index);
    },
    []
  );

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, -1);
  }, [current, goTo]);

  // Autoplay
  useEffect(() => {
    timerRef.current = setTimeout(next, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, next]);

  // Preload images
  useEffect(() => {
    SLIDES.forEach((slide, i) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () =>
        setLoaded((prev: boolean[]) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
    });
  }, []);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '6%' : '-6%',
      opacity: 0,
      scale: 1.04,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-6%' : '6%',
      opacity: 0,
      scale: 0.97,
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.3 + i * 0.15, duration: 0.7, ease: 'easeOut' },
    }),
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        // 16:9 que ocupa el 100% del viewport
        height: '100svh',
        aspectRatio: '16 / 9',
        maxHeight: '100svh',
      }}
    >
      {/* ── Fondo Slides ───────────────────────────────────────── */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Imagen de fondo */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: loaded[current]
                ? `url('${SLIDES[current].image}')`
                : PLACEHOLDER_GRADIENT,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          {/* ── Capas de oscurecimiento ─────────────────────── */}
          {/* Overlay oscuro general (ajusta opacity para más/menos oscuridad) */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.52)' }}
          />
          {/* Gradiente desde la izquierda para destacar el texto */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(100deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)',
            }}
          />
          {/* Gradiente desde abajo */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.3) 40%, transparent 100%)',
            }}
          />
          {/* Viñeta sutil desde los bordes */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 120px rgba(0,0,0,0.5)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Contenido de Texto (lado izquierdo) ───────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div key={`text-${current}`} className="flex flex-col gap-4">
            {/* Pequeño label decorativo */}
            <motion.span
              custom={0}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="font-cinzel text-xs tracking-[0.4em] uppercase"
              style={{ color: 'var(--gold-dark)' }}
            >
              ✦ Tierras Sagradas ✦
            </motion.span>

            {/* Título principal */}
            <motion.h1
              custom={1}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="font-cinzel font-bold leading-tight"
              style={{
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                color: '#f0e8d4',
                textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,76,0.1)',
              }}
            >
              {SLIDES[current].title}
            </motion.h1>

            {/* Separador dorado */}
            <motion.div
              custom={2}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              style={{
                width: '7rem',
                height: '1px',
                background: 'linear-gradient(90deg, var(--gold), transparent)',
              }}
            />

            {/* Subtítulo */}
            <motion.p
              custom={3}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="font-crimson text-lg md:text-xl max-w-xl"
              style={{
                color: 'rgba(208,200,180,0.85)',
                textShadow: '0 1px 8px rgba(0,0,0,0.8)',
                lineHeight: 1.6,
              }}
            >
              {SLIDES[current].subtitle}
            </motion.p>

            {/* CTA Button */}
            <motion.div
              custom={4}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mt-4"
            >
              <a href="#leyendas" className="btn-mythic inline-flex">
                <span className="btn-text">Explorar la Mitología</span>
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Controles de Navegación ────────────────────────────── */}
      {/* Flecha izquierda */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-all duration-300 group"
        style={{
          background: 'rgba(8,8,8,0.5)',
          border: '1px solid rgba(201,168,76,0.25)',
        }}
        aria-label="Anterior"
      >
        <ChevronLeft
          size={18}
          style={{ color: 'var(--gold)' }}
          className="transition-transform group-hover:scale-110"
        />
      </button>

      {/* Flecha derecha */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-all duration-300 group"
        style={{
          background: 'rgba(8,8,8,0.5)',
          border: '1px solid rgba(201,168,76,0.25)',
        }}
        aria-label="Siguiente"
      >
        <ChevronRight
          size={18}
          style={{ color: 'var(--gold)' }}
          className="transition-transform group-hover:scale-110"
        />
      </button>

      {/* ── Dots indicadores ───────────────────────────────────── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Ir al slide ${i + 1}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? '2rem' : '0.5rem',
              height: '3px',
              background:
                i === current
                  ? 'linear-gradient(90deg, var(--gold-dark), var(--gold-bright))'
                  : 'rgba(201,168,76,0.3)',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* ── Borde inferior decorativo ──────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)',
        }}
      />
    </section>
  );
}
