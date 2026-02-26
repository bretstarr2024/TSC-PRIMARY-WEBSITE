'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArcadeButton } from '@/components/ArcadeButton';

const HeroParticles = dynamic(
  () => import('./HeroParticles').then((mod) => ({ default: mod.HeroParticles })),
  { ssr: false }
);

const AsteroidsGame = dynamic(
  () => import('./AsteroidsGame').then((mod) => ({ default: mod.AsteroidsGame })),
  { ssr: false }
);

const gradientClasses = 'inline-block bg-gradient-to-r from-atomic-tangerine via-neon-cactus to-tidal-wave bg-clip-text text-transparent bg-[length:200%_auto]';

export function HeroSection() {
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();

  const flickerAnimation = reducedMotion
    ? {}
    : { opacity: [1, 0.92, 1, 1, 0.8, 1] };

  const flickerTransition = {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut' as const,
    times: [0, 0.06, 0.12, 0.72, 0.75, 0.82],
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroParticles />

      {playing && <AsteroidsGame onClose={() => setPlaying(false)} />}

      <div className="relative z-10 section-wide text-center px-4">
        {/* GAME OVER headline */}
        <div
          className="relative"
          style={{ filter: 'drop-shadow(0 0 15px rgba(255,89,16,0.4)) drop-shadow(0 0 40px rgba(255,89,16,0.2))' }}
        >
          <h1
            className="font-arcade leading-none tracking-[0.15em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            style={{ WebkitFontSmoothing: 'none', MozOsxFontSmoothing: 'unset' } as React.CSSProperties}
          >
            {/* GAME */}
            <motion.span
              className="block"
              initial={{ opacity: 0, scale: 1.15, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.6,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              <motion.span
                className={gradientClasses}
                animate={{
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                  ...flickerAnimation,
                }}
                transition={{
                  backgroundPosition: { duration: 5, repeat: Infinity, ease: 'linear' },
                  opacity: { ...flickerTransition, delay: 1.3 },
                }}
              >
                GAME
              </motion.span>
            </motion.span>

            {/* OVER */}
            <motion.span
              className="block mt-2 md:mt-4"
              initial={{ opacity: 0, scale: 1.15, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 1.0,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              <motion.span
                className={gradientClasses}
                animate={{
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                  ...flickerAnimation,
                }}
                transition={{
                  backgroundPosition: { duration: 5, repeat: Infinity, ease: 'linear' },
                  opacity: { ...flickerTransition, delay: 1.3 },
                }}
              >
                OVER
              </motion.span>
            </motion.span>
          </h1>

          {/* CRT scanline overlay */}
          <motion.div
            className="absolute inset-0 crt-scanlines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            aria-hidden="true"
          />
        </div>

        {/* Sub-headline */}
        <motion.p
          className="mt-10 text-base md:text-lg text-shroomy max-w-[600px] mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.8 }}
        >
          The SaaS marketing era is over. AI-native marketing is a whole new game.
          TSC is the B2B agency you can trust to help you{' '}
          <span className="text-white font-semibold">level up</span>.
        </motion.p>
      </div>

      {/* Arcade button — centered between sphere bottom and section bottom */}
      {!playing && (
        <div className="absolute bottom-[20vh] left-1/2 -translate-x-1/2 z-10">
          <ArcadeButton onClick={() => setPlaying(true)} delay={2.8} />
        </div>
      )}

      {/* Bottom fade — dissolves starfield into background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #141213 100%)' }}
      />
    </section>
  );
}
