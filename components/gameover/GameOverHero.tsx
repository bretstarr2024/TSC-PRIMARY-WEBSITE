'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { GalagaBackground } from './GalagaBackground';
import type { GalagaBackgroundHandle } from './GalagaBackground';

const StarField = dynamic(
  () => import('./StarField').then((m) => ({ default: m.StarField })),
  { ssr: false }
);

type Side = 'over' | 'new';

const SEQUENCE: { side: Side; hold: number }[] = [
  { side: 'over', hold: 4000 },
  { side: 'new', hold: 3000 },
  { side: 'over', hold: 2500 },
  { side: 'new', hold: Infinity },
];

// Pixel wipe grid
const COLS = 28;
const ROWS = 16;
const WIPE_DURATION = 2000;
const COL_STAGGER = WIPE_DURATION / COLS;

export function GameOverHero() {
  const [step, setStep] = useState(0);
  const [activeSide, setActiveSide] = useState<Side>('over');
  const [wipeProgress, setWipeProgress] = useState(-1);
  const galagaRef = useRef<GalagaBackgroundHandle>(null);

  const targetSide = SEQUENCE[step].side;

  const cellJitter = useMemo(() => {
    const jitters: number[] = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      jitters.push(Math.random() * 0.4);
    }
    return jitters;
  }, []);

  const startWipe = useCallback(() => {
    setWipeProgress(0);
    const start = performance.now();
    const totalDuration = WIPE_DURATION + 600;

    function tick() {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / totalDuration, 1);
      setWipeProgress(p);

      if (p >= 0.45) {
        setActiveSide(SEQUENCE[Math.min(step + 1, SEQUENCE.length - 1)].side);
      }

      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setWipeProgress(-1);
        const nextStep = Math.min(step + 1, SEQUENCE.length - 1);
        setStep(nextStep);
        // If this is the final step (landing on NEW GAME? permanently), trigger explosion
        if (nextStep === SEQUENCE.length - 1) {
          setTimeout(() => {
            galagaRef.current?.explode();
          }, 400);
        }
      }
    }
    requestAnimationFrame(tick);
  }, [step]);

  useEffect(() => {
    const hold = SEQUENCE[step].hold;
    if (hold === Infinity) return;
    const timer = setTimeout(startWipe, hold);
    return () => clearTimeout(timer);
  }, [step, startWipe, targetSide, activeSide, wipeProgress]);

  const isNew = activeSide === 'new';

  function getCellOpacity(col: number, cellIndex: number): number {
    if (wipeProgress < 0) return 0;
    const colProgress = col / COLS;
    const jitter = cellJitter[cellIndex] * (COL_STAGGER / WIPE_DURATION);
    const cellCenter = colProgress + jitter;
    const halfWidth = 0.12;
    const dist = Math.abs(wipeProgress - cellCenter);
    if (dist > halfWidth) return 0;
    return 1 - (dist / halfWidth) * (dist / halfWidth);
  }

  // Shared text classes for both sides — same size, stacked layout
  const headlineClass = 'font-arcade text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white tracking-wider leading-[1.15]';

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ═══ Galaga — persistent across both faces ═══ */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <GalagaBackground ref={galagaRef} />
      </div>

      {/* ═══ GAME OVER FACE ═══ */}
      <div
        className="absolute inset-0 min-h-screen flex items-center justify-center"
        style={{
          zIndex: isNew ? 1 : 2,
          opacity: isNew ? 0 : 1,
          transition: wipeProgress >= 0 ? 'none' : 'opacity 0.1s',
        }}
      >
        <div className="absolute inset-0 bg-heart-of-darkness">
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full blur-[160px]"
            style={{ background: 'radial-gradient(circle, #FF3333 0%, #FF5910 30%, transparent 70%)' }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.26, 0.18] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, #7C3AED 0%, transparent 70%)' }}
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          />
        </div>

        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 3px)',
          }}
        />
        {/* CRT vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)' }}
        />

        <div className="relative z-20 section-wide text-center px-4">
          <h1
            className={headlineClass}
            style={{
              textShadow:
                '0 0 80px rgba(255, 51, 51, 0.7), 0 0 160px rgba(255, 89, 16, 0.4), 0 0 240px rgba(255, 51, 51, 0.15)',
            }}
          >
            <span className="block">GAME</span>
            <span className="block">OVER<motion.span
              className="text-atomic-tangerine"
              animate={{ opacity: [1, 1, 0, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.4, 0.45, 0.9, 0.95] }}
            >.</motion.span></span>
          </h1>

          <p className="mt-10 text-lg md:text-xl text-shroomy max-w-2xl mx-auto leading-relaxed">
            The B2B marketing game you&apos;ve been playing was built for an era that doesn&apos;t exist anymore.
            The rules changed. The board changed. The players changed. Most companies are still smashing buttons
            wondering why the score stopped going up.
          </p>

          <div className="mt-10">
            <a
              href="#enter-form"
              className="inline-block px-8 py-4 bg-atomic-tangerine text-white font-bold text-sm sm:text-base rounded-lg hover:bg-hot-sauce transition-all duration-300"
              style={{ boxShadow: '0 0 40px rgba(255, 89, 16, 0.35), 0 0 80px rgba(255, 89, 16, 0.15)' }}
              data-track-cta="gameover-hero"
              data-track-component="GameOverHero"
              data-track-label="See Where You Stand"
            >
              See Where You Stand
            </a>
          </div>
        </div>
      </div>

      {/* ═══ NEW GAME FACE ═══ */}
      <div
        className="absolute inset-0 min-h-screen flex items-center justify-center"
        style={{
          zIndex: isNew ? 2 : 1,
          opacity: isNew ? 1 : 0,
          transition: wipeProgress >= 0 ? 'none' : 'opacity 0.1s',
        }}
      >
        <div className="absolute inset-0 bg-heart-of-darkness">
          <motion.div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full blur-[160px]"
            style={{ background: 'radial-gradient(circle, #E1FF00 0%, #73F5FF 40%, transparent 70%)' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px]"
            style={{ background: 'radial-gradient(circle, #73F5FF 0%, transparent 70%)' }}
            animate={{ opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        <StarField />

        <div className="relative z-20 section-wide text-center px-4 pointer-events-none">
          <h1
            className={headlineClass}
            style={{
              textShadow:
                '0 0 80px rgba(225, 255, 0, 0.6), 0 0 160px rgba(115, 245, 255, 0.35), 0 0 240px rgba(225, 255, 0, 0.12)',
            }}
          >
            <span className="block">NEW</span>
            <span className="block">GAME<motion.span
              style={{ color: '#E1FF00' }}
              animate={{ opacity: [1, 1, 0, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.4, 0.45, 0.9, 0.95] }}
            >?</motion.span></span>
          </h1>

          <p className="mt-10 text-lg md:text-xl text-shroomy max-w-2xl mx-auto leading-relaxed">
            The B2B marketing game you&apos;ve been playing was built for an era that doesn&apos;t exist anymore.
            The rules changed. The board changed. The players changed. Most companies are still smashing buttons
            wondering why the score stopped going up.
          </p>

          <div className="mt-10">
            <a
              href="#enter-form"
              className="inline-block px-8 py-4 bg-atomic-tangerine text-white font-bold text-sm sm:text-base rounded-lg hover:bg-hot-sauce transition-all duration-300 pointer-events-auto"
              style={{ boxShadow: '0 0 40px rgba(255, 89, 16, 0.35), 0 0 80px rgba(255, 89, 16, 0.15)' }}
              data-track-cta="gameover-hero-new"
              data-track-component="GameOverHero"
              data-track-label="See Where You Stand"
            >
              See Where You Stand
            </a>
          </div>
        </div>
      </div>

      {/* ═══ PIXEL WIPE OVERLAY ═══ */}
      {wipeProgress >= 0 && (
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: COLS * ROWS }).map((_, i) => {
            const col = i % COLS;
            const opacity = getCellOpacity(col, i);
            if (opacity < 0.01) return <div key={i} />;
            // Atomic tangerine shades blend
            const j = cellJitter[i];
            const shade = j > 0.25 ? '255, 89, 16' : j > 0.12 ? '255, 51, 51' : '189, 58, 0';
            return (
              <div
                key={i}
                style={{
                  backgroundColor: `rgba(${shade}, ${opacity})`,
                }}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
