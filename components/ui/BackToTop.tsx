'use client';

import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="group flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="w-12 h-12 rounded-full border border-gold-dark/40 bg-black/60 flex items-center justify-center text-gold-muted group-hover:border-gold-light group-hover:text-gold-light group-hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] transition-all">
        <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
      </div>
      <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-gold-dark group-hover:text-gold-light transition-colors">Volver arriba</span>
    </button>
  );
}
