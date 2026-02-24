'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { GradientText } from '@/components/AnimatedText';
import { OchoTrigger } from '@/components/OchoTrigger';

const HeroParticles = dynamic(
  () => import('./HeroParticles').then((mod) => ({ default: mod.HeroParticles })),
  { ssr: false }
);

const AsteroidsGame = dynamic(
  () => import('./AsteroidsGame').then((mod) => ({ default: mod.AsteroidsGame })),
  { ssr: false }
);

export function HeroSection() {
  const words = ['See', 'marketing', 'in', 'a'];
  const gradientWords = ['whole', 'new', 'light.'];
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <HeroParticles />

      {playing && <AsteroidsGame onClose={() => setPlaying(false)} />}

      <div className="relative z-10 section-wide text-center px-4">
        {/* Ocho easter egg trigger */}
        <OchoTrigger onClick={() => setPlaying(true)} delay={0.2} className="mb-6 mx-auto" />

        {/* Main headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-[0.95]">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.2em] text-white"
              initial={{ opacity: 0, y: 60, rotateX: -40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.5 + i * 0.08,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              {word}
            </motion.span>
          ))}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <GradientText
              from="from-atomic-tangerine"
              via="via-neon-cactus"
              to="to-tidal-wave"
              className="inline"
            >
              {gradientWords.join(' ')}
            </GradientText>
          </motion.span>
        </h1>

        {/* Sub-headline */}
        <motion.p
          className="mt-8 text-lg md:text-xl text-shroomy max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          The B2B marketing agency where fundamentals meet the future.
          We deliver transformational marketing solutions by fusing our award-winning foundational principles with AI expertise.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Link
            href="/book"
            className="inline-flex items-center px-8 py-4 text-base font-medium text-white bg-atomic-tangerine rounded-lg hover:bg-hot-sauce transition-colors hover:no-underline"
          >
            Let&apos;s Talk!
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
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
