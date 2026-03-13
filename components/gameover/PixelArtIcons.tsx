'use client';

/**
 * Pixel art icons rendered as SVG rects on a grid.
 * Each icon is defined as rows of characters: X = filled, . = empty
 * shapeRendering="crispEdges" gives the authentic pixel look.
 */

import { motion } from 'framer-motion';

interface PixelGridProps {
  grid: string[];
  color: string;
  color2?: string;
  size?: number;
  className?: string;
}

function PixelGrid({ grid, color, color2, size = 4, className = '' }: PixelGridProps) {
  const rows = grid.length;
  const cols = Math.max(...grid.map((r) => r.length));
  return (
    <svg
      width={cols * size}
      height={rows * size}
      viewBox={`0 0 ${cols * size} ${rows * size}`}
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {grid.map((row, y) =>
        row.split('').map((ch, x) => {
          if (ch === '.') return null;
          const fill = ch === '2' && color2 ? color2 : color;
          return <rect key={`${x}-${y}`} x={x * size} y={y * size} width={size} height={size} fill={fill} />;
        })
      )}
    </svg>
  );
}

// ─── ICON DEFINITIONS ────────────────────────────────────────────

const COIN_GRID = [
  '..XXXX..',
  '.XXXXXX.',
  'XX2XX2XX',
  'XX22X2XX',
  'XX2X22XX',
  'XX2XX2XX',
  '.XXXXXX.',
  '..XXXX..',
];

const STAR_GRID = [
  '...X....',
  '...XX...',
  '.XXXXXX.',
  'XXXXXXXX',
  '.XXXXXX.',
  '..XXXX..',
  '.XX..XX.',
  'XX....XX',
];

const SKULL_GRID = [
  '..XXXX..',
  '.XXXXXX.',
  'X..XX..X',
  'XXXXXXXX',
  'XXXXXXXX',
  '.XX..XX.',
  '.X.XX.X.',
  '..X..X..',
];

const TROPHY_GRID = [
  'X.XXXX.X',
  'XXXXXXXX',
  'XXXXXXXX',
  '.XXXXXX.',
  '..XXXX..',
  '...XX...',
  '...XX...',
  '..XXXX..',
  '.XXXXXX.',
];

const LIGHTNING_GRID = [
  '....XX',
  '...XX.',
  '..XX..',
  '.XXXXX',
  '..XX..',
  '.XX...',
  'XX....',
];

const DIAMOND_GRID = [
  '...X...',
  '..XXX..',
  '.XXXXX.',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];

const HEART_GRID = [
  '.XX.XX.',
  'XXXXXXX',
  'XXXXXXX',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];

const JOYSTICK_GRID = [
  'X......X',
  'XXXXXXXX',
  'XXXXXXXX',
  '.XX..XX.',
  '..XXXX..',
  '...XX...',
];

const DPAD_GRID = [
  '..XX..',
  '..XX..',
  'XXXXXX',
  'XXXXXX',
  '..XX..',
  '..XX..',
];

const BOMB_GRID = [
  '....2X..',
  '...2X...',
  '..XXXX..',
  '.XXXXXX.',
  'XX2XXXXX',
  'X22XXXXX',
  '.XXXXXX.',
  '..XXXX..',
];

const POTION_GRID = [
  '..XXXX..',
  '..X22X..',
  '...XX...',
  '..XXXX..',
  '.XXXXXX.',
  '.X2XXXX.',
  '.XX2XXX.',
  '..XXXX..',
];

const CROWN_GRID = [
  'X..X..X.',
  'XX.X.XX.',
  'XXXXXXX.',
  'XXXXXXX.',
  '.XXXXX..',
];

// ─── EXPORTED ICON COMPONENTS ────────────────────────────────────

export function CoinIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={COIN_GRID} color="#FFD700" color2="#B8860B" size={size} className={className} />;
}

export function StarIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={STAR_GRID} color="#FFD700" size={size} className={className} />;
}

export function SkullIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={SKULL_GRID} color="#d1d1c6" size={size} className={className} />;
}

export function TrophyIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={TROPHY_GRID} color="#FFD700" color2="#B8860B" size={size} className={className} />;
}

export function LightningIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={LIGHTNING_GRID} color="#E1FF00" size={size} className={className} />;
}

export function DiamondIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={DIAMOND_GRID} color="#73F5FF" size={size} className={className} />;
}

export function HeartIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={HEART_GRID} color="#FF3333" size={size} className={className} />;
}

export function JoystickIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={JOYSTICK_GRID} color="#FF5910" size={size} className={className} />;
}

export function DpadIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={DPAD_GRID} color="#FF5910" size={size} className={className} />;
}

export function BombIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={BOMB_GRID} color="#333" color2="#FF3333" size={size} className={className} />;
}

export function PotionIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={POTION_GRID} color="#7C3AED" color2="#a855f7" size={size} className={className} />;
}

export function CrownIcon({ size = 4, className = '' }: { size?: number; className?: string }) {
  return <PixelGrid grid={CROWN_GRID} color="#FFD700" size={size} className={className} />;
}

// ─── FLOATING PIXEL WRAPPER ──────────────────────────────────────

interface FloatingPixelProps {
  children: React.ReactNode;
  x: string; // CSS left/right position
  y: string; // CSS top position
  delay?: number;
  duration?: number;
  drift?: number; // px of Y drift
  rotate?: boolean;
  opacity?: number;
  glow?: string; // glow color
}

export function FloatingPixel({
  children,
  x,
  y,
  delay = 0,
  duration = 6,
  drift = 20,
  rotate = false,
  opacity = 0.5,
  glow,
}: FloatingPixelProps) {
  return (
    <motion.div
      className="absolute pointer-events-none z-[1]"
      style={{ left: x, top: y, filter: glow ? `drop-shadow(0 0 8px ${glow})` : undefined }}
      initial={{ opacity: 0, y: 0 }}
      whileInView={{ opacity }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay }}
    >
      <motion.div
        animate={{
          y: [-drift / 2, drift / 2, -drift / 2],
          rotate: rotate ? [0, 360] : undefined,
        }}
        transition={{
          y: { duration, repeat: Infinity, ease: 'easeInOut' },
          rotate: rotate ? { duration: duration * 2, repeat: Infinity, ease: 'linear' } : undefined,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
