'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RetroGameScreen } from './RetroGameScreen';

export type CinematicPhase =
  | 'game-screen'
  | 'subhead'
  | 'crt-shutdown'
  | 'blackout';

interface CinematicOverlayProps {
  phase: CinematicPhase;
}

export function CinematicOverlay({ phase }: CinematicOverlayProps) {
  const showScreen = phase === 'game-screen' || phase === 'subhead';
  const showShutdown = phase === 'crt-shutdown';
  const showBlackout = phase === 'blackout';

  return (
    <div className="fixed inset-0 z-50" style={{ backgroundColor: '#0a0a0a' }}>
      {/* ── Frames 1-2: Full-screen retro arcade screen ── */}
      <AnimatePresence>
        {showScreen && (
          <motion.div
            key="retro-screen"
            className="absolute inset-0"
            exit={{
              scaleY: 0,
              filter: 'brightness(3)',
            }}
            transition={{
              duration: 0.8,
              ease: [0.7, 0, 1, 1],
            }}
            style={{ transformOrigin: 'center center' }}
          >
            <RetroGameScreen
              blinking={phase === 'game-screen'}
              showSubhead={phase === 'subhead'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Frame 3: CRT shutdown — horizontal line + center dot ── */}
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
                duration: 1.0,
                delay: 0.2,
                ease: [0.7, 0, 1, 1],
              }}
            />

            {/* Center dot — lingers after line shrinks */}
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
                boxShadow: '0 0 0 0 white',
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
                duration: 1.8,
                delay: 0.5,
                times: [0, 0.1, 0.6, 1],
                ease: 'easeOut',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Blackout — pure black before rebirth ── */}
      {showBlackout && (
        <div className="absolute inset-0" style={{ backgroundColor: '#000000' }} />
      )}
    </div>
  );
}
