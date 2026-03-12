/**
 * Internal metrics from TSC MongoDB.
 * Queries: leads, content collections, content_queue pipeline stats.
 */

import type { InternalMetrics, TimePeriod } from '../types';
import { getCached, setCache, cacheKey } from '../cache';
import { getDatabase } from '@/lib/mongodb';

function periodStart(period: TimePeriod): Date {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

const CONTENT_TYPES = [
  { type: 'blog_post',      label: 'Blog Posts',       collection: 'blog_posts' },
  { type: 'faq_item',       label: 'FAQs',             collection: 'faq_items' },
  { type: 'glossary_term',  label: 'Glossary',         collection: 'glossary_terms' },
  { type: 'tool',           label: 'Tools',            collection: 'tools' },
  { type: 'expert_qa',      label: 'Expert Q&A',       collection: 'expert_qa' },
  { type: 'news_item',      label: 'News',             collection: 'news_items' },
  { type: 'comparison',     label: 'Comparisons',      collection: 'comparisons' },
  { type: 'industry_brief', label: 'Industry Briefs',  collection: 'industry_briefs' },
  { type: 'case_study',     label: 'Case Studies',     collection: 'case_studies' },
] as const;

export async function getInternalMetrics(period: TimePeriod): Promise<InternalMetrics> {
  const key = cacheKey('internal', period);
  const cached = getCached<InternalMetrics>(key);
  if (cached) return cached;

  try {
    const db = await getDatabase();
    const since = periodStart(period);

    // Leads
    const leadsCol = db.collection('leads');
    const [totalLeads, periodLeads, leadsBySource] = await Promise.all([
      leadsCol.countDocuments(),
      leadsCol.countDocuments({ timestamp: { $gte: since } }),
      leadsCol.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
    ]);

    // Content counts per type
    const contentStats = await Promise.all(
      CONTENT_TYPES.map(async ({ type, label, collection }) => {
        const col = db.collection(collection);
        const [total, published, thisPeriod] = await Promise.all([
          col.countDocuments(),
          col.countDocuments({ status: 'published' }),
          col.countDocuments({
            $or: [
              { publishedAt: { $gte: since } },
              { createdAt: { $gte: since } },
              { date: { $gte: since.toISOString().slice(0, 10) } },
            ],
          }),
        ]);
        return { type, label, total, published, thisPeriod };
      })
    );

    // Pipeline (content_queue)
    const queueCol = db.collection('content_queue');
    const [pending, generating, published_q, failed, totalThisPeriod] = await Promise.all([
      queueCol.countDocuments({ status: 'pending' }),
      queueCol.countDocuments({ status: 'generating' }),
      queueCol.countDocuments({ status: 'published', updatedAt: { $gte: since } }),
      queueCol.countDocuments({ status: 'failed', updatedAt: { $gte: since } }),
      queueCol.countDocuments({ createdAt: { $gte: since } }),
    ]);

    const result: InternalMetrics = {
      leads: {
        total: totalLeads,
        thisPeriod: periodLeads,
        bySource: leadsBySource.map((s: any) => ({ source: s._id || 'unknown', count: s.count })),
      },
      content: contentStats,
      pipeline: {
        pending,
        generating,
        published: published_q,
        failed,
        totalThisPeriod,
      },
      _health: { configured: true },
    };

    setCache(key, result, 5 * 60 * 1000); // 5 min TTL for internal data
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Internal]', msg);
    return {
      leads: { total: 0, thisPeriod: 0, bySource: [] },
      content: [],
      pipeline: { pending: 0, generating: 0, published: 0, failed: 0, totalThisPeriod: 0 },
      _health: { configured: true, error: msg },
    };
  }
}
