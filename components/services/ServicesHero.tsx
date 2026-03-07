'use client';

import { AnimatedSection } from '@/components/AnimatedSection';

export function ServicesHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="section-wide">
        <AnimatedSection>
          <div className="max-w-4xl">
            <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-6">
              Services
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-[1.1] mb-6">
              Everything your marketing needs.{' '}
              <span className="text-white font-extrabold">Nothing it doesn&apos;t.</span>
            </h1>
            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              Strategic B2B fundamentals and AI-native solutions from a team that refuses to choose between the two.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
