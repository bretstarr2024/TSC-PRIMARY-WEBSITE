'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Industry } from '@/lib/industries-data';

interface IndustryHeroProps {
  industry: Industry;
}

export function IndustryHero({ industry }: IndustryHeroProps) {
  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32">
      {/* Color glow */}
      <motion.div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{
          background: `radial-gradient(circle, ${industry.color} 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 section-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/verticals"
            className="text-xs font-semibold text-greige uppercase tracking-[0.3em] hover:text-white transition-colors hover:no-underline"
          >
            ← All Verticals
          </Link>
        </motion.div>

        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
          style={{ color: industry.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          B2B Technology Vertical
        </motion.p>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1] mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {industry.name}
        </motion.h1>

        <motion.p
          className="text-lg font-medium mb-6"
          style={{ color: industry.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {industry.tagline}
        </motion.p>

        <motion.p
          className="text-xl text-shroomy max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {industry.description}
        </motion.p>

        {/* Stat + buyer title */}
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div>
            <div
              className="text-3xl font-bold"
              style={{ color: industry.color }}
            >
              {industry.stat.value}
            </div>
            <div className="text-xs text-greige uppercase tracking-wider mt-1">
              {industry.stat.label}
            </div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <div className="text-sm text-shroomy font-medium">
              Typical buyer
            </div>
            <div className="text-xs text-greige mt-1">
              {industry.buyerTitle}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
