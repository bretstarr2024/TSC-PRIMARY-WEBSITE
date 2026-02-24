'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Industry } from '@/lib/industries-data';

interface IndustryCardProps {
  industry: Industry;
  index: number;
}

export function IndustryCard({ industry, index }: IndustryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      <Link
        href={`/industries/${industry.slug}`}
        className="block glass rounded-xl p-6 md:p-8 border group hover:no-underline transition-all duration-300 h-full"
        style={{ borderColor: `${industry.color}20` }}
      >
        {/* Color dot + stat */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-3 h-3 rounded-full transition-transform group-hover:scale-150 mt-1"
            style={{ backgroundColor: industry.color }}
          />
          <div className="text-right">
            <div
              className="text-lg font-bold"
              style={{ color: industry.color }}
            >
              {industry.stat.value}
            </div>
            <div className="text-[10px] text-greige uppercase tracking-wider">
              {industry.stat.label}
            </div>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform">
          {industry.name}
        </h3>

        {/* Tagline */}
        <p
          className="text-sm font-medium mb-4"
          style={{ color: industry.color }}
        >
          {industry.tagline}
        </p>

        {/* Description preview */}
        <p className="text-sm text-shroomy leading-relaxed line-clamp-3 mb-5">
          {industry.description}
        </p>

        {/* Notable clients (if any) */}
        {industry.notableClients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {industry.notableClients.slice(0, 4).map((client) => (
              <span
                key={client}
                className="text-[10px] text-greige border rounded-full px-2 py-0.5"
                style={{ borderColor: `${industry.color}20` }}
              >
                {client}
              </span>
            ))}
            {industry.notableClients.length > 4 && (
              <span className="text-[10px] text-greige px-1">
                +{industry.notableClients.length - 4}
              </span>
            )}
          </div>
        )}

        {/* CTA hint */}
        <div className="text-xs text-greige group-hover:text-white transition-colors">
          Explore {industry.name} →
        </div>
      </Link>
    </motion.div>
  );
}
