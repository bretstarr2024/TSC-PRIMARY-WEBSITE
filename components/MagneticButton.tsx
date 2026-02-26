'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  isExternal?: boolean;
  magneticStrength?: number;
  ctaId?: string;
}

export function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  isExternal = false,
  magneticStrength = 0.3,
  ctaId,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - centerX) * magneticStrength,
      y: (e.clientY - centerY) * magneticStrength,
    });
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  const baseClasses =
    variant === 'primary'
      ? 'inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-atomic-tangerine rounded-lg hover:bg-hot-sauce transition-colors focus:outline-none focus:ring-2 focus:ring-atomic-tangerine focus:ring-offset-2 focus:ring-offset-heart-of-darkness'
      : 'inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white border border-white/20 rounded-lg hover:bg-white/5 hover:border-white/40 transition-all focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-heart-of-darkness';

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={resetPosition}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
      className="inline-block"
    >
      <motion.span
        className={`${baseClasses} ${className} hover:no-underline relative overflow-hidden group`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </span>
        <span className="relative z-10">{children}</span>
      </motion.span>
    </motion.div>
  );

  if (href) {
    const trackProps = ctaId ? {
      'data-track-cta': ctaId,
      'data-track-component': 'MagneticButton',
      'data-track-destination': href,
    } : {};
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...trackProps}>
          {content}
        </a>
      );
    }
    return <Link href={href} {...trackProps}>{content}</Link>;
  }

  return (
    <button onClick={onClick} type="button" className="appearance-none bg-transparent border-none p-0 m-0">
      {content}
    </button>
  );
}
