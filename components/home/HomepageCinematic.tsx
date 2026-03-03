'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { CinematicOverlay, type CinematicPhase } from './CinematicOverlay';
import { IntroSoundEngine } from './IntroSoundEngine';

type Phase = CinematicPhase | 'rebirth' | 'complete';

/**
 * Storyboard:
 * Frame 1 (0–3s):    Full-screen green arcade screen, GAME OVER blinking, music
 * Frame 2 (3–6s):    GAME OVER solid, subhead appears on screen
 * Frame 3 (6–8.5s):  CRT shutdown — screen collapses, line, dot
 * Frame 4 (8.5–9.5s): Blackout
 * Frame 5 (9.5s+):   Rebirth — "See marketing in a whole new light"
 */
const PHASE_TIMINGS: Array<{ phase: Phase; at: number }> = [
  { phase: 'subhead', at: 3000 },
  { phase: 'crt-shutdown', at: 6000 },
  { phase: 'blackout', at: 8500 },
  { phase: 'rebirth', at: 9500 },
  { phase: 'complete', at: 11000 },
];

export function HomepageCinematic() {
  const reducedMotion = useReducedMotion();
  const soundRef = useRef<IntroSoundEngine | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Skip cinematic entirely if reduced motion is preferred
  const shouldSkip = !!reducedMotion;

  const [phase, setPhase] = useState<Phase>(shouldSkip ? 'complete' : 'game-screen');

  // Initialize sound engine AND drive phase transitions (single effect to avoid race condition)
  useEffect(() => {
    const engine = new IntroSoundEngine();
    soundRef.current = engine;

    if (!shouldSkip) {
      // Enable sound, then trigger initial sounds after AudioContext is ready
      engine.enable().then(() => {
        if (engine.enabled) {
          engine.gameOverMelody();
          engine.startCrtHum();
        }
      });

      // Schedule all phase transitions
      PHASE_TIMINGS.forEach(({ phase: nextPhase, at }) => {
        const timer = setTimeout(() => {
          setPhase(nextPhase);

          // Read ref at execution time (not stale closure)
          const sfx = soundRef.current;
          if (sfx && sfx.enabled) {
            switch (nextPhase) {
              case 'subhead':
                sfx.textBlip();
                break;
              case 'crt-shutdown':
                sfx.stopCrtHum();
                sfx.crtPowerDown();
                break;
              case 'rebirth':
                sfx.rebirthWhoosh();
                break;
            }
          }
        }, at);
        timersRef.current.push(timer);
      });
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      soundRef.current?.dispose();
      soundRef.current = null;
    };
  }, [shouldSkip]);

  // Skip handler
  const handleSkip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    soundRef.current?.dispose();
    setPhase('complete');
  }, []);

  const showOverlay = phase !== 'rebirth' && phase !== 'complete';
  const showHero = phase === 'rebirth' || phase === 'complete';

  return (
    <div className="relative">
      {/* Hero section — always mounted, hidden behind overlay during cinematic */}
      <motion.div
        animate={{ opacity: showHero ? 1 : 0 }}
        transition={{ duration: showHero ? 0.5 : 0 }}
        style={{ pointerEvents: showHero ? 'auto' : 'none' }}
      >
        <HeroSection variant="rebirth" />
      </motion.div>

      {/* Cinematic overlay — Frames 1-4 */}
      {showOverlay && (
        <CinematicOverlay phase={phase as CinematicPhase} />
      )}

      {/* Skip button — appears after 1.5s, bottom-right */}
      {showOverlay && (
        <motion.button
          className="fixed bottom-8 right-8 z-[60] font-arcade text-xs text-white/50 hover:text-white/90 transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={handleSkip}
          aria-label="Skip intro"
        >
          SKIP ▶
        </motion.button>
      )}

    </div>
  );
}
