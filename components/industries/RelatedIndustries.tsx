'use client';

import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import type { Industry } from '@/lib/industries-data';

interface RelatedIndustriesProps {
  industries: Industry[];
}

export function RelatedIndustries({ industries }: RelatedIndustriesProps) {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0f1015] to-heart-of-darkness" />

      <div className="relative z-10 section-wide">
        <AnimatedSection className="mb-12">
          <p className="text-[16px] font-bold text-shroomy uppercase tracking-[4px] mb-4">
            Other Verticals
          </p>
          <h2 className="text-3xl md:text-4xl font-normal text-white">
            Related Verticals
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {industries.map((ind) => (
            <StaggerItem key={ind.slug}>
              <Link
                href={`/verticals/${ind.slug}`}
                className="block glass rounded-xl p-6 border group hover:no-underline transition-all duration-300"
                style={{ borderColor: `${ind.color}20` }}
              >
                <div
                  className="w-3 h-3 rounded-full mb-4 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: ind.color }}
                />
                <h3 className="text-xl font-normal text-white mb-2 group-hover:translate-x-1 transition-transform">
                  {ind.name}
                </h3>
                <p className="text-sm mb-3">{ind.tagline}</p>
                <p className="text-xs text-greige">
                  Explore {ind.name} →
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
