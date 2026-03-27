import React from 'react';

export const metadata = {
  title: 'Peak of Binohmo Sword | Videojuegos',
  description: 'Descubre todo sobre Peak of Binohmo Sword.',
};

export default function PeakOfBinohmoSwordPage() {
  return (
    <div className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        {/* Decoración superior */}
        <div className="ornament-divider mb-8">
          <span style={{ color: 'var(--gold-dark)', fontSize: '0.9rem' }}>✦</span>
        </div>

        <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-6 text-gold-gradient">
          Peak of Binohmo Sword
        </h1>
        
        <p className="font-crimson text-xl text-gray-400 mb-12">
          (Contenido a desarrollar en el futuro)
        </p>
        
        <div className="border-gold-gradient p-10 bg-black/50 inline-block">
          <span className="font-cinzel tracking-widest uppercase text-gold-muted text-sm">
            Próximamente
          </span>
        </div>
      </div>
    </div>
  );
}
