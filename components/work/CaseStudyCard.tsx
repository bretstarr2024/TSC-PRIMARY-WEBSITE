'use client';

import Link from 'next/link';
import { AnimatedSection } from '@/components/AnimatedSection';
import type { CaseStudy } from '@/lib/work-data';

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
}

export function CaseStudyCard({ study, index }: CaseStudyCardProps) {
  return (
    <AnimatedSection delay={index * 0.1}>
      <Link
        href={`/work/${study.slug}`}
        scroll={true}
        className="group block relative overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300"
      >
        {/* Colored accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
          style={{ backgroundColor: study.color }}
        />

        <div className="p-8 md:p-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 text-shroomy"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Client name */}
          <p
            className="text-sm font-bold uppercase tracking-[3px] mb-4"
            style={{ color: study.color }}
          >
            {study.client}
          </p>

          {/* Headline */}
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-4 group-hover:translate-x-1 transition-transform duration-300">
            {study.headline}
          </h2>

          {/* Subheading */}
          <p className="text-shroomy leading-relaxed mb-6">
            {study.subheading}
          </p>

          {/* Stats preview */}
          {study.stats && study.stats.length > 0 && (
            <div className="flex gap-8 mb-6">
              {study.stats.slice(0, 2).map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-xs text-shroomy uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Read more */}
          <span className="inline-flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all duration-300">
            Read case study
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current" strokeWidth="2">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </div>
      </Link>
    </AnimatedSection>
  );
}
