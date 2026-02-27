'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';
import type { ServiceCategory } from '@/lib/services-data';

const offsets = [0, 12, 4, 16, 8, 20, 6, 14];

interface AiCascadeProps {
  aiCategory: ServiceCategory | undefined;
}

export function AiCascade({ aiCategory }: AiCascadeProps) {
  const reducedMotion = useReducedMotion();
  if (!aiCategory) return null;

  return (
    <section className="relative py-32 md:py-40 overflow-hidden" id="ai-marketing">
      {/* Threshold divider */}
      <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
        <motion.div
          className="h-full w-full"
          style={{
            background: 'linear-gradient(90deg, transparent, #088BA0, #73F5FF, #088BA0, transparent)',
            backgroundSize: '200% 100%',
          }}
          animate={reducedMotion ? {} : { backgroundPosition: ['0% 0%', '200% 0%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Cooler background tone */}
      <div className="absolute inset-0 bg-[#0c1118]" />

      <div className="relative z-10">
        {/* Section Header */}
        <AnimatedSection className="section-wide mb-20">
          <p className="text-xs font-semibold text-hurricane-sky uppercase tracking-[0.3em] mb-6">
            AI-Native Services
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1] mb-6">
            <span className="text-hurricane-sky">AI-Native</span>
            <br />
            <span className="text-white">Marketing Solutions</span>
          </h2>
          <p className="text-xl text-shroomy max-w-2xl leading-relaxed">
            Not bolt-on AI. Not AI-curious. This is the intelligence layer beneath
            modern marketing — built by people who ship production systems, not slide decks.
          </p>
        </AnimatedSection>

        {/* Cascade Layout */}
        <div className="section-wide">
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px">
              <motion.div
                className="w-full h-full"
                style={{
                  background:
                    'repeating-linear-gradient(to bottom, #088BA0 0px, #088BA0 4px, transparent 4px, transparent 12px)',
                }}
                initial={{ scaleY: 0, transformOrigin: 'top' }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />
            </div>

            {/* Service Blocks */}
            <div className="space-y-8 md:space-y-6">
              {aiCategory.services.map((service, i) => (
                <AnimatedSection
                  key={service.slug}
                  delay={i * 0.1}
                  direction="up"
                >
                  <div
                    className="md:ml-16"
                    style={{ marginLeft: `${offsets[i] || 0}%` }}
                  >
                    <div className="glass rounded-xl border border-hurricane-sky/20 p-8 max-w-2xl hover:border-hurricane-sky/40 transition-all duration-300 group">
                      {/* Service number */}
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-xs font-mono text-hurricane-sky/50 mt-1">
                          0{i + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-hurricane-sky transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-hurricane-sky font-medium mb-3">
                            {service.tagline}
                          </p>
                          <p className="text-shroomy leading-relaxed mb-5">
                            {service.description}
                          </p>

                          {/* Outcome tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {service.outcomes.slice(0, 3).map((outcome) => (
                              <span
                                key={outcome}
                                className="text-xs px-3 py-1.5 rounded-full border border-hurricane-sky/30 text-shroomy"
                              >
                                {outcome.length > 50 ? outcome.slice(0, 47) + '...' : outcome}
                              </span>
                            ))}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
