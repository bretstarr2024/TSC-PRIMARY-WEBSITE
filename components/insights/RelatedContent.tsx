/**
 * Cross-type related content component.
 * Server component — fetches related content at render time.
 */

import Link from 'next/link';
import { getRelatedContent, type RelatedItemType } from '@/lib/related-content';

const TYPE_COLORS: Record<RelatedItemType, string> = {
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
  infographic: '#818CF8',
};

const TYPE_LABELS: Record<RelatedItemType, string> = {
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
  infographic: 'Infographic',
};

interface RelatedContentProps {
  currentType: RelatedItemType;
  currentId: string;
  tags: string[];
  clusterName?: string;
  limit?: number;
}

export async function RelatedContent({
  currentType,
  currentId,
  tags,
  clusterName,
  limit = 6,
}: RelatedContentProps) {
  let items;
  try {
    items = await getRelatedContent(tags, currentType, currentId, limit, clusterName);
  } catch {
    return null;
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="my-12">
      <h3 className="text-lg font-semibold text-white mb-6">Related Grist</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => {
          const color = TYPE_COLORS[item.type];
          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.href}
              className="glass rounded-lg p-4 hover:no-underline group transition-all duration-200 hover:border-white/10"
              style={{ borderLeftColor: color, borderLeftWidth: 3 }}
            >
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color }}
              >
                {TYPE_LABELS[item.type]}
              </span>
              <h4 className="text-white font-medium mt-1 group-hover:text-atomic-tangerine transition-colors line-clamp-2">
                {item.title}
              </h4>
              <p className="text-greige text-sm mt-1 line-clamp-2">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
