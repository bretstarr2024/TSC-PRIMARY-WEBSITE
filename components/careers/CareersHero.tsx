'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';

export function CareersHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <GradientText>Careers</GradientText>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              We hire people who build things, not people who talk about building things.
              Two roles. No fluff. If you are the right fit, you already know.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
