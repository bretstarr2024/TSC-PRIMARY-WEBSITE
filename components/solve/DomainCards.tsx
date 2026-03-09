'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

const domains = [
  {
    name: 'Strategy',
    number: '01',
    color: '#FF5910',
    summary: 'The foundation is missing or broken.',
    description:
      "The strategy layer is where positioning, messaging, ICP, and competitive framing live. When this layer is broken, everything downstream misfires. Campaigns underperform. Content misses. Sales conversations stall.",
  },
  {
    name: 'Demand',
    number: '02',
    color: '#73F5FF',
    summary: "The market isn't responding.",
    description:
      "Demand problems feel like execution problems, but they almost always trace back to a disconnect between what you're saying and what your buyers actually care about. The message isn't landing, or it's landing in the wrong place.",
  },
  {
    name: 'Execution',
    number: '03',
    color: '#E1FF00',
    summary: "The team can't deliver at scale.",
    description:
      "You have the strategy. You have the intent. But the operating model can't deliver. Teams are too small, tools are disconnected, AI investments haven't translated into production systems.",
  },
];

export function DomainCards() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Gradient background shift */}
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0f1015] to-heart-of-darkness" />

      <div className="relative z-10 section-wide">
        <AnimatedSection className="mb-20">
          <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
            The Diagnosis
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1]">
            Three places where<br />
            <span className="text-white font-extrabold">GTM breaks down.</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={0.15}>
          {domains.map((domain) => (
            <StaggerItem key={domain.name}>
              <motion.div
                className="glass rounded-xl p-8 md:p-10 h-full relative overflow-hidden group"
                style={{ borderLeftColor: domain.color, borderLeftWidth: 3 }}
                whileHover={reducedMotion ? {} : { y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Watermark number */}
                <span
                  className="absolute top-4 right-6 text-[80px] md:text-[100px] font-black leading-none select-none pointer-events-none"
                  style={{ color: domain.color, opacity: 0.06 }}
                >
                  {domain.number}
                </span>

                {/* Corner glow on hover */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-500"
                  style={{ background: domain.color }}
                />

                <div className="relative z-10">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: domain.color }}
                  >
                    {domain.number}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-3 mb-2">
                    {domain.name}
                  </h3>
                  <p
                    className="text-lg font-medium mb-4"
                    style={{ color: domain.color }}
                  >
                    {domain.summary}
                  </p>
                  <p className="text-shroomy leading-relaxed">{domain.description}</p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.3} className="mt-20">
          <p className="text-2xl md:text-3xl text-shroomy max-w-3xl leading-snug">
            All three trace back to the same root cause:{' '}
            <span className="text-white font-extrabold">a missing GTM operating system.</span>{' '}
            Not bad people. Not bad tools. A missing system.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
