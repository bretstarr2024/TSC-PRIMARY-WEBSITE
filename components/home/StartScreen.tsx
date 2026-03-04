'use client';

import { motion } from 'framer-motion';
import { ArcadeButton } from '@/components/ArcadeButton';

const PHOSPHOR = '#33ff33';
const DIM = '#1a8c1a';
const BG = '#0a0a0a';
const GLOW = `0 0 8px ${PHOSPHOR}, 0 0 16px rgba(51, 255, 51, 0.3)`;
const DIM_GLOW = `0 0 4px ${DIM}`;

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: BG }}
    >
      {/* Screen curvature vignette */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Green scanlines */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 0, 0.06) 2px,
            rgba(0, 255, 0, 0.06) 3px
          )`,
          opacity: 0.35,
        }}
      />

      {/* Content */}
      <div className="relative z-[5] flex flex-col items-center gap-10 md:gap-14">
        {/* Title */}
        <motion.div
          className="font-arcade text-center"
          style={{ color: PHOSPHOR, textShadow: GLOW }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-sm sm:text-base md:text-xl lg:text-2xl tracking-[0.2em] leading-relaxed">
            <div>THE STARR</div>
            <div>CONSPIRACY</div>
          </div>
        </motion.div>

        {/* Blinking PRESS START */}
        <motion.div
          className="font-arcade text-[9px] sm:text-[10px] md:text-xs tracking-wider"
          style={{ color: DIM, textShadow: DIM_GLOW }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.8, times: [0, 0.05, 0.45, 0.5, 1] }}
        >
          PRESS START
        </motion.div>

        {/* 1 Player button */}
        <ArcadeButton onClick={onStart} delay={0.8} />
      </div>

      {/* Bottom: CREDIT 00 */}
      <motion.div
        className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-0 right-0 text-center font-arcade text-[10px] sm:text-xs md:text-sm"
        style={{ color: DIM, textShadow: DIM_GLOW }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.1 }}
      >
        CREDIT  00
      </motion.div>
    </div>
  );
}
