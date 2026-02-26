'use client';

import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { MagneticButton } from '@/components/MagneticButton';
import { getCategoryBySlug } from '@/lib/services-data';
import type { Industry } from '@/lib/industries-data';

interface IndustryContentProps {
  industry: Industry;
}

export function IndustryContent({ industry }: IndustryContentProps) {
  const relevantServices = industry.relevantServiceSlugs
    .map((slug) => getCategoryBySlug(slug))
    .filter(Boolean);

  return (
    <>
      {/* Market Context */}
      <section className="py-16 md:py-24">
        <div className="section-wide">
          <AnimatedSection>
            <div className="glass rounded-2xl p-8 md:p-12 border" style={{ borderColor: `${industry.color}15` }}>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-greige mb-4">
                Market Context
              </p>
              <p className="text-lg md:text-xl text-shroomy leading-relaxed max-w-4xl">
                {industry.marketContext}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pain Points + How We Help — side by side on desktop */}
      <section className="py-16 md:py-24">
        <div className="section-wide">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* Pain Points */}
            <div>
              <AnimatedSection>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
                  style={{ color: industry.color }}
                >
                  The Challenges
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  What makes {industry.name} marketing hard
                </h2>
              </AnimatedSection>

              <StaggerContainer className="space-y-5" staggerDelay={0.08}>
                {industry.painPoints.map((point, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-start gap-4">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold"
                        style={{
                          backgroundColor: `${industry.color}15`,
                          color: industry.color,
                        }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-shroomy leading-relaxed">{point}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* How We Help */}
            <div>
              <AnimatedSection delay={0.2}>
                <p className="text-xs font-semibold text-atomic-tangerine uppercase tracking-[0.3em] mb-4">
                  Our Approach
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  How we move the needle
                </h2>
              </AnimatedSection>

              <StaggerContainer className="space-y-5" staggerDelay={0.08}>
                {industry.howWeHelp.map((point, i) => (
                  <StaggerItem key={i}>
                    <div className="flex items-start gap-4">
                      <svg
                        className="w-5 h-5 flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M6 10l3 3 5-6"
                          stroke={industry.color}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-shroomy leading-relaxed">{point}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Notable Clients */}
      {industry.notableClients.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="section-wide">
            <AnimatedSection>
              <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-4">
                Track Record
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
                {industry.name} clients we&apos;ve worked with
              </h2>
            </AnimatedSection>

            <StaggerContainer className="flex flex-wrap gap-4">
              {industry.notableClients.map((client) => (
                <StaggerItem key={client}>
                  <div
                    className="glass rounded-lg px-6 py-4 border text-white font-semibold"
                    style={{ borderColor: `${industry.color}25` }}
                  >
                    {client}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Relevant Services */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0f1015] to-heart-of-darkness" />

        <div className="relative z-10 section-wide">
          <AnimatedSection>
            <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-4">
              Services for {industry.name}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
              How we work with {industry.name} companies
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {relevantServices.map((cat) => (
              cat && (
                <StaggerItem key={cat.slug}>
                  <Link
                    href={`/services/${cat.slug}`}
                    className="block glass rounded-xl p-6 border group hover:no-underline transition-all duration-300"
                    style={{ borderColor: `${cat.color}20` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                        style={{ backgroundColor: cat.color }}
                      />
                      <h3 className="text-lg font-bold text-white group-hover:translate-x-1 transition-transform">
                        {cat.name}
                      </h3>
                    </div>
                    <p className="text-sm text-shroomy mb-3">{cat.tagline}</p>
                    <p className="text-xs text-greige">
                      {cat.services.length} services →
                    </p>
                  </Link>
                </StaggerItem>
              )
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#1a0e08] to-heart-of-darkness" />
          <AnimatedSection direction="none">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-15"
              style={{ background: `radial-gradient(circle, ${industry.color} 0%, transparent 70%)` }}
            />
          </AnimatedSection>
        </div>

        <div className="relative z-10 section-wide text-center">
          <AnimatedSection>
            <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-white leading-[1] mb-8">
              Ready to own<br />
              <span style={{ color: industry.color }}>{industry.name}?</span>
            </h2>
            <p className="text-xl text-shroomy max-w-xl mx-auto mb-12 leading-relaxed">
              We already know the buyers, the competitors, and the category dynamics.
              Let&apos;s talk about what moves your pipeline.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton href="/contact?cta=vertical-bottom" variant="primary" ctaId="vertical-bottom">
              New Game
            </MagneticButton>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
