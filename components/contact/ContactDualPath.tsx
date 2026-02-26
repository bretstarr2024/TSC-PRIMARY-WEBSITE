'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';
import { ContactForm } from './ContactForm';
import { ContactCalendar } from './ContactCalendar';

export function ContactDualPath() {
  const searchParams = useSearchParams();
  const service = searchParams.get('service');
  const ctaSource = searchParams.get('cta');

  return (
    <section className="relative py-16 md:py-24">
      <div className="section-wide">
        {/* Section label */}
        <AnimatedSection>
          <p className="font-arcade text-xs text-greige uppercase tracking-[0.3em] text-center mb-12">
            Select Your Path
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left card: Drop a line */}
          <AnimatedSection delay={0.1}>
            <motion.div
              className="relative glass rounded-2xl p-8 md:p-10 h-full flex flex-col overflow-hidden border border-atomic-tangerine/30"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Corner glow */}
              <div
                className="absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-15"
                style={{ background: '#FF5910' }}
              />

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-1">Drop a line</h2>
                <p className="text-sm text-greige mb-8">
                  We&apos;ll get back to you within one business day.
                </p>
                <ContactForm source="/contact" ctaId={ctaSource || 'contact-form'} />
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Right card: Book a call */}
          <AnimatedSection delay={0.2}>
            <motion.div
              className="relative glass rounded-2xl p-6 md:p-8 h-full flex flex-col border border-white/10"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-1">Book a call</h2>
                <p className="text-sm text-greige mb-6">
                  25 minutes with a senior strategist.
                </p>
                <ContactCalendar service={service} ctaSource={ctaSource} />
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
