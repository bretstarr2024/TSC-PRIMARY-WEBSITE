'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

const values = [
  {
    title: 'Truth over comfort',
    description:
      'We tell clients what they need to hear, not what they want to hear. Direct feedback, honest assessments, no BS. If your strategy is broken, we\'ll say so — and then we\'ll fix it.',
    number: '01',
    color: '#FF5910',
  },
  {
    title: 'Fundamentals + Innovation',
    description:
      'AI enhances but doesn\'t replace marketing fundamentals. Every AI solution we build is grounded in proven strategy. The companies that win aren\'t the ones chasing tools — they\'re the ones who know what works and then amplify it.',
    number: '02',
    color: '#E1FF00',
  },
  {
    title: 'Results over activity',
    description:
      'We measure by outcomes, not effort or deliverables. Pipeline generated. Revenue influenced. Market position shifted. If it doesn\'t move the business, we don\'t do it.',
    number: '03',
    color: '#73F5FF',
  },
];

export function ApproachSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      </div>

      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            How we work
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-3xl mb-6">
            Strategy and execution. Fundamentals and AI.{' '}
            <span className="text-atomic-tangerine">No false choices.</span>
          </h2>
          <p className="text-lg text-shroomy leading-relaxed max-w-2xl mb-16">
            Most agencies make you choose: strategic thinking or hands-on execution.
            Legacy expertise or AI capability. We built TSC so you never have to pick.
            The same senior team that develops your strategy is the one that executes it.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <AnimatedSection key={value.title} delay={i * 0.1}>
              <motion.div
                className="glass rounded-xl p-8 h-full"
                style={{ borderLeftColor: value.color, borderLeftWidth: 3 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: value.color }}
                >
                  {value.number}
                </span>
                <h3 className="text-xl font-bold text-white mt-4 mb-3">
                  {value.title}
                </h3>
                <p className="text-shroomy text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
