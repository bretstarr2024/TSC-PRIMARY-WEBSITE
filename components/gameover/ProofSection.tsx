'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { TrophyIcon, CrownIcon } from './PixelArtIcons';

export function ProofSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Dramatic warm glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#1a0e08] to-heart-of-darkness" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[200px]"
        style={{ background: 'radial-gradient(circle, #FF5910 0%, transparent 70%)' }}
        animate={{ opacity: [0.06, 0.12, 0.06], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <div className="flex items-center gap-5 mb-6">
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px]">
              LEVEL 4
            </p>
            <div className="flex gap-3" style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))' }}>
              <TrophyIcon size={7} />
              <CrownIcon size={7} />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1] mb-6 max-w-4xl">
            We built this website{' '}
            <span className="font-extrabold">in one day.</span>
          </h2>
        </AnimatedSection>

        <div className="space-y-10 max-w-3xl mt-16">
          <AnimatedSection delay={0.15}>
            <p className="text-lg md:text-xl text-shroomy leading-relaxed">
              Go ahead. Don&apos;t believe us. Look around. Click things. Read the copy. Check the design.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <p className="text-lg md:text-xl text-shroomy leading-relaxed">
              Is it perfect? No. And if you&apos;re looking for unachievable perfection, you&apos;re missing the point. Your buyers aren&apos;t looking for perfect. They&apos;re looking for authentic. For real. For right now. The brands that win in this era ship with conviction, not committees.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <p className="text-lg md:text-xl text-shroomy leading-relaxed">
              Now ask yourself: how long did your last website take? Six months? A year of revision cycles and stakeholder alignment?
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.45}>
            <p className="text-lg md:text-xl text-white leading-relaxed">
              This is <span className="font-extrabold">25 years of B2B marketing fundamentals</span> paired with <span className="font-extrabold">four years of AI-native transformation</span>. Not experiments. Not pilots. Four years of rebuilding our systems and infrastructure from the ground up. The strategy is the same strategy we&apos;ve always been known for. Brand, messaging, positioning, GTM architecture. We didn&apos;t throw any of it away. We made it radically faster.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.55}>
            <div className="p-8 md:p-10 rounded-2xl glass border border-atomic-tangerine/15 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-64 h-64 rounded-full blur-[80px] opacity-[0.06] pointer-events-none"
                style={{ background: '#FF5910' }}
              />
              <p className="relative text-xl md:text-2xl text-white leading-relaxed font-normal tracking-tight">
                <span className="font-extrabold">Strategy without speed is a deck that collects dust. Speed without strategy is noise at scale.</span>{' '}
                We do both. Together. That&apos;s the game now.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
