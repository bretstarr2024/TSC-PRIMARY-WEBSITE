'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { ConstellationBackground } from '@/components/shared/ConstellationBackground';

export function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <ConstellationBackground page="about" />
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
              About
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.1] mb-6">
              Founded in 1999.{' '}
              <span className="text-white font-extrabold">Still ahead of what&apos;s next.</span>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              25+ years of B2B fundamentals combined with AI-native capabilities. Over 3,000 technology companies served.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
