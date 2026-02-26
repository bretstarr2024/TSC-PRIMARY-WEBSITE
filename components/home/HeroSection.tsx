'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ArcadeButton } from '@/components/ArcadeButton';
import { CoinSlotCTA } from '@/components/CoinSlotCTA';

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
        {/* Arcade easter egg trigger */}
        {!playing && (
          <ArcadeButton onClick={() => setPlaying(true)} delay={0.2} className="mb-10 mx-auto" />
        )}

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
          className="mt-8 text-base md:text-lg text-shroomy max-w-[600px] mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.8 }}
        >
          The SaaS marketing era is over. AI-native marketing is a whole new game.
          TSC is the B2B agency you can trust to help you{' '}
          <span className="text-white font-semibold">level up</span>.
        </motion.p>

        {/* CTA button — CoinSlotCTA (arcade coin slot) */}
        <motion.div
          className="mt-20 flex items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.4 }}
        >
          <CoinSlotCTA href="/book?cta=homepage-hero" ctaId="homepage-hero" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1 }}
      >
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-transparent via-atomic-tangerine to-transparent"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
