'use client';

import { useRef, useState, useCallback } from 'react';
import { AnimatedSection } from '@/components/AnimatedSection';

const services = [
  {
    category: 'Brand & Positioning',
    items: ['Brand Strategy & Positioning', 'Visual Brand Development', 'Thought Leadership'],
    color: '#FF5910',
    borderColor: 'border-atomic-tangerine/30',
  },
  {
    category: 'GTM Strategy & Architecture',
    items: ['Go-to-Market Strategy'],
    color: '#FFBDAE',
    borderColor: 'border-fing-peachy/30',
  },
  {
    category: 'Demand & Pipeline',
    items: ['Demand Generation', 'Account-Based Marketing', 'Marketing Automation'],
    color: '#73F5FF',
    borderColor: 'border-tidal-wave/30',
  },
  {
    category: 'Digital Performance',
    items: ['Paid Media', 'Earned Media', 'Owned Media'],
    color: '#E1FF00',
    borderColor: 'border-neon-cactus/30',
  },
  {
    category: 'Content & Creative',
    items: ['Content Marketing', 'Creative Services'],
    color: '#ED0AD2',
    borderColor: 'border-sprinkles/30',
  },
  {
    category: 'AI-Native Solutions',
    items: ['AI Marketing Strategy', 'AI GTM Activation', 'AI Content Studio', 'AI Design Studio', 'Answer Engine Optimization', 'Autonomous Outbound AI', 'AI Managed Services'],
    color: '#088BA0',
    borderColor: 'border-hurricane-sky/30',
  },
];

export function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 400;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  }, [checkScroll]);

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0f1015] to-heart-of-darkness" />

      <div className="relative z-10">
        <AnimatedSection className="section-wide mb-16">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
                What We Build
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1]">
                Full-stack marketing<br />
                <span className="text-atomic-tangerine">for full-stack companies.</span>
              </h2>
            </div>

            {/* Arrow controls — desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Scroll left"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-white/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="Scroll right"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Horizontal scroll on desktop */}
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="hidden md:flex gap-6 pl-8 pr-32 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service) => (
              <div
                key={service.category}
                className={`glass flex-shrink-0 w-[380px] p-8 rounded-2xl border ${service.borderColor} hover:border-opacity-60 transition-all duration-300 group`}
              >
                <div
                  className="w-3 h-3 rounded-full mb-6"
                  style={{ backgroundColor: service.color }}
                />
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform">
                  {service.category}
                </h3>
                <ul className="space-y-2">
                  {service.items.map((item) => (
                    <li key={item} className="text-shroomy flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-greige" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Fade edges for scroll hint */}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0f1015] to-transparent pointer-events-none" />
          )}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0f1015] to-transparent pointer-events-none" />
          )}

          {/* Mobile: stacked */}
          <div className="md:hidden section-wide grid gap-4">
            {services.map((service) => (
              <div
                key={service.category}
                className={`glass p-6 rounded-xl border ${service.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: service.color }}
                  />
                  <h3 className="text-lg font-bold text-white">{service.category}</h3>
                </div>
                <p className="text-sm text-shroomy">{service.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
