'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ServiceCategory } from '@/lib/services-data';

interface ServiceSubpageHeroProps {
  category: ServiceCategory;
}

export function ServiceSubpageHero({ category }: ServiceSubpageHeroProps) {
  const universeLabel =
    category.universe === 'ai-native'
      ? 'AI-Native Solutions'
      : 'Strategic B2B Marketing';

  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32">
      {/* Color glow */}
      <motion.div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10"
        style={{
          background: `radial-gradient(circle, ${category.color} 0%, transparent 70%)`,
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
            href="/services"
            className="text-xs font-semibold text-greige uppercase tracking-[0.3em] hover:text-white transition-colors hover:no-underline"
          >
            ← All Services
          </Link>
        </motion.div>

        <motion.p
          className="text-xs font-semibold uppercase tracking-[0.3em] mb-6"
          style={{ color: category.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {universeLabel}
        </motion.p>

        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white leading-[1] mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {category.name}
        </motion.h1>

        <motion.p
          className="text-lg font-medium mb-6"
          style={{ color: category.color }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {category.tagline}
        </motion.p>

        <motion.p
          className="text-xl text-shroomy max-w-3xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {category.description}
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-3 text-sm text-greige"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: category.color }}
          />
          {category.services.length} services in this discipline
        </motion.div>
      </div>
    </section>
  );
}
