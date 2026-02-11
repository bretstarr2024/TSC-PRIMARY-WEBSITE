'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export type InsightType =
  | 'blog'
  | 'faq'
  | 'glossary'
  | 'comparison'
  | 'expert-qa'
  | 'news'
  | 'case-study'
  | 'industry-brief'
  | 'video'
  | 'tool';

const TYPE_LABELS: Record<InsightType, string> = {
  blog: 'Blog',
  faq: 'FAQ',
  glossary: 'Glossary',
  comparison: 'Comparison',
  'expert-qa': 'Expert Q&A',
  news: 'News',
  'case-study': 'Case Study',
  'industry-brief': 'Industry Brief',
  video: 'Video',
  tool: 'Tool',
};

const TYPE_COLORS: Record<InsightType, string> = {
  blog: '#FF5910',
  faq: '#E1FF00',
  glossary: '#73F5FF',
  comparison: '#ED0AD2',
  'expert-qa': '#FFBDAE',
  news: '#088BA0',
  'case-study': '#7C3AED',
  'industry-brief': '#D97706',
  video: '#10B981',
  tool: '#F472B6',
};

interface InsightCardProps {
  type: InsightType;
  title: string;
  description: string;
  href: string;
  date?: string;
  author?: string;
  tags?: string[];
}

export function InsightCard({ type, title, description, href, date, author, tags }: InsightCardProps) {
  const color = TYPE_COLORS[type];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link href={href} className="block glass rounded-xl p-6 h-full hover:no-underline transition-all duration-300 hover:border-white/10" style={{ borderLeftColor: color, borderLeftWidth: 3 }}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {TYPE_LABELS[type]}
          </span>
          {date && (
            <span className="text-xs text-greige">{date}</span>
          )}
        </div>

        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-atomic-tangerine transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-shroomy text-sm leading-relaxed line-clamp-3 mb-3">
          {description}
        </p>

        {(author || (tags && tags.length > 0)) && (
          <div className="flex items-center gap-3 mt-auto">
            {author && (
              <span className="text-xs text-greige">{author}</span>
            )}
            {tags && tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-greige bg-white/5 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
