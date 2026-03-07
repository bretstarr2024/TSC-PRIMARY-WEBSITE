'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { CinematicOverlay, type CinematicPhase } from './CinematicOverlay';
import { IntroSoundEngine } from './IntroSoundEngine';

type Phase = CinematicPhase | 'rebirth' | 'complete';

/**
 * Storyboard:
 * Frame 0 (indefinite): Start screen — "The Starr Conspiracy", 1_player button, awaits click
 * Frame 1 (0–3s):       Full-screen green arcade screen, GAME OVER blinking, music
 * Frame 2 (3–9s):       GAME OVER solid, subhead appears on screen (6s reading time)
 * Frame 3 (9–11.5s):    CRT shutdown — screen collapses, line, dot
 * Frame 4 (11.5–12.5s): Blackout
 * Frame 5 (12.5s+):     Rebirth — "See marketing in a whole new light"
 */
const PHASE_TIMINGS: Array<{ phase: Phase; at: number }> = [
  { phase: 'subhead', at: 3000 },
  { phase: 'crt-shutdown', at: 9000 },
  { phase: 'blackout', at: 11500 },
  { phase: 'rebirth', at: 12500 },
  { phase: 'complete', at: 14000 },
];

export function HomepageCinematic() {
  const reducedMotion = useReducedMotion();
  const soundRef = useRef<IntroSoundEngine | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Skip cinematic entirely if reduced motion is preferred
  const shouldSkip = !!reducedMotion;

  const [phase, setPhase] = useState<Phase>(shouldSkip ? 'complete' : 'start-screen');

  // Create sound engine on mount (no AudioContext yet — just an object)
  useEffect(() => {
    if (!shouldSkip) {
      soundRef.current = new IntroSoundEngine();
    }
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      soundRef.current?.dispose();
      soundRef.current = null;
    };
  }, [shouldSkip]);

  // Called when user clicks 1_player button on start screen
  const handleStart = useCallback(() => {
    const engine = soundRef.current;
    if (!engine) return;

    // Transition to game-screen immediately
    setPhase('game-screen');

    // Enable audio (guaranteed to work — user just clicked)
    engine.enable().then(() => {
      if (engine.enabled) {
        engine.coinInsert();
        // Small delay so coin-insert chime finishes before GAME OVER melody
        const melodyTimer = setTimeout(() => {
          if (soundRef.current?.enabled) {
            soundRef.current.gameOverMelody();
            soundRef.current.startCrtHum();
          }
        }, 300);
        timersRef.current.push(melodyTimer);
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
  }, []);

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

      {/* Cinematic overlay — Frames 0-4 */}
      {showOverlay && (
        <CinematicOverlay phase={phase as CinematicPhase} onStart={handleStart} />
      )}

      {/* Skip button — 3s delay on start screen, 1.5s during cinematic */}
      {showOverlay && (
        <motion.button
          key={phase === 'start-screen' ? 'skip-start' : 'skip-cinematic'}
          className="fixed bottom-8 right-8 z-[60] font-arcade text-xs text-greige hover:text-white transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: phase === 'start-screen' ? 3 : 1.5 }}
          onClick={handleSkip}
          aria-label="Skip intro"
        >
          SKIP ▶
        </motion.button>
      )}

    </div>
  );
}
