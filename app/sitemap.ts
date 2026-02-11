import { MetadataRoute } from 'next';
import { getAllPublishedBlogPosts } from '@/lib/content-db';
import {
  getAllPublishedFaqs,
  getAllPublishedGlossaryTerms,
  getAllPublishedComparisons,
  getAllPublishedExpertQa,
  getAllPublishedNews,
  getAllPublishedCaseStudies,
  getAllPublishedIndustryBriefs,
  getAllPublishedVideos,
  getAllPublishedTools,
} from '@/lib/resources-db';

const BASE_URL = 'https://tsc-primary-website.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/services`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/insights`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/insights/blog`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/insights/faq`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/insights/glossary`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/insights/comparisons`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/insights/expert-qa`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/insights/news`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/insights/case-studies`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/insights/industry-briefs`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/insights/videos`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/insights/tools`, changeFrequency: 'weekly', priority: 0.7 },
  ];

  // Dynamic content pages — query all 10 collections in parallel
  const [blogs, faqs, glossary, comparisons, expertQa, news, caseStudies, briefs, videos, tools] = await Promise.all([
    getAllPublishedBlogPosts().catch(() => []),
    getAllPublishedFaqs().catch(() => []),
    getAllPublishedGlossaryTerms().catch(() => []),
    getAllPublishedComparisons().catch(() => []),
    getAllPublishedExpertQa().catch(() => []),
    getAllPublishedNews().catch(() => []),
    getAllPublishedCaseStudies().catch(() => []),
    getAllPublishedIndustryBriefs().catch(() => []),
    getAllPublishedVideos().catch(() => []),
    getAllPublishedTools().catch(() => []),
  ]);

  const dynamicPages: MetadataRoute.Sitemap = [
    ...blogs.map((p) => ({
      url: `${BASE_URL}/insights/blog/${p.slug}`,
      lastModified: p.publishedAt || p.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...faqs.map((f) => ({
      url: `${BASE_URL}/insights/faq/${f.faqId}`,
      lastModified: f.publishedAt || f.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...glossary.map((g) => ({
      url: `${BASE_URL}/insights/glossary/${g.termId}`,
      lastModified: g.publishedAt || g.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...comparisons.map((c) => ({
      url: `${BASE_URL}/insights/comparisons/${c.comparisonId}`,
      lastModified: c.publishedAt || c.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...expertQa.map((q) => ({
      url: `${BASE_URL}/insights/expert-qa/${q.qaId}`,
      lastModified: q.publishedAt || q.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...news.map((n) => ({
      url: `${BASE_URL}/insights/news/${n.newsId}`,
      lastModified: n.publishedAt || n.createdAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...caseStudies.map((cs) => ({
      url: `${BASE_URL}/insights/case-studies/${cs.caseStudyId}`,
      lastModified: cs.publishedAt || cs.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...briefs.map((b) => ({
      url: `${BASE_URL}/insights/industry-briefs/${b.briefId}`,
      lastModified: b.publishedAt || b.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...videos.map((v) => ({
      url: `${BASE_URL}/insights/videos/${v.videoId}`,
      lastModified: v.publishedAt || v.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...tools.map((t) => ({
      url: `${BASE_URL}/insights/tools/${t.toolId}`,
      lastModified: t.publishedAt || t.createdAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...dynamicPages];
}
