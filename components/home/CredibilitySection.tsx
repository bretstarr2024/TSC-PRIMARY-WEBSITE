'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { AnimatedSection } from '@/components/AnimatedSection';

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));

      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

const stats = [
  { value: 25, suffix: '+', label: 'Years of B2B expertise' },
  { value: 150, suffix: 'M+', label: 'In client revenue generated' },
  { value: 1000, suffix: '+', label: 'B2B tech companies served' },
];

export function CredibilitySection() {
  return (
    <section className="relative py-32 md:py-40">
      <div className="section-wide">
        <div className="grid md:grid-cols-3 gap-12 mb-24">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.15} className="text-center">
              <p className="text-6xl md:text-7xl font-bold text-atomic-tangerine mb-3">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-shroomy text-sm uppercase tracking-wider">{stat.label}</p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <span className="absolute -top-8 -left-4 text-8xl text-atomic-tangerine/10 font-serif">&ldquo;</span>
            <blockquote className="text-2xl md:text-3xl text-white font-semibold leading-snug">
              Marketing transformation doesn&apos;t mean choosing between fundamentals and innovation.
              It means mastering both.
            </blockquote>
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="w-10 h-px bg-atomic-tangerine" />
              <p className="text-sm text-shroomy">
                <span className="text-white font-medium">Bret Starr</span>
                <span className="text-greige"> · Founder, The Starr Conspiracy</span>
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
