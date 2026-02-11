'use client';

import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';

const archetypes = [
  {
    name: 'The Luddites',
    description: 'Dismiss AI as overhyped. Cling to manual processes while protesting that "humans still matter" — as if anyone argued otherwise.',
    color: 'border-tidal-wave/30',
    glow: 'shadow-tidal-wave/10',
    accent: 'text-tidal-wave',
  },
  {
    name: 'The Tourists',
    description: 'Suddenly claim AI expertise but offer no proof. No clients, no case studies, no depth. Just buzzwords covering their late-to-the-party position.',
    color: 'border-neon-cactus/30',
    glow: 'shadow-neon-cactus/10',
    accent: 'text-neon-cactus',
  },
  {
    name: 'The Zealots',
    description: 'Believe fundamentals no longer matter and only AI can save us. Bulldoze everything worth preserving in a mad dash to automate.',
    color: 'border-sprinkles/30',
    glow: 'shadow-sprinkles/10',
    accent: 'text-sprinkles',
  },
];

export function ProblemSection() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      {/* Subtle gradient shift */}
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#1a1018] to-heart-of-darkness" />

      <div className="relative z-10 section-wide">
        <AnimatedSection className="mb-20">
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            The Problem
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1]">
            Most agencies<br />
            <span className="text-atomic-tangerine">are trapped.</span>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-20" staggerDelay={0.15}>
          {archetypes.map((archetype) => (
            <StaggerItem key={archetype.name}>
              <div className={`glass p-8 rounded-2xl border ${archetype.color} hover:shadow-lg ${archetype.glow} transition-all duration-300 h-full`}>
                <h3 className={`text-2xl font-bold mb-4 ${archetype.accent}`}>
                  {archetype.name}
                </h3>
                <p className="text-shroomy leading-relaxed">
                  {archetype.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection delay={0.3}>
          <p className="text-2xl md:text-3xl text-shroomy max-w-3xl leading-snug">
            All three represent the same risk: partners who{' '}
            <span className="text-white font-semibold">can&apos;t lead transformation</span>.
            They force a false choice — fundamentals or innovation.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
