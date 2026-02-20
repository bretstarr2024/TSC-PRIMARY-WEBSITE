'use client';

import { AnimatedSection } from '@/components/AnimatedSection';

export function WhoWeAreSection() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="section-wide">
        <AnimatedSection>
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            Who We Are
          </p>
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
              A full-stack B2B tech marketing agency with 25 years of category-defining work —{' '}
              <span className="text-atomic-tangerine">rebuilt from the ground up as AI-native.</span>
            </h2>
            <p className="text-xl text-shroomy leading-relaxed">
              We don&apos;t bolt AI onto old playbooks. We built new ones. Brand strategy, demand generation,
              content, digital performance, and go-to-market architecture — all powered by proprietary AI
              systems we developed and use every day.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
