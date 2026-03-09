'use client';

import { AnimatedSection } from '@/components/AnimatedSection';

export function PricingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
              Working Together
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.1] mb-6">
              We don&apos;t sell hours.{' '}
              <span className="text-white font-extrabold">We sell growth.</span>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              Instead of billing for time, we give you ongoing access to senior talent, AI workflows, proprietary agents, and institutional knowledge, all bundled into a single recurring engagement built for this era.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
