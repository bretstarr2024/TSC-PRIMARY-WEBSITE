'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

const outcomes = [
  { metric: 'Pipeline', description: 'More qualified opportunities, faster', color: '#FF5910' },
  { metric: 'CAC', description: 'Lower customer acquisition cost', color: '#E1FF00' },
  { metric: 'Time-to-Revenue', description: 'Faster path from spend to return', color: '#73F5FF' },
  { metric: 'Efficiency', description: 'More output per marketing dollar', color: '#ED0AD2' },
];

export function ModelOverview() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />

      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            The Model
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl mb-16">
            We change the unit economics of your business.{' '}
            <span className="text-greige">Everything else is in service of that.</span>
          </h2>
        </AnimatedSection>

        {/* Contrast panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <AnimatedSection delay={0.1}>
            <div className="glass rounded-xl p-8 h-full border-l-2 border-greige/30">
              <p className="text-xs font-bold text-greige uppercase tracking-widest mb-5">
                The Conventional Agency
              </p>
              <div className="space-y-4 text-greige">
                <p className="flex items-start gap-3">
                  <span className="text-greige/40 mt-0.5 flex-shrink-0">&#8594;</span>
                  <span>Start with legacy playbooks and processes</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-greige/40 mt-0.5 flex-shrink-0">&#8594;</span>
                  <span>Bolt AI on as an add-on feature</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-greige/40 mt-0.5 flex-shrink-0">&#8594;</span>
                  <span>Produce the same work, marginally faster</span>
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <motion.div
              className="glass rounded-xl p-8 h-full border-l-2 border-atomic-tangerine"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-xs font-bold text-atomic-tangerine uppercase tracking-widest mb-5">
                The Starr Conspiracy
              </p>
              <div className="space-y-4 text-shroomy">
                <p className="flex items-start gap-3">
                  <span className="text-atomic-tangerine mt-0.5 flex-shrink-0">&#8594;</span>
                  <span>Design every workflow for the AI era from day one</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-atomic-tangerine mt-0.5 flex-shrink-0">&#8594;</span>
                  <span>Direct it with 25 years of senior B2B expertise</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-atomic-tangerine mt-0.5 flex-shrink-0">&#8594;</span>
                  <span>Deliver fundamentally different results at new velocity</span>
                </p>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Outcome Metrics */}
        <AnimatedSection delay={0.15}>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-8">
            What We Optimize For
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {outcomes.map((outcome, i) => (
            <AnimatedSection key={outcome.metric} delay={0.2 + i * 0.08}>
              <motion.div
                className="glass rounded-xl p-6 text-center"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3 }}
              >
                <p
                  className="text-lg md:text-xl font-bold mb-2"
                  style={{ color: outcome.color }}
                >
                  {outcome.metric}
                </p>
                <p className="text-sm text-greige leading-snug">
                  {outcome.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
