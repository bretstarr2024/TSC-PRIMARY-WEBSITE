'use client';

import { motion } from 'framer-motion';

const PHOSPHOR = '#33ff33';
const DIM = '#1a8c1a';
const BG = '#0a0a0a';
const GLOW = `0 0 8px ${PHOSPHOR}, 0 0 16px rgba(51, 255, 51, 0.3)`;
const DIM_GLOW = `0 0 4px ${DIM}`;

export function RetroGameScreen() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: BG }}
      initial={{ opacity: 0, filter: 'brightness(0.3)' }}
      animate={{ opacity: 1, filter: 'brightness(1)' }}
      transition={{ duration: 0.6 }}
    >
      {/* CRT monitor bezel */}
      <div
        className="relative w-full max-w-2xl mx-4 overflow-hidden"
        style={{
          aspectRatio: '4 / 3',
          borderRadius: '12px',
          border: `2px solid #222`,
          boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Screen curvature vignette */}
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)',
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
        <div
          className="relative z-[5] h-full font-arcade flex flex-col justify-between p-6 md:p-10"
          style={{ color: PHOSPHOR, backgroundColor: BG }}
        >
          {/* Top score bar */}
          <div className="flex justify-between text-[7px] sm:text-[8px] md:text-[10px]" style={{ textShadow: GLOW }}>
            <div className="text-center">
              <div style={{ color: DIM, textShadow: DIM_GLOW }}>1UP</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.1 }}
              >
                002026
              </motion.div>
            </div>
            <div className="text-center">
              <div style={{ color: DIM, textShadow: DIM_GLOW }}>HIGH SCORE</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.1 }}
              >
                010000
              </motion.div>
            </div>
            <div className="text-center">
              <div style={{ color: DIM, textShadow: DIM_GLOW }}>2UP</div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.1 }}
              >
                ------
              </motion.div>
            </div>
          </div>

          {/* Center: GAME OVER + empty hearts */}
          <div className="text-center flex-1 flex flex-col items-center justify-center gap-6">
            <motion.div
              className="text-base sm:text-lg md:text-2xl tracking-[0.3em]"
              style={{ textShadow: GLOW }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                times: [0, 0.45, 0.5, 0.95],
              }}
            >
              GAME OVER
            </motion.div>

            {/* Empty hearts — lives depleted */}
            <div
              className="flex justify-center gap-3 text-sm md:text-base"
              style={{ color: DIM, textShadow: DIM_GLOW }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.1 }}
              >
                ♡
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.1 }}
              >
                ♡
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.1 }}
              >
                ♡
              </motion.span>
            </div>
          </div>

          {/* Bottom: CREDIT */}
          <motion.div
            className="text-center text-[7px] sm:text-[8px] md:text-[10px]"
            style={{ color: DIM, textShadow: DIM_GLOW }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.1 }}
          >
            CREDIT  00
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
