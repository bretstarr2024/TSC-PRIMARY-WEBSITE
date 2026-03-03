'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { CinematicOverlay, type CinematicPhase } from './CinematicOverlay';
import { IntroSoundEngine } from './IntroSoundEngine';

type Phase = CinematicPhase | 'rebirth' | 'complete';

const SESSION_KEY = 'tsc-intro-seen';

/**
 * Phase timeline (milliseconds from start):
 * 0      → gameover-blink (3s)
 * 3000   → subhead (2.5s)
 * 5500   → crt-shutdown (1.5s)
 * 7000   → retro-screen (3.5s)
 * 10500  → unplug (0.3s)
 * 10800  → blackout (2s)
 * 12800  → rebirth
 * 14000  → complete
 */
const PHASE_TIMINGS: Array<{ phase: Phase; at: number }> = [
  { phase: 'subhead', at: 3000 },
  { phase: 'crt-shutdown', at: 5500 },
  { phase: 'retro-screen', at: 7000 },
  { phase: 'unplug', at: 10500 },
  { phase: 'blackout', at: 10800 },
  { phase: 'rebirth', at: 12800 },
  { phase: 'complete', at: 14000 },
];

export function HomepageCinematic() {
  const reducedMotion = useReducedMotion();
  const soundRef = useRef<IntroSoundEngine | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Check if intro was already seen this session
  const alreadySeen = typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';
  const shouldSkip = reducedMotion || alreadySeen;

  const [phase, setPhase] = useState<Phase>(shouldSkip ? 'complete' : 'gameover-blink');
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
      // Start CRT hum immediately if we're in a phase that has it
      soundRef.current.startCrtHum();
      // Play game-over melody if still in early phases
      if (phase === 'gameover-blink' || phase === 'subhead') {
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
            case 'crt-shutdown':
              sfx.stopCrtHum();
              sfx.crtPowerDown();
              break;
            case 'retro-screen':
              sfx.crtWarmUp();
              sfx.startPhosphorHum();
              sfx.textBlip();
              break;
            case 'unplug':
              sfx.stopPhosphorHum();
              sfx.unplugClick();
              break;
            case 'rebirth':
              sfx.rebirthWhoosh();
              break;
            case 'complete':
              sessionStorage.setItem(SESSION_KEY, '1');
              break;
          }
        } else if (nextPhase === 'complete') {
          sessionStorage.setItem(SESSION_KEY, '1');
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
    sessionStorage.setItem(SESSION_KEY, '1');
  }, []);

  const showOverlay = phase !== 'rebirth' && phase !== 'complete';
  const showHero = phase === 'rebirth' || phase === 'complete';

  // Determine hero variant: if cinematic played (not skipped), show rebirth
  // If skipped (return visit or reduced motion), also show rebirth
  const heroVariant = 'rebirth' as const;

  return (
    <div className="relative">
      {/* Hero section — renders underneath overlay, becomes visible on rebirth */}
      {showHero && (
        <motion.div
          initial={phase === 'rebirth' ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={phase === 'rebirth' ? { backgroundColor: '#141213' } : undefined}
        >
          <HeroSection variant={heroVariant} />
        </motion.div>
      )}

      {/* Cinematic overlay — phases 1-6 */}
      {showOverlay && (
        <CinematicOverlay phase={phase as CinematicPhase} />
      )}

      {/* Skip button — appears after 2s, positioned bottom-right */}
      {showOverlay && (
        <motion.button
          className="fixed bottom-8 right-8 z-[60] font-arcade text-[10px] text-white/40 hover:text-white/80 transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={handleSkip}
          aria-label="Skip intro"
        >
          SKIP ▶
        </motion.button>
      )}

      {/* Sound toggle — appears after 2s, positioned bottom-right above skip */}
      {showOverlay && !soundEnabled && (
        <motion.button
          className="fixed bottom-16 right-8 z-[60] font-arcade text-[10px] text-white/40 hover:text-white/80 transition-colors cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={handleSoundToggle}
          aria-label="Enable sound"
        >
          🔈 SOUND
        </motion.button>
      )}

      {showOverlay && soundEnabled && (
        <motion.div
          className="fixed bottom-16 right-8 z-[60] font-arcade text-[10px] text-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          🔊 ON
        </motion.div>
      )}
    </div>
  );
}
