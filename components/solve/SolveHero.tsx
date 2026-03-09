'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';

export function SolveHero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Ambient radial glow */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary glow */}
      <motion.div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-5"
        style={{ background: 'radial-gradient(circle, #73F5FF 0%, transparent 70%)' }}
        animate={reducedMotion ? {} : {
          scale: [1, 1.15, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="relative z-10 section-wide py-32 md:py-40">
        <AnimatedSection>
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

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, #141213 100%)' }}
      />
    </section>
  );
}
