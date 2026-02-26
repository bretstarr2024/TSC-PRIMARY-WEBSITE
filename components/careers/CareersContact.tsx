'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { ContactForm } from '@/components/contact/ContactForm';

export function CareersContact() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-wide">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left: heading */}
          <div>
            <AnimatedSection>
              <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
                Get in touch
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Interested?{' '}
                <span className="text-tidal-wave">Tell us about yourself.</span>
              </h2>
              <p className="mt-4 text-shroomy text-sm leading-relaxed">
                No resume required. Just tell us who you are, which role caught your eye,
                and what makes you dangerous. A real human reads every one of these.
              </p>
            </AnimatedSection>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-2">
            <AnimatedSection delay={0.1}>
              <div className="glass rounded-xl p-8 max-w-xl">
                <ContactForm source="careers" ctaId="careers-form" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
