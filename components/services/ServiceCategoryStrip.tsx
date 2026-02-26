'use client';

import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import { MagneticButton } from '@/components/MagneticButton';
import { ServiceCard } from './ServiceCard';
import type { ServiceCategory } from '@/lib/services-data';

interface ServiceCategoryStripProps {
  category: ServiceCategory;
  index: number;
}

export function ServiceCategoryStrip({ category, index }: ServiceCategoryStripProps) {
  const isReversed = index % 2 !== 0;
  const hasGradientBg = index % 2 === 0;

  return (
    <section className="relative py-24 md:py-32" id={category.slug}>
      {hasGradientBg && (
        <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0f1015] to-heart-of-darkness" />
      )}

      <div className="relative z-10 section-wide">
        <div className={`grid md:grid-cols-2 gap-12 md:gap-16 ${isReversed ? 'md:direction-rtl' : ''}`}>
          {/* Category Info */}
          <AnimatedSection
            direction={isReversed ? 'right' : 'left'}
            className={`${isReversed ? 'md:order-2' : 'md:order-1'}`}
          >
            <div
              className="w-3 h-3 rounded-full mb-6"
              style={{ backgroundColor: category.color }}
            />
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-4">
              {category.name}
            </h2>
            <p
              className="text-lg font-medium mb-4"
              style={{ color: category.color }}
            >
              {category.tagline}
            </p>
            <p className="text-shroomy leading-relaxed mb-8 max-w-lg">
              {category.description}
            </p>
            <MagneticButton href={`/book?service=${encodeURIComponent(category.name)}&cta=services-${category.slug}`} variant="primary" ctaId={`services-${category.slug}`}>
              New Game
            </MagneticButton>
          </AnimatedSection>

          {/* Service Cards */}
          <StaggerContainer
            className={`space-y-4 ${isReversed ? 'md:order-1' : 'md:order-2'}`}
          >
            {category.services.map((service) => (
              <StaggerItem key={service.slug}>
                <ServiceCard
                  service={service}
                  accentColor={category.color}
                  borderClass={category.borderClass}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
