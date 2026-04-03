'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface LightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, index]);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm px-4 md:px-20 py-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-10 md:right-10 z-[200] p-4 text-gold-light hover:text-gold-bright transition-all bg-black/80 hover:bg-black rounded-full border border-gold-dark/40 shadow-[0_0_30px_rgba(0,0,0,0.9)] gold-glow-hover group flex items-center justify-center cursor-pointer pointer-events-auto"
            aria-label="Cerrar visor"
          >
            <X size={36} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-gold-muted hover:text-gold-bright transition-all hover:scale-110 active:scale-95 bg-white/5 hover:bg-white/10 rounded-sm border border-gold-dark/20"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={next}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-[110] p-4 text-gold-muted hover:text-gold-bright transition-all hover:scale-110 active:scale-95 bg-white/5 hover:bg-white/10 rounded-sm border border-gold-dark/20"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Main Image */}
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
          >
            <img
              src={images[index]}
              alt={`Gallery image ${index + 1}`}
              className="max-w-full max-h-full object-contain shadow-[0_0_80px_rgba(201,168,76,0.15)] border border-gold-dark/10 pointer-events-auto"
            />
            
            {/* Counter */}
            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 font-cinzel text-gold-muted text-xs tracking-widest bg-black/60 px-4 py-2 border border-gold-dark/20 rounded-sm">
              {index + 1} / {images.length}
            </div>
          </motion.div>

          {/* Background decoration */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, var(--gold-dark) 0%, transparent 70%)' }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
