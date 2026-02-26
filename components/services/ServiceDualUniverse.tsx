'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import type { ServiceCategory } from '@/lib/services-data';

const strategicCapabilities = [
  {
    name: 'Brand & Positioning',
    color: '#FF5910',
    items: ['Market Positioning', 'Messaging Frameworks', 'Brand Architecture', 'Visual Identity & Design Systems', 'Thought Leadership Programs', 'Analyst Relations'],
  },
  {
    name: 'GTM Strategy & Architecture',
    color: '#FFBDAE',
    items: ['ICP & Buyer Journey Mapping', 'Competitive Positioning', 'Launch Strategy', 'Sales Enablement', 'Channel Strategy', 'Revenue Architecture'],
  },
  {
    name: 'Demand & Pipeline',
    color: '#73F5FF',
    items: ['Full-Funnel Demand Gen', 'Account-Based Marketing', 'Marketing Automation & Nurture', 'Lead Scoring & Routing', 'Pipeline Analytics', 'Campaign Operations'],
  },
  {
    name: 'Digital Performance',
    color: '#E1FF00',
    items: ['Paid Search & Social', 'Programmatic & Retargeting', 'SEO & Technical SEO', 'PR & Analyst Relations', 'Social Media Management', 'Conversion Rate Optimization'],
  },
  {
    name: 'Content & Creative',
    color: '#ED0AD2',
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

            <div className="space-y-6">
              {strategicCapabilities.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-white font-medium">
                      {cat.name}
                    </span>
                  </div>
                  <p className="text-sm text-greige pl-[22px]">
                    {cat.items.join(' · ')}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="mt-8 text-sm text-greige">
              {strategicCapabilities.reduce((acc, cat) => acc + cat.items.length, 0)} capabilities across{' '}
              {strategicCapabilities.length} disciplines
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
