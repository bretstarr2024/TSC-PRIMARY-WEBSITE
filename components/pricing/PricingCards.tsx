'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import Link from 'next/link';

export function PricingCards() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6 text-center">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white leading-tight text-center max-w-3xl mx-auto mb-6">
            Two ways to{' '}
            <span className="text-white font-extrabold">work together.</span>
          </h2>
          <p className="text-lg text-center max-w-2xl mx-auto mb-16 leading-relaxed">
            Not hours. Not deliverables. A measurable change in how efficiently
            your business grows.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Subscription */}
          <AnimatedSection delay={0.1}>
            <motion.div
              className="relative glass rounded-2xl p-8 md:p-10 h-full flex flex-col overflow-hidden border border-atomic-tangerine/30"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Subtle corner glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-15"
                style={{ background: '#FF5910' }}
              />

              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-normal text-white mb-6">Subscription</h3>

                <div className="w-full h-px bg-white/10 mb-6" />

                <ul className="space-y-3 mb-8">
                  {[
                    'Dedicated senior team',
                    'Strategic planning',
                    'Opportunity prioritization',
                    'Traditional agency services',
                    'AI workflows and custom builds',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
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
                  href="/book?service=Subscription&cta=pricing-subscription"
                  className="mt-auto block text-center px-6 py-3 bg-heart-of-darkness text-white border-2 border-white font-medium rounded-lg hover:bg-white hover:text-heart-of-darkness transition-colors hover:no-underline"
                  data-track-cta="pricing-subscription"
                  data-track-component="PricingCards"
                  data-track-label="Let's talk about a subscription"
                  data-track-destination="/book?service=Subscription"
                >
                  Let&apos;s talk about a subscription
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Project */}
          <AnimatedSection delay={0.2}>
            <motion.div
              className="glass rounded-2xl p-8 md:p-10 h-full flex flex-col border border-white/10"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-normal text-white mb-6">Project</h3>

                <div className="w-full h-px bg-white/10 mb-6" />

                <ul className="space-y-3 mb-8">
                  {[
                    'Senior-led engagement',
                    'Defined scope and milestones',
                    'AI-powered execution',
                    'Full integration support',
                    'Clear timeline and deliverables',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
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
                  href="/book?service=Project&cta=pricing-project"
                  className="mt-auto block text-center px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors hover:no-underline"
                  data-track-cta="pricing-project"
                  data-track-component="PricingCards"
                  data-track-label="Let's talk about a project"
                  data-track-destination="/book?service=Project"
                >
                  Let&apos;s talk about a project
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
