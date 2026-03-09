'use client';

import { AnimatedSection } from '@/components/AnimatedSection';

export function WorkHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
              Examples
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.1] mb-6">
              The work that built{' '}
              <span className="text-white font-extrabold">our reputation.</span>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              Long before AI, we delivered brands, campaigns, and strategies that moved markets.
              These are the fundamentals we still stand on, now amplified by everything we&apos;ve built since.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
