'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { ConstellationBackground } from '@/components/shared/ConstellationBackground';

export function InsightsHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <ConstellationBackground page="insights" />
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
              Insights
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.1] mb-6">
              Strategic clarity.{' '}
              <span className="text-white font-extrabold">Measurable growth.</span>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              Here&apos;s the thinking behind it.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
