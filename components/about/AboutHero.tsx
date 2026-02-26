'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';

export function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <GradientText>About</GradientText>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              A strategic B2B marketing agency founded in 1999, combining 25+ years
              of fundamentals with AI-native capabilities to help over 3,000 technology
              companies grow, differentiate, and win.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
