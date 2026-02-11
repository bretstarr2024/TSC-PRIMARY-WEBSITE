'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedSection } from '@/components/AnimatedSection';

const services = [
  {
    category: 'Strategic & Foundational',
    items: ['Brand Strategy & Positioning', 'Go-to-Market Strategy', 'Thought Leadership'],
    color: '#FF5910',
    borderColor: 'border-atomic-tangerine/30',
  },
  {
    category: 'Demand & Pipeline',
    items: ['Demand Generation', 'Account-Based Marketing', 'Marketing Automation'],
    color: '#73F5FF',
    borderColor: 'border-tidal-wave/30',
  },
  {
    category: 'Digital Performance',
    items: ['Paid Media', 'SEO', 'Social Media'],
    color: '#E1FF00',
    borderColor: 'border-neon-cactus/30',
  },
  {
    category: 'Content & Creative',
    items: ['Content Marketing', 'Creative Services', 'Research Reports'],
    color: '#ED0AD2',
    borderColor: 'border-sprinkles/30',
  },
  {
    category: 'Advisory & Transformation',
    items: ['Fractional CMO', 'Marketing Transformation', 'Team Building'],
    color: '#FFBDAE',
    borderColor: 'border-fing-peachy/30',
  },
  {
    category: 'AI Services',
    items: ['AI Marketing Strategy', 'AI Content Engines', 'Answer Engine Optimization'],
    color: '#088BA0',
    borderColor: 'border-hurricane-sky/30',
  },
];

export function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-40%']);

  return (
    <section className="relative py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-heart-of-darkness via-[#0f1015] to-heart-of-darkness" />

      <div className="relative z-10">
        <AnimatedSection className="section-wide mb-16">
          <p className="text-xs font-semibold text-greige uppercase tracking-[0.3em] mb-6">
            What We Build
          </p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1]">
            Full-stack marketing<br />
            <span className="text-atomic-tangerine">for full-stack companies.</span>
          </h2>
        </AnimatedSection>

        {/* Horizontal scroll on desktop */}
        <div ref={containerRef} className="relative">
          <motion.div
            className="hidden md:flex gap-6 pl-8 pr-32"
            style={{ x }}
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
          </motion.div>

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
