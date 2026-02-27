'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ArcadeButton } from '@/components/ArcadeButton';

const BreakoutGame = dynamic(
  () => import('./BreakoutGame').then((mod) => ({ default: mod.BreakoutGame })),
  { ssr: false }
);

export function BridgeStatement() {
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {playing && <BreakoutGame onClose={() => setPlaying(false)} />}

      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c1118] via-[#1a0e08] to-heart-of-darkness" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
          animate={reducedMotion ? {} : {
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <AnimatedSection className="relative z-10 text-center section-wide">
        <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1.1]">
          You don&apos;t have to choose.
        </h2>
        <p className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-atomic-tangerine leading-[1.1] mt-2">
          You get both.
        </p>
        {!playing && (
          <ArcadeButton onClick={() => setPlaying(true)} delay={0.5} className="mt-8 mx-auto" />
        )}
      </AnimatedSection>
    </section>
  );
}
