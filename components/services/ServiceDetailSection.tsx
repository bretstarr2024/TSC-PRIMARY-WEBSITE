'use client';

import { AnimatedSection } from '@/components/AnimatedSection';
import type { Service } from '@/lib/services-data';

interface ServiceDetailSectionProps {
  service: Service;
  accentColor: string;
  index: number;
}

export function ServiceDetailSection({ service, accentColor, index }: ServiceDetailSectionProps) {
  const isReversed = index % 2 !== 0;

  return (
    <AnimatedSection
      direction={isReversed ? 'right' : 'left'}
      className="py-16 md:py-20"
    >
      <div className={`grid md:grid-cols-5 gap-12 ${isReversed ? '' : ''}`}>
        {/* Info side — 3 cols */}
        <div className={`md:col-span-3 ${isReversed ? 'md:order-2' : 'md:order-1'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {service.name}
          </h2>
          <p className="text-lg font-medium mb-6" style={{ color: accentColor }}>
            {service.tagline}
          </p>
          <p className="text-shroomy leading-relaxed mb-8 text-lg">
            {service.description}
          </p>
          <p className="text-sm text-shroomy/80 italic">
            {service.whoItsFor}
          </p>
        </div>

        {/* Outcomes side — 2 cols */}
        <div className={`md:col-span-2 ${isReversed ? 'md:order-1' : 'md:order-2'}`}>
          <div className="glass rounded-xl p-6 border border-white/5">
            <p className="text-xs font-semibold text-greige uppercase tracking-wider mb-4">
              What You Get
            </p>
            <ul className="space-y-3">
              {service.outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3 text-sm text-shroomy">
                  <svg
                    className="mt-0.5 w-4 h-4 flex-shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3 8.5L6.5 12L13 4"
                      stroke={accentColor}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {outcome}
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
