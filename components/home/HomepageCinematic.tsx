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
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Initialize sound engine
  useEffect(() => {
    soundRef.current = new IntroSoundEngine();
    return () => {
      soundRef.current?.dispose();
      soundRef.current = null;
    };
  }, []);

  // Sound toggle handler
  const handleSoundToggle = useCallback(() => {
    if (!soundRef.current) return;
    const ok = soundRef.current.enable();
    if (ok) {
      setSoundEnabled(true);
      // Start CRT hum immediately
      soundRef.current.startCrtHum();
      // Play game-over melody if still in early phases
      if (phase === 'game-screen' || phase === 'subhead') {
        soundRef.current.gameOverMelody();
      }
    }
  }, [phase]);

  // Drive phase transitions and trigger sounds
  useEffect(() => {
    if (shouldSkip) return;

    const sfx = soundRef.current;

    // Schedule all phase transitions
    PHASE_TIMINGS.forEach(({ phase: nextPhase, at }) => {
      const timer = setTimeout(() => {
        setPhase(nextPhase);

        // Trigger sounds for each phase
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

    // Trigger initial sounds
    if (sfx && sfx.enabled) {
      sfx.gameOverMelody();
      sfx.startCrtHum();
    }

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [shouldSkip]); // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Hero section — becomes visible on rebirth */}
      {showHero && (
        <motion.div
          initial={phase === 'rebirth' ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={phase === 'rebirth' ? { backgroundColor: '#141213' } : undefined}
        >
          <HeroSection variant="rebirth" />
        </motion.div>
      )}

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

      {/* Sound toggle — visible, bottom-center */}
      {showOverlay && !soundEnabled && (
        <motion.button
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] font-arcade text-xs sm:text-sm text-white/70 hover:text-white transition-colors cursor-pointer px-4 py-2 border border-white/20 rounded hover:border-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleSoundToggle}
          aria-label="Enable sound"
        >
          🔈 ENABLE SOUND
        </motion.button>
      )}

      {showOverlay && soundEnabled && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] font-arcade text-xs text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🔊 SOUND ON
        </motion.div>
      )}
    </div>
  );
}
