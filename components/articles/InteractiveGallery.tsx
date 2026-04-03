'use client';

import { useState } from 'react';
import { urlForImage } from '@/lib/sanity.image';
import Lightbox from '@/components/ui/Lightbox';
import { motion } from 'framer-motion';

interface InteractiveGalleryProps {
  images: any[];
  landName: string;
}

export default function InteractiveGallery({ images, landName }: InteractiveGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const allImageUrls = images
    .map((img) => urlForImage(img)?.width(1600).url())
    .filter(Boolean) as string[];

  const openLightbox = (index: number) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {images.map((img: any, idx: number) => {
          const thumbUrl = urlForImage(img)?.width(600).height(400).url();
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => openLightbox(idx)}
              className="overflow-hidden border border-gold-dark/20 rounded-sm shadow-lg bg-black/80 group cursor-pointer relative"
            >
              <div className="absolute inset-0 bg-gold-light/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              {thumbUrl && (
                <img
                  src={thumbUrl}
                  alt={img.caption || landName}
                  className="w-full h-48 object-cover transition-all duration-700 opacity-90 group-hover:opacity-100"
                />
              )}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <div className="p-1.5 bg-black/60 backdrop-blur-sm border border-gold-dark/30 rounded-full">
                  <svg className="w-3 h-3 text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Lightbox
        images={allImageUrls}
        initialIndex={photoIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
