'use client';

import { motion } from 'framer-motion';
import { GradientText } from '@/components/AnimatedText';

export function IndustriesHero() {
  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
      {/* Dual color glows */}
      <motion.div
        className="absolute top-20 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, #ED0AD2 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.14, 0.08],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-10 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, #73F5FF 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="relative z-10 section-wide">
        <motion.p
          className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          B2B Technology Verticals
        </motion.p>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1] mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Your industry.<br />
          <GradientText>Our expertise.</GradientText>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-shroomy max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          We work exclusively with B2B technology companies. If you sell software
          or services to businesses, we probably already understand your market.
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-3 text-sm text-greige"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-2 h-2 rounded-full bg-atomic-tangerine" />
          9 core verticals · 25+ years of B2B tech marketing
        </motion.div>
      </div>
    </section>
  );
}
