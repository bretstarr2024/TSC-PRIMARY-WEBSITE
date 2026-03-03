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
  const showDot = phase === 'crt-shutdown' || phase === 'blackout';

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

      {/* ── Frame 3: CRT shutdown — horizontal line ── */}
      <AnimatePresence>
        {showShutdown && (
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
        )}
      </AnimatePresence>

      {/* ── Center dot — fades in during shutdown, persists through blackout ── */}
      {showDot && (
        <motion.div
          key="crt-dot"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'white',
          }}
          initial={{ opacity: 0, boxShadow: '0 0 0 0 white' }}
          animate={{
            opacity: 1,
            boxShadow: '0 0 15px 5px rgba(255,255,255,0.6)',
          }}
          transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
        />
      )}
    </div>
  );
}
