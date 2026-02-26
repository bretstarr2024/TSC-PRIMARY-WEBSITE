/**
 * Cross-type related content engine.
 * Finds related resources across all content types using tag overlap + JTBD cluster boost.
 * Multi-tenant: all queries scoped by clientId.
 * Adapted from AEO donor codebase (lib/related-content.ts).
 */

import { getDatabase } from './mongodb';
import { getClientId } from './kernel/client';

export type RelatedItemType =
  | 'blog'
  | 'faq'
  | 'glossary'
  | 'comparison'
  | 'expert-qa'
  | 'news'
  | 'case-study'
  | 'industry-brief'
  | 'video'
  | 'tool'
  | 'infographic';

export interface RelatedItem {
  type: RelatedItemType;
  id: string;
  title: string;
  description: string;
  href: string;
  matchCount: number;
}

const TYPE_CONFIG: Record<
  RelatedItemType,
  { collection: string; idField: string; titleField: string; descField: string; pathPrefix: string }
> = {
  blog: { collection: 'blog_posts', idField: 'slug', titleField: 'title', descField: 'description', pathPrefix: '/insights/blog/' },
  faq: { collection: 'faq_items', idField: 'faqId', titleField: 'question', descField: 'answer', pathPrefix: '/insights/faq/' },
  glossary: { collection: 'glossary_terms', idField: 'termId', titleField: 'term', descField: 'shortDefinition', pathPrefix: '/insights/glossary/' },
  comparison: { collection: 'comparisons', idField: 'comparisonId', titleField: 'title', descField: 'introduction', pathPrefix: '/insights/comparisons/' },
  'expert-qa': { collection: 'expert_qa', idField: 'qaId', titleField: 'question', descField: 'answer', pathPrefix: '/insights/expert-qa/' },
  news: { collection: 'news_items', idField: 'newsId', titleField: 'headline', descField: 'summary', pathPrefix: '/insights/news/' },
  'case-study': { collection: 'case_studies', idField: 'caseStudyId', titleField: 'title', descField: 'challenge', pathPrefix: '/insights/case-studies/' },
  'industry-brief': { collection: 'industry_briefs', idField: 'briefId', titleField: 'title', descField: 'summary', pathPrefix: '/insights/industry-briefs/' },
  video: { collection: 'videos', idField: 'videoId', titleField: 'title', descField: 'description', pathPrefix: '/insights/videos/' },
  tool: { collection: 'tools', idField: 'toolId', titleField: 'title', descField: 'description', pathPrefix: '/insights/tools/' },
  infographic: { collection: 'infographics', idField: 'infographicId', titleField: 'title', descField: 'description', pathPrefix: '/insights/infographics/' },
};

/**
 * Find related content across all types.
 * Uses tag overlap for relevance, with optional JTBD cluster boost.
 */
export async function getRelatedContent(
  tags: string[],
  excludeType: RelatedItemType,
  excludeId: string,
  limit: number = 6,
  clusterName?: string
): Promise<RelatedItem[]> {
  if (tags.length === 0) return [];

  const db = await getDatabase();
  const clientId = getClientId();
  const results: RelatedItem[] = [];

  // Query each type in parallel
  const queries = Object.entries(TYPE_CONFIG).map(async ([type, config]) => {
    try {
      const collection = db.collection(config.collection);
      const items = await collection
        .find({
          clientId,
          status: 'published',
          tags: { $in: tags },
        })
        .project({
          [config.idField]: 1,
          [config.titleField]: 1,
          [config.descField]: 1,
          tags: 1,
          clusterName: 1,
        })
        .limit(limit)
        .toArray();

      for (const item of items) {
        const id = item[config.idField] as string;
        if (type === excludeType && id === excludeId) continue;

        // Calculate tag overlap
        const itemTags = (item.tags || []) as string[];
        let matchCount = tags.filter((t) => itemTags.includes(t)).length;

        // JTBD cluster boost
        if (clusterName && item.clusterName === clusterName) {
          matchCount += 2;
        }

        const title = item[config.titleField] as string;
        const desc = item[config.descField] as string;

        results.push({
          type: type as RelatedItemType,
          id,
          title,
          description: desc?.substring(0, 160) || '',
          href: `${config.pathPrefix}${id}`,
          matchCount,
        });
      }
    } catch {
      // Silently skip types that fail (collection may not exist yet)
    }
  });

  await Promise.all(queries);

  // Sort by match count descending, take top N
  return results.sort((a, b) => b.matchCount - a.matchCount).slice(0, limit);
}
