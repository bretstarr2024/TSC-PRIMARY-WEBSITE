'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';

const HeroParticles = dynamic(
  () => import('@/components/home/HeroParticles').then((mod) => ({ default: mod.HeroParticles })),
  { ssr: false }
);

export function SolveHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Three.js star particles — no wireframe sphere */}
      <HeroParticles starsOnly />

      {/* Large nebula glow — top center, tidal/blue-dominant clinical blend */}
      <motion.div
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(115,245,255,0.25) 0%, rgba(8,139,160,0.1) 50%, transparent 70%)' }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Tidal accent — right side */}
      <motion.div
        className="absolute top-1/2 right-[5%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(115,245,255,0.18) 0%, transparent 70%)' }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.12, 1],
          opacity: [0.3, 0.55, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Sprinkles accent — bottom left */}
      <motion.div
        className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(100,120,200,0.12) 0%, transparent 70%)' }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.15, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      <div className="relative z-10 section-wide py-32 md:py-40">
        <AnimatedSection journey>
          <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
            The Diagnostic
          </p>
        </AnimatedSection>

        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-normal text-white leading-[1] tracking-tight mb-8">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            >
              What&apos;s the problem
            </motion.span>
            <motion.span
              className="block mt-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <GradientText className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold">
                you&apos;re facing?
              </GradientText>
            </motion.span>
          </h1>

          <motion.p
            className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            B2B go-to-market systems fail in three places.{' '}
            <span className="text-white font-extrabold">Strategy. Demand. Execution.</span>{' '}
            Most companies treat the symptoms. We fix the system.
          </motion.p>
        </div>
      </div>

      {/* Bottom fade — seamless into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #0c1118 100%)' }}
      />
    </section>
  );
}
