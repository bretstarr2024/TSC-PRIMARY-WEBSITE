'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

const fundamentals = [
  { label: 'Brand Strategy', detail: 'Positioning that carves space in crowded markets' },
  { label: 'Messaging Architecture', detail: 'Words that move pipeline, not just heads' },
  { label: 'Go-to-Market Strategy', detail: 'Systems that turn marketing into a growth engine' },
];

const innovation = [
  { label: 'AI Content Engines', detail: 'Human-quality output at non-human scale' },
  { label: 'Answer Engine Optimization', detail: 'Visibility where AI answers live' },
  { label: 'AI Marketing Strategy', detail: 'Pragmatic implementation, not PowerPoint promises' },
];

export function ApproachSection() {
  return (
    <section className="relative py-32 md:py-40">
      <div className="section-wide">
        <AnimatedSection className="text-center mb-20">
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            Our Approach
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1]">
            We offer the best<br />
            <span className="text-atomic-tangerine">of both worlds.</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-px relative">
          {/* Center divider glow */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px">
            <motion.div
              className="w-full h-full bg-gradient-to-b from-transparent via-atomic-tangerine/40 to-transparent"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </div>

          {/* Fundamentals */}
          <AnimatedSection direction="left" className="pr-0 md:pr-12 mb-16 md:mb-0">
            <h3 className="text-xs font-semibold text-tidal-wave uppercase tracking-[0.3em] mb-8">
              Grounded in Fundamentals
            </h3>
            <div className="space-y-8">
              {fundamentals.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="group"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                >
                  <h4 className="text-xl font-semibold text-white mb-1 group-hover:text-tidal-wave transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-shroomy">{item.detail}</p>
                </motion.div>
              ))}
            </div>
            <p className="mt-10 text-sm text-greige italic">
              25+ years. Thousands of B2B tech companies. We even invented a few of these frameworks.
            </p>
          </AnimatedSection>

          {/* Innovation */}
          <AnimatedSection direction="right" className="pl-0 md:pl-12">
            <h3 className="text-xs font-semibold text-neon-cactus uppercase tracking-[0.3em] mb-8">
              Visionary in Innovation
            </h3>
            <div className="space-y-8">
              {innovation.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="group"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                >
                  <h4 className="text-xl font-semibold text-white mb-1 group-hover:text-neon-cactus transition-colors">
                    {item.label}
                  </h4>
                  <p className="text-shroomy">{item.detail}</p>
                </motion.div>
              ))}
            </div>
            <p className="mt-10 text-sm text-greige italic">
              Years of AI implementations, product development, and client transformations. We actually serve innovation — not just list it on the menu.
            </p>
          </AnimatedSection>
        </div>

        {/* Convergence row — both sides meet in execution */}
        <AnimatedSection delay={0.3} className="mt-20 mb-8">
          <div className="glass rounded-2xl p-8 md:p-10 text-center border border-white/5">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-tidal-wave/50" />
              <p className="text-xs font-semibold text-atomic-tangerine uppercase tracking-[0.3em]">
                Where it all converges
              </p>
              <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-neon-cactus/50" />
            </div>
            <p className="text-xl md:text-2xl text-white font-semibold leading-snug max-w-2xl mx-auto">
              Deep expertise and frontier AI — unified into a single execution layer that delivers outcomes, not just outputs.
            </p>
            <p className="mt-4 text-sm text-greige italic max-w-xl mx-auto">
              This website was built from our own GTM Kernel — a live example of not compromising.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4} className="text-center mt-8">
          <p className="text-2xl md:text-3xl font-semibold text-white max-w-2xl mx-auto leading-snug">
            You don&apos;t have to compromise.{' '}
            <span className="text-atomic-tangerine">You get both.</span>
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
