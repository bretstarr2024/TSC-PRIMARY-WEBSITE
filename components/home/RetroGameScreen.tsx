'use client';

import { motion } from 'framer-motion';

const PHOSPHOR = '#33ff33';
const DIM = '#1a8c1a';
const BG = '#0a0a0a';
const GLOW = `0 0 8px ${PHOSPHOR}, 0 0 16px rgba(51, 255, 51, 0.3)`;
const DIM_GLOW = `0 0 4px ${DIM}`;

interface RetroGameScreenProps {
  /** Whether GAME OVER blinks (Frame 1) or stays solid (Frame 2) */
  blinking?: boolean;
  /** Whether to show the subhead text below GAME OVER (Frame 2) */
  showSubhead?: boolean;
}

export function RetroGameScreen({ blinking = true, showSubhead = false }: RetroGameScreenProps) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ backgroundColor: BG }}
    >
      {/* Screen curvature vignette — covers entire viewport */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Green scanlines — covers entire viewport */}
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

      {/* Content — fills viewport */}
      <div
        className="absolute inset-0 z-[5] font-arcade flex flex-col justify-between p-8 sm:p-12 md:p-16"
        style={{ color: PHOSPHOR }}
      >
        {/* Top score bar */}
        <div className="flex justify-between text-[10px] sm:text-xs md:text-sm" style={{ textShadow: GLOW }}>
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

        {/* Center: GAME OVER + hearts + subhead */}
        <div className="text-center flex-1 flex flex-col items-center justify-center gap-6 md:gap-8">
          {/* GAME OVER — blinks in Frame 1, solid in Frame 2 */}
          <motion.div
            className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-[0.3em]"
            style={{ textShadow: GLOW }}
            animate={blinking ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
            transition={
              blinking
                ? { duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95] }
                : { duration: 0.1 }
            }
          >
            GAME OVER
          </motion.div>

          {/* Empty hearts — lives depleted */}
          <div
            className="flex justify-center gap-4 text-lg sm:text-xl md:text-2xl"
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

          {/* Subhead + loading bar — appears in Frame 2, wrapped in h-0 so it doesn't push GAME OVER up */}
          <div className="h-0 overflow-visible">
            {showSubhead && (
              <>
                <motion.p
                  className="mt-6 text-[9px] sm:text-[10px] md:text-xs lg:text-sm max-w-lg mx-auto leading-relaxed tracking-wider text-center"
                  style={{ color: DIM, textShadow: DIM_GLOW }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Sorry. The SaaS-era agency game is out of order. New game loading now.
                </motion.p>

                {/* Loading progress bar — fills over the 6s subhead window */}
                <motion.div
                  className="mt-6 mx-auto max-w-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div
                    className="h-2.5 sm:h-3 rounded-sm overflow-hidden"
                    style={{ border: `2px solid ${DIM}`, boxShadow: DIM_GLOW }}
                  >
                    <motion.div
                      className="h-full rounded-sm"
                      style={{
                        backgroundColor: PHOSPHOR,
                        boxShadow: `0 0 6px ${PHOSPHOR}`,
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5.5, delay: 0.3, ease: 'linear' }}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Bottom: CREDIT */}
        <motion.div
          className="text-center text-[10px] sm:text-xs md:text-sm"
          style={{ color: DIM, textShadow: DIM_GLOW }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.1 }}
        >
          CREDIT  00
        </motion.div>
      </div>
    </div>
  );
}
