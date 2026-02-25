'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ArcadeButton } from '@/components/ArcadeButton';

const TronGame = dynamic(
  () => import('./TronGame').then((mod) => ({ default: mod.TronGame })),
  { ssr: false }
);

export function WhyDifferent() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {playing && <TronGame onClose={() => setPlaying(false)} />}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6 text-center">
            Why This Works
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-center max-w-4xl mx-auto mb-16">
            Either one alone{' '}
            <span className="text-greige">isn&apos;t enough.</span>
          </h2>
        </AnimatedSection>

        {/* Top row: two limitation cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <AnimatedSection delay={0.1}>
            <div className="glass rounded-xl p-8 h-full border border-white/5">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-full bg-greige/20 flex items-center justify-center text-greige text-sm font-bold">
                  &#10005;
                </span>
                <p className="text-xs font-bold text-greige uppercase tracking-widest">
                  Senior Talent Alone
                </p>
              </div>
              <p className="text-shroomy leading-relaxed">
                Expensive and capacity-constrained. You get great strategic thinking from
                people who can only do so much in a day. The output ceiling is the number
                of hours in the week &mdash; and it doesn&apos;t scale.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="glass rounded-xl p-8 h-full border border-white/5">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-8 h-8 rounded-full bg-greige/20 flex items-center justify-center text-greige text-sm font-bold">
                  &#10005;
                </span>
                <p className="text-xs font-bold text-greige uppercase tracking-widest">
                  AI Alone
                </p>
              </div>
              <p className="text-shroomy leading-relaxed">
                No judgment. No strategic grounding. Doesn&apos;t understand buying committees,
                long sales cycles, or the difference between a metric that looks good in a
                dashboard and one that actually moves pipeline.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* Bottom: the combination card — full width, glowing */}
        <AnimatedSection delay={0.25}>
          <motion.div
            className="relative glass rounded-xl p-10 md:p-12 overflow-hidden border border-atomic-tangerine/30"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,89,16,0.08) 0%, transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 rounded-full bg-atomic-tangerine/20 flex items-center justify-center text-atomic-tangerine text-lg font-bold">
                  &#10003;
                </span>
                <p className="text-xs font-bold text-atomic-tangerine uppercase tracking-widest">
                  The Combination
                </p>
              </div>
              <p className="text-lg md:text-xl text-white leading-relaxed max-w-3xl mb-4">
                Senior strategists and operators who are also builders &mdash; people who understand
                your ICP, your competitive positioning, and your revenue model, and then build the
                AI systems that execute against it.
              </p>
              <p className="text-sm text-shroomy leading-relaxed max-w-3xl">
                That&apos;s not a common skillset. It&apos;s the result of years of investing in both
                sides simultaneously, when most agencies were still deciding whether AI was a
                threat or an opportunity.
              </p>
            </div>
          </motion.div>
        </AnimatedSection>

        {!playing && (
          <ArcadeButton onClick={() => setPlaying(true)} delay={0.5} className="mt-10 mx-auto" />
        )}
      </div>
    </section>
  );
}
