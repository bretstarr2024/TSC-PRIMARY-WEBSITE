'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';

export function IndustriesHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <GradientText>Verticals</GradientText>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              Thousands of B2B technology companies across dozens of verticals.
              If you sell software or services to businesses, we get you.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
