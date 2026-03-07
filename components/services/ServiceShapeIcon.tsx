'use client';

import { motion, useReducedMotion } from 'framer-motion';

export type Shape = 'circle' | 'triangle' | 'square' | 'rectangle' | 'pentagon' | 'hexagon';

interface ServiceShapeIconProps {
  shape: Shape;
  color: string;
  size?: number;
  className?: string;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function lighten(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const lr = Math.min(255, r + (255 - r) * amount);
  const lg = Math.min(255, g + (255 - g) * amount);
  const lb = Math.min(255, b + (255 - b) * amount);
  return `rgb(${Math.round(lr)},${Math.round(lg)},${Math.round(lb)})`;
}

function darken(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgb(${Math.round(r * (1 - amount))},${Math.round(g * (1 - amount))},${Math.round(b * (1 - amount))})`;
}

function ShapePath({ shape }: { shape: Shape }) {
  switch (shape) {
    case 'circle':
      return <ellipse cx="50" cy="50" rx="38" ry="38" />;
    case 'triangle':
      return <polygon points="50,12 88,82 12,82" />;
    case 'square':
      return <rect x="16" y="16" width="68" height="68" rx="4" />;
    case 'rectangle':
      return <rect x="10" y="22" width="80" height="56" rx="4" />;
    case 'pentagon':
      return <polygon points="50,10 90,40 74,85 26,85 10,40" />;
    case 'hexagon':
      return <polygon points="50,8 88,28 88,72 50,92 12,72 12,28" />;
  }
}

export function ServiceShapeIcon({ shape, color, size = 48, className = '' }: ServiceShapeIconProps) {
  const reducedMotion = useReducedMotion();
  const gradId = `grad-${shape}-${color.replace('#', '')}`;
  const lightColor = lighten(color, 0.45);
  const darkColor = darken(color, 0.35);

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={reducedMotion ? {} : { rotateY: [0, 8, 0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ filter: `drop-shadow(0 4px 12px ${color}40)` }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lightColor} />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor={darkColor} />
          </linearGradient>
        </defs>
        <g fill={`url(#${gradId})`} stroke={lightColor} strokeWidth="1.5" opacity="0.9">
          <ShapePath shape={shape} />
        </g>
      </svg>
    </motion.div>
  );
}

export const CATEGORY_SHAPES: Record<string, Shape> = {
  'brand-strategy': 'circle',
  'gtm-strategy': 'triangle',
  'demand-pipeline': 'square',
  'digital-performance': 'rectangle',
  'content-creative': 'pentagon',
  'ai-marketing': 'hexagon',
};
