'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface MythicButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Un botón premium optimizado con efecto de brillo metálico.
 */
export default function MythicButton({
  children,
  href,
  onClick,
  className = '',
  style = {},
}: MythicButtonProps) {
  const [coords, setCoords] = useState({ x: '50%', y: '50%' });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x: `${x}px`, y: `${y}px` });
  };

  // Estilos comunes para inyectar las variables CSS
  const commonProps = {
    onMouseMove: handleMouseMove,
    className: `btn-mythic group relative ${className}`,
    style: {
      ...style,
      // @ts-ignore
      '--x': coords.x,
      '--y': coords.y,
    },
  };

  const innerContent = (
    <>
      <span className="btn-text relative z-10 pointer-events-none">{children}</span>
      {/* El brillo que sigue al mouse */}
      <span className="btn-border-shine" />
    </>
  );

  if (href) {
    return (
      <Link href={href} {...commonProps} onClick={onClick}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button {...commonProps} onClick={onClick}>
      {innerContent}
    </button>
  );
}
