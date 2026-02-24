'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

const pillars = [
  {
    number: '01',
    title: 'Senior Talent Only',
    hook: 'No juniors. No account coordinators. No learning curves.',
    description:
      "Every engagement is led and executed by practitioners with decades of B2B experience \u2014 demand generation, pipeline strategy, positioning, category creation \u2014 who've spent years becoming fluent in AI-native tools and methods. The fundamentals give us judgment. The AI gives us leverage.",
    color: '#FF5910',
  },
  {
    number: '02',
    title: 'Proprietary AI Infrastructure',
    hook: 'Faster and better. Not just cheaper.',
    description:
      "Custom-built AI agents, automated workflows, and a proprietary tech stack purpose-built for B2B marketing. We deploy systems that encode institutional knowledge, best practices, and client context into every output \u2014 at a velocity traditional models can't match.",
    color: '#E1FF00',
  },
  {
    number: '03',
    title: 'AI Solutions Built Into Your World',
    hook: "We don\u2019t hand you a prototype and leave.",
    description:
      "We design and implement AI-native solutions inside your organization. Commercial tools, custom workflows, proprietary technology \u2014 and the last-mile integration into your CRM, MAP, and data infrastructure that makes it all actually work. We make it run in your world.",
    color: '#73F5FF',
  },
  {
    number: '04',
    title: 'Continuity Compounds Results',
    hook: 'Context accumulates. Output accelerates.',
    description:
      "Our subscription model creates the continuity that one-off projects can\u2019t. As our systems improve and our understanding of your business deepens, you get more output, faster, inside the same commercial structure. The longer we work together, the better it gets.",
    color: '#ED0AD2',
  },
];

export function FourPillars() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="relative z-10 section-wide">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            Four Pillars
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-4xl mb-16">
            The operating model behind{' '}
            <span className="text-atomic-tangerine">the results.</span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => (
            <AnimatedSection key={pillar.number} delay={i * 0.1}>
              <motion.div
                className="glass rounded-xl p-8 md:p-10 h-full relative overflow-hidden"
                style={{ borderLeftColor: pillar.color, borderLeftWidth: 3 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                {/* Watermark number */}
                <span
                  className="absolute top-4 right-6 text-[80px] md:text-[100px] font-black leading-none select-none pointer-events-none"
                  style={{ color: pillar.color, opacity: 0.06 }}
                >
                  {pillar.number}
                </span>

                <div className="relative z-10">
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: pillar.color }}
                  >
                    {pillar.number}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white mt-3 mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-base font-medium text-white/80 mb-4">
                    {pillar.hook}
                  </p>
                  <p className="text-sm text-shroomy leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
