'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { getStrategicCategories, getAiCategory } from '@/lib/services-data';

export function ServiceDualUniverse() {
  const strategic = getStrategicCategories();
  const aiCategory = getAiCategory();

  return (
    <section className="relative py-32 md:py-40">
      <div className="section-wide">
        <AnimatedSection className="text-center mb-20">
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            Two Worlds. One Agency.
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            The strategic depth you need.<br />
            <span className="text-hurricane-sky">The AI edge you want.</span>
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-px relative">
          {/* Center divider */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px">
            <motion.div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(to bottom, transparent, #FF5910, #088BA0, transparent)',
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
          </div>

          {/* Strategic Side */}
          <AnimatedSection direction="left" className="pr-0 md:pr-16 mb-16 md:mb-0">
            <h3 className="text-xs font-semibold text-atomic-tangerine uppercase tracking-[0.3em] mb-3">
              Strategic B2B Marketing
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              Full-service agency.
            </p>
            <p className="text-shroomy leading-relaxed mb-10">
              Everything from brand strategy to demand gen to creative.
              25 years of doing this for B2B tech companies that actually
              want to grow. No fluff. No filler.
            </p>

            <div className="space-y-4">
              {strategic.map((cat, i) => (
                <motion.a
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="flex items-center gap-3 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform group-hover:scale-125"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-white font-medium group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </span>
                  <span className="text-greige text-sm hidden sm:inline">
                    — {cat.services.length} services
                  </span>
                </motion.a>
              ))}
            </div>

            <p className="mt-8 text-sm text-greige">
              {strategic.reduce((acc, cat) => acc + cat.services.length, 0)} services across{' '}
              {strategic.length} disciplines
            </p>
          </AnimatedSection>

          {/* AI-Native Side */}
          <AnimatedSection direction="right" className="pl-0 md:pl-16">
            <h3 className="text-xs font-semibold text-hurricane-sky uppercase tracking-[0.3em] mb-3">
              AI-Native Solutions
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              Not bolt-on AI. Native.
            </p>
            <p className="text-shroomy leading-relaxed mb-10">
              The intelligence layer beneath modern marketing. Built by people
              who ship AI systems in production — not consultants who read
              about it in Harvard Business Review.
            </p>

            {aiCategory && (
              <div className="space-y-3">
                {aiCategory.services.map((service, i) => (
                  <motion.div
                    key={service.slug}
                    className="flex items-start gap-3 group"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                  >
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-hurricane-sky flex-shrink-0" />
                    <div>
                      <span className="text-white font-medium text-sm font-mono">
                        {service.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <p className="mt-8 text-sm text-greige">
              {aiCategory?.services.length} AI-native services — from strategy to production systems
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
