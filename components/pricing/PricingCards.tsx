'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import Link from 'next/link';

export function PricingCards() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6 text-center">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-center max-w-3xl mx-auto mb-6">
            Two ways to{' '}
            <span className="text-atomic-tangerine">work together.</span>
          </h2>
          <p className="text-lg text-shroomy text-center max-w-2xl mx-auto mb-16 leading-relaxed">
            Not hours. Not deliverables. A measurable change in how efficiently
            your business grows.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Subscription */}
          <AnimatedSection delay={0.1}>
            <motion.div
              className="relative glass rounded-2xl p-8 md:p-10 h-full overflow-hidden border border-atomic-tangerine/30"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Subtle corner glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-15"
                style={{ background: '#FF5910' }}
              />

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-atomic-tangerine/15 text-atomic-tangerine rounded-full mb-6">
                  Most Popular
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Subscription</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl md:text-5xl font-black text-white">$15K</span>
                  <span className="text-shroomy text-lg">/month</span>
                </div>
                <p className="text-sm text-greige mb-6">Starting at</p>

                <div className="w-full h-px bg-white/10 mb-6" />

                <ul className="space-y-3 mb-8">
                  {[
                    'Dedicated senior team',
                    'Continuous context accumulation',
                    'Iterative improvement over time',
                    'AI infrastructure + custom builds',
                    'Strategy, execution, and integration',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-shroomy">
                      <span className="text-atomic-tangerine mt-0.5 flex-shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-greige leading-relaxed mb-6">
                  How our deepest client relationships work. The longer we&apos;re together,
                  the more value compounds inside the engagement.
                </p>

                <Link
                  href="/book"
                  className="block text-center px-6 py-3 bg-atomic-tangerine text-white font-medium rounded-lg hover:bg-hot-sauce transition-colors hover:no-underline"
                >
                  Let&apos;s Talk!
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Project */}
          <AnimatedSection delay={0.2}>
            <motion.div
              className="glass rounded-2xl p-8 md:p-10 h-full border border-white/10"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white/5 text-greige rounded-full mb-6">
                  Defined Scope
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Project</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl md:text-5xl font-black text-white">$30K</span>
                  <span className="text-shroomy text-lg">minimum</span>
                </div>
                <p className="text-sm text-greige mb-6">Starting at</p>

                <div className="w-full h-px bg-white/10 mb-6" />

                <ul className="space-y-3 mb-8">
                  {[
                    'Senior-led engagement',
                    'Defined scope and milestones',
                    'AI-powered execution',
                    'Full integration support',
                    'Clear timeline and deliverables',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-shroomy">
                      <span className="text-tidal-wave mt-0.5 flex-shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-greige leading-relaxed mb-6">
                  For specific initiatives with clear objectives &mdash; repositioning,
                  go-to-market launches, technology builds, strategic assessments.
                </p>

                <Link
                  href="/book"
                  className="block text-center px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors hover:no-underline"
                >
                  Let&apos;s Talk!
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
