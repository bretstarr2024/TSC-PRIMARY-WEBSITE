'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ServiceShapeIcon } from './ServiceShapeIcon';
import type { ServiceCategory } from '@/lib/services-data';

const strategicCapabilities = [
  {
    name: 'Brand & Positioning',
    slug: 'brand-strategy',
    color: '#FF5910',
    shape: 'circle' as const,
    items: ['Market Positioning', 'Messaging Frameworks', 'Brand Architecture', 'Visual Identity & Design Systems', 'Thought Leadership Programs', 'Analyst Relations'],
  },
  {
    name: 'GTM Strategy & Architecture',
    slug: 'gtm-strategy',
    color: '#FFBDAE',
    shape: 'triangle' as const,
    items: ['ICP & Buyer Journey Mapping', 'Competitive Positioning', 'Launch Strategy', 'Sales Enablement', 'Channel Strategy', 'Revenue Architecture'],
  },
  {
    name: 'Demand & Pipeline',
    slug: 'demand-generation',
    color: '#73F5FF',
    shape: 'square' as const,
    items: ['Full-Funnel Demand Gen', 'Account-Based Marketing', 'Marketing Automation & Nurture', 'Lead Scoring & Routing', 'Pipeline Analytics', 'Campaign Operations'],
  },
  {
    name: 'Digital Performance',
    slug: 'digital-performance',
    color: '#E1FF00',
    shape: 'rectangle' as const,
    items: ['Paid Search & Social', 'Programmatic & Retargeting', 'SEO & Technical SEO', 'PR & Analyst Relations', 'Social Media Management', 'Conversion Rate Optimization'],
  },
  {
    name: 'Content & Creative',
    slug: 'content-marketing',
    color: '#ED0AD2',
    shape: 'pentagon' as const,
    items: ['Content Strategy & Production', 'Research & Original Data', 'Campaign Creative & Design', 'Video & Motion', 'Web & Interactive', 'Brand Editorial'],
  },
];

interface ServiceDualUniverseProps {
  aiCategory: ServiceCategory | undefined;
}

export function ServiceDualUniverse({ aiCategory }: ServiceDualUniverseProps) {

  return (
    <section className="relative py-32 md:py-40">
      <div className="section-wide">
        <AnimatedSection className="text-center mb-20">
          <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
            Two Worlds. One Agency.
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.1]">
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
            <h3 className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-3">
              Strategic B2B Marketing
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              Full-service agency.
            </p>
            <p className="leading-relaxed mb-10">
              Everything from brand strategy to demand gen to creative.
              25 years of doing this for B2B tech companies that actually
              want to grow. No fluff. No filler.
            </p>

            <div className="space-y-6">
              {strategicCapabilities.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                >
                  <a href={`#${cat.slug}`} className="flex items-center gap-3 mb-2 group/link">
                    <ServiceShapeIcon shape={cat.shape} color={cat.color} size={24} />
                    <span className="text-white font-medium group-hover/link:underline underline-offset-4 transition-colors" style={{ textDecorationColor: cat.color }}>
                      {cat.name}
                    </span>
                  </a>
                  <p className="text-sm text-greige pl-[36px]">
                    {cat.items.join(' · ')}
                  </p>
                </motion.div>
              ))}
            </div>

          </AnimatedSection>

          {/* AI-Native Side */}
          <AnimatedSection direction="right" className="pl-0 md:pl-16">
            <h3 className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-3">
              AI-Native Solutions
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-white mb-4">
              Not bolt-on AI. Native.
            </p>
            <p className="leading-relaxed mb-10">
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
                    <ServiceShapeIcon shape="hexagon" color="#088BA0" size={18} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-white font-medium text-sm font-mono">
                        {service.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
