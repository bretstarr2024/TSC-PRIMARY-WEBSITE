'use client';

import { motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';

const HeroParticles = dynamic(
  () => import('@/components/home/HeroParticles').then((mod) => ({ default: mod.HeroParticles })),
  { ssr: false }
);

const gradientClasses = 'inline-block bg-gradient-to-r from-atomic-tangerine via-neon-cactus to-tidal-wave bg-clip-text text-transparent bg-[length:200%_auto]';

export function ContactHero() {
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
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <HeroParticles />

      {/* Background glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FF5910 0%, transparent 60%)',
        }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.08, 1],
          opacity: [0.1, 0.18, 0.1],
        }}
        transition={reducedMotion ? {} : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 section-wide text-center px-4">
        {/* CONTINUE? headline */}
        <div
          className="relative"
          style={{ filter: 'drop-shadow(0 0 15px rgba(255,89,16,0.4)) drop-shadow(0 0 40px rgba(255,89,16,0.2))' }}
        >
          <h1
            className="font-arcade leading-none tracking-[0.15em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            style={{ WebkitFontSmoothing: 'none', MozOsxFontSmoothing: 'unset' } as React.CSSProperties}
          >
            {/* CONTINUE */}
            <motion.span
              className="block"
              initial={{ opacity: 0, scale: 1.15, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4,
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
                  opacity: { ...flickerTransition, delay: 1.0 },
                }}
              >
                CONTINUE
              </motion.span>
            </motion.span>

            {/* ? */}
            <motion.span
              className="block mt-2 md:mt-4"
              initial={{ opacity: 0, scale: 1.15, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.8,
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
                  opacity: { ...flickerTransition, delay: 1.0 },
                }}
              >
                ?
              </motion.span>
            </motion.span>
          </h1>

          {/* CRT scanline overlay */}
          <motion.div
            className="absolute inset-0 crt-scanlines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            aria-hidden="true"
          />
        </div>

        {/* Sub-headline */}
        <motion.p
          className="mt-8 text-base md:text-lg text-shroomy max-w-[600px] mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.4 }}
        >
          You&apos;ve seen what we do. Now let&apos;s talk about what you need.
        </motion.p>
      </div>
      {/* Bottom fade — dissolves starfield into background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-[5]"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #141213 100%)' }}
      />
    </section>
  );
}
