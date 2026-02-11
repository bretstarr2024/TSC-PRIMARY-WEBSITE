'use client';

import Link from 'next/link';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import type { ServiceCategory } from '@/lib/services-data';

interface RelatedServicesProps {
  categories: ServiceCategory[];
  currentSlug: string;
}

export function RelatedServices({ categories }: RelatedServicesProps) {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0f1015] to-heart-of-darkness" />

      <div className="relative z-10 section-wide">
        <AnimatedSection className="mb-12">
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-4">
            You Might Also Need
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Related Services
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <StaggerItem key={cat.slug}>
              <Link
                href={`/services/${cat.slug}`}
                className="block glass rounded-xl p-6 border group hover:no-underline transition-all duration-300"
                style={{ borderColor: `${cat.color}20` }}
              >
                <div
                  className="w-3 h-3 rounded-full mb-4 transition-transform group-hover:scale-125"
                  style={{ backgroundColor: cat.color }}
                />
                <h3 className="text-xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
                  {cat.name}
                </h3>
                <p className="text-sm text-shroomy mb-3">{cat.tagline}</p>
                <p className="text-xs text-greige">
                  {cat.services.length} services →
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
