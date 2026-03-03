'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RetroGameScreen } from './RetroGameScreen';

export type CinematicPhase =
  | 'gameover-blink'
  | 'subhead'
  | 'crt-shutdown'
  | 'retro-screen'
  | 'unplug'
  | 'blackout';

interface CinematicOverlayProps {
  phase: CinematicPhase;
}

const gradientClasses =
  'inline-block bg-gradient-to-r from-atomic-tangerine via-neon-cactus to-tidal-wave bg-clip-text text-transparent bg-[length:200%_auto]';

export function CinematicOverlay({ phase }: CinematicOverlayProps) {
  const showText = phase === 'gameover-blink' || phase === 'subhead';
  const showShutdown = phase === 'crt-shutdown';
  const showRetro = phase === 'retro-screen';
  const showUnplug = phase === 'unplug';
  const showBlackout = phase === 'blackout';

  return (
    <div className="fixed inset-0 z-50" style={{ backgroundColor: '#0a0a0a' }}>
      {/* ── Phase 1-2: GAME OVER blink + subhead ── */}
      <AnimatePresence>
        {showText && (
          <motion.div
            key="gameover-text"
            className="absolute inset-0 flex items-center justify-center"
            exit={{
              scaleY: 0,
              filter: 'brightness(3)',
            }}
            transition={{
              duration: 0.6,
              ease: [0.7, 0, 1, 1],
            }}
            style={{ transformOrigin: 'center center' }}
          >
            <div className="text-center px-4">
              {/* GAME OVER headline — hard retro blink */}
              <div
                className="relative"
                style={{
                  filter:
                    'drop-shadow(0 0 15px rgba(255,89,16,0.4)) drop-shadow(0 0 40px rgba(255,89,16,0.2))',
                }}
              >
                <h1
                  className="font-arcade leading-none tracking-[0.15em] text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]"
                  style={
                    {
                      WebkitFontSmoothing: 'none',
                      MozOsxFontSmoothing: 'unset',
                    } as React.CSSProperties
                  }
                >
                  {/* GAME */}
                  <motion.span
                    className="block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0, 1, 0, 1, 0, 1] }}
                    transition={{
                      duration: 2.0,
                      times: [0, 0.08, 0.16, 0.3, 0.38, 0.55, 0.63, 0.8],
                      ease: 'linear',
                    }}
                  >
                    <motion.span
                      className={gradientClasses}
                      animate={{
                        backgroundPosition: [
                          '0% center',
                          '100% center',
                          '0% center',
                        ],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      GAME
                    </motion.span>
                  </motion.span>

                  {/* OVER */}
                  <motion.span
                    className="block mt-2 md:mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0, 1, 0, 1, 0, 1] }}
                    transition={{
                      duration: 2.0,
                      delay: 0.15,
                      times: [0, 0.08, 0.16, 0.3, 0.38, 0.55, 0.63, 0.8],
                      ease: 'linear',
                    }}
                  >
                    <motion.span
                      className={gradientClasses}
                      animate={{
                        backgroundPosition: [
                          '0% center',
                          '100% center',
                          '0% center',
                        ],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      OVER
                    </motion.span>
                  </motion.span>
                </h1>

                {/* CRT scanlines — heavier during cinematic */}
                <div
                  className="absolute inset-0 crt-scanlines pointer-events-none"
                  style={{ opacity: 0.12 }}
                  aria-hidden="true"
                />
              </div>

              {/* Sub-headline — Phase 2 */}
              <AnimatePresence>
                {phase === 'subhead' && (
                  <motion.p
                    key="subhead"
                    className="mt-10 text-lg md:text-xl lg:text-2xl text-shroomy max-w-[600px] mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                  >
                    The SaaS marketing era is over. AI-native marketing is a
                    whole new game. TSC is the B2B agency you can trust to help
                    you{' '}
                    <span className="text-white font-semibold">level up</span>.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Phase 3: CRT shutdown — horizontal line + dot ── */}
      <AnimatePresence>
        {showShutdown && (
          <>
            {/* Bright horizontal line */}
            <motion.div
              key="crt-line"
              className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
              style={{
                height: '2px',
                background: 'white',
                transformOrigin: 'center center',
                boxShadow: '0 0 30px 10px rgba(255,255,255,0.8)',
              }}
              initial={{ scaleX: 1, opacity: 1 }}
              animate={{ scaleX: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: [0.7, 0, 1, 1],
              }}
            />

            {/* Center dot */}
            <motion.div
              key="crt-dot"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'white',
              }}
              initial={{
                opacity: 0,
                boxShadow: '0 0 20px 8px white',
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                boxShadow: [
                  '0 0 0 0 white',
                  '0 0 20px 8px white',
                  '0 0 20px 8px white',
                  '0 0 0 0 white',
                ],
              }}
              transition={{
                duration: 1.0,
                delay: 0.3,
                times: [0, 0.15, 0.6, 1],
                ease: 'easeOut',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Phase 4: Retro game screen ── */}
      <AnimatePresence>
        {showRetro && <RetroGameScreen key="retro" />}
      </AnimatePresence>

      {/* ── Phase 5: Unplug — phosphor flash ── */}
      <AnimatePresence>
        {showUnplug && (
          <motion.div
            key="unplug-flash"
            className="absolute inset-0"
            style={{ backgroundColor: 'white' }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
        )}
      </AnimatePresence>

      {/* ── Phase 6: Blackout — pure black, handled by container bg ── */}
      {showBlackout && (
        <div className="absolute inset-0" style={{ backgroundColor: '#000000' }} />
      )}
    </div>
  );
}
