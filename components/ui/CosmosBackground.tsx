'use client';

import { useEffect, useRef } from 'react';

export default function CosmosBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Configuración para resoluciones altas
    // Configuración para resoluciones dinámicas basadas en el contenedor padre
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Obtenemos las dimensiones completas del contenedor incluyendo el padding
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    
    const observer = new ResizeObserver(() => resizeCanvas());
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }
    resizeCanvas();

    // Arreglo de partículas/estrellas
    const stars: { x: number; y: number; radius: number; speedX: number; speedY: number; opacity: number; flicker: number }[] = [];
    const numStars = 120;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.2,   // Deriva lenta horizontal
        speedY: (Math.random() * 0.2) + 0.05,  // Subida constante y súper lenta
        opacity: Math.random(),
        flicker: (Math.random() * 0.01) + 0.005, // Parpadeo pausado
      });
    }

    const draw = () => {
      // Limpiar lienzo. No usamos fill negro porque el background de la web es el "espacio".
      // Borramos completamente el contenido previo de forma eficiente.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Nebula dorada tenue y asimétrica de fondo (como polvo estelar gigante)
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.6, canvas.height * 0.4, 0,
        canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height) * 0.7
      );
      gradient.addColorStop(0, 'rgba(201, 168, 76, 0.035)'); // Centro dorado levísimo
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Se funde con el negro
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar y animar estrellas
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        // Efecto tintineo (flickering)
        star.opacity += star.flicker;
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.flicker = -star.flicker;
        } else if (star.opacity <= 0.1) {
          star.opacity = 0.1;
          star.flicker = -star.flicker;
        }
        
        // Dorado base para las estrellas. Varían sutilmente dependiendo de la opacidad.
        ctx.fillStyle = `rgba(255, 215, 0, ${star.opacity * 0.7})`; 
        ctx.fill();

        // Darle un resplandor (glow) sólo a las estrellas más grandes y brillantes
        if (star.radius > 1 && star.opacity > 0.5) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
        } else {
          ctx.shadowBlur = 0;
        }

        // Movimiento flotante imitado galaxia
        star.y -= star.speedY;
        star.x -= star.speedX;

        // Resetear cuando salen de la pantalla para crear un bucle infinito
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.x < -10) star.x = canvas.width + 10;
        if (star.x > canvas.width + 10) star.x = -10;
      }

      // Reiniciar sombras para no afectar otros dibujos
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }} // Detrás del contenido de esta sección
    />
  );
}
