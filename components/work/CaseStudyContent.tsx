'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedSection } from '@/components/AnimatedSection';
import type { CaseStudy } from '@/lib/work-data';

interface CaseStudyContentProps {
  study: CaseStudy;
  prev?: CaseStudy;
  next?: CaseStudy;
}

export function CaseStudyContent({ study, prev, next }: CaseStudyContentProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [study.slug]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="section-wide">
          <AnimatedSection>
            <Link
              href="/examples"
              className="inline-flex items-center gap-2 text-sm font-bold text-shroomy hover:text-white transition-colors mb-8"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current" strokeWidth="2">
                <path d="M13 8H3M7 4L3 8l4 4" />
              </svg>
              All Work
            </Link>

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

            <p
              className="text-sm font-bold uppercase tracking-[3px] mb-4"
              style={{ color: study.color }}
            >
              {study.client}
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 max-w-4xl">
              {study.headline}
            </h1>

            <p className="text-xl md:text-2xl text-shroomy leading-relaxed max-w-2xl">
              {study.subheading}
            </p>
          </AnimatedSection>

          {/* Hero image */}
          {study.cardImage && (
            <AnimatedSection delay={0.2}>
              <div className="relative w-full h-48 md:h-64 lg:h-80 mt-12 rounded-2xl overflow-hidden">
                <Image
                  src={study.cardImage}
                  alt={`${study.client} — work`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  priority
                />
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Stats bar */}
      {study.stats && study.stats.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="section-wide">
            <AnimatedSection>
              <div className="flex flex-wrap gap-12 md:gap-20 py-8 border-t border-b border-white/10">
                {study.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-4xl md:text-5xl font-extrabold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-shroomy uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Intro */}
      <section className="pb-16 md:pb-24">
        <div className="section-wide">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-lg md:text-xl text-white leading-relaxed">
                {study.intro}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Main section */}
      <section className="pb-16 md:pb-24">
        <div className="section-wide">
          <AnimatedSection>
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                {study.sectionHeading}
              </h2>
              <p className="text-lg text-shroomy leading-relaxed">
                {study.sectionBody}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Work gallery */}
      {study.images && study.images.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="section-wide">
            <AnimatedSection>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                {study.images.map((src, i) => (
                  <div key={i} className="break-inside-avoid overflow-hidden rounded-xl">
                    <Image
                      src={src}
                      alt={`${study.client} work sample ${i + 1}`}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Outcome section */}
      {study.outcomeHeading && study.outcomeBody && (
        <section className="pb-16 md:pb-24">
          <div className="section-wide">
            <AnimatedSection>
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
                  {study.outcomeHeading}
                </h2>
                <p className="text-lg text-shroomy leading-relaxed">
                  {study.outcomeBody}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Quote */}
      {study.quote && (
        <section className="pb-16 md:pb-24">
          <div className="section-wide">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="relative pl-12 md:pl-16">
                  <span
                    className="text-8xl font-serif leading-none absolute left-0 -top-2"
                    style={{ color: study.color, opacity: 0.5 }}
                  >
                    &ldquo;
                  </span>
                  <blockquote className="text-xl md:text-2xl text-white font-normal leading-snug mb-6">
                    {study.quote.text}
                  </blockquote>
                  <p className="text-sm text-white font-bold">
                    {study.quote.attribution}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Client website */}
      <section className="pb-16 md:pb-24">
        <div className="section-wide">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-sm text-shroomy uppercase tracking-wider mb-2">Client</p>
              <p className="text-white font-bold mb-1">{study.client}</p>
              <a
                href={`https://${study.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-shroomy hover:text-white transition-colors underline"
              >
                {study.website}
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Navigation */}
      <section className="pb-24 md:pb-32">
        <div className="section-wide">
          <div className="flex justify-between items-center border-t border-white/10 pt-8">
            {prev ? (
              <Link
                href={`/examples/${prev.slug}`}
                className="group inline-flex items-center gap-3 text-shroomy hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current" strokeWidth="2">
                  <path d="M13 8H3M7 4L3 8l4 4" />
                </svg>
                <span className="text-sm font-bold">{prev.client}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/examples/${next.slug}`}
                className="group inline-flex items-center gap-3 text-shroomy hover:text-white transition-colors"
              >
                <span className="text-sm font-bold">{next.client}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="stroke-current" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>
    </>
  );
}
