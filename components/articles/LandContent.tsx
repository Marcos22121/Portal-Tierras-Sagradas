'use client';

import { useState } from 'react';
import { PortableText } from '@/components/articles/PortableText';
import { Maximize2 } from 'lucide-react';
import Lightbox from '@/components/ui/Lightbox';
import { motion } from 'framer-motion';

interface LandContentProps {
  description: any;
  sideImgUrl: string | null;
  landName: string;
}

export default function LandContent({ description, sideImgUrl, landName }: LandContentProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  return (
    <div className="lg:col-span-12 flex flex-col">
      <h4 className="font-cinzel text-3xl text-gold-light mb-10 flex items-center gap-4 border-b border-gold-dark/20 pb-4 gold-glow-hover">
        <span className="text-gold-dark text-xl drop-shadow-lg">✦</span> Archivos del Reino
      </h4>
      
      <div className="flex flex-col xl:flex-row gap-16 items-start">
        <div className={`space-y-10 text-gray-300 font-crimson text-[1.25rem] md:text-[1.55rem] leading-[2] text-justify opacity-95 prose-gold ${sideImgUrl ? 'xl:w-[75%]' : 'w-full'}`}>
          <PortableText value={description} />
        </div>
        
        {/* Imagen lateral interactiva */}
        {sideImgUrl && (
          <motion.div 
            whileHover={{ scale: 1.03 }}
            onClick={() => setIsLightboxOpen(true)}
            className="xl:w-[22%] aspect-[2/3.5] w-full max-w-sm mx-auto xl:max-w-none overflow-hidden border border-gold-dark/30 rounded-sm shadow-2xl relative group flex-shrink-0 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            <img 
              src={sideImgUrl} 
              alt={`Detalle de ${landName}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute inset-0 border-[10px] border-black/10 z-20 pointer-events-none" />
            
            {/* Overlay de expansión */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
              <div className="p-4 bg-black/60 backdrop-blur-md border border-gold-dark/40 rounded-full shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                <Maximize2 className="text-gold-light w-8 h-8 drop-shadow-lg" />
              </div>
            </div>

            {/* Hint visual */}
            <div className="absolute bottom-4 left-0 right-0 text-center z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="font-cinzel text-[10px] tracking-[0.3em] uppercase text-gold-muted">Expandir Arcano</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox para la imagen lateral */}
      {sideImgUrl && (
        <Lightbox
          images={[sideImgUrl]}
          initialIndex={0}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}
