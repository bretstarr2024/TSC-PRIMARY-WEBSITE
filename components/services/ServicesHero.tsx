'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import { GradientText } from '@/components/AnimatedText';

export function ServicesHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <GradientText>Services</GradientText>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              Everything your marketing needs. Nothing it doesn&apos;t. Strategic B2B
              fundamentals and AI-native solutions from a team that refuses to choose.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
