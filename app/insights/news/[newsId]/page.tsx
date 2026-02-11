import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedNewsItemById, getAllNewsIds, NewsItem } from '@/lib/resources-db';
import { newsBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllNewsIds();
    return ids.map((newsId) => ({ newsId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ newsId: string }>;
}): Promise<Metadata> {
  const { newsId } = await params;
  try {
    const item = await getPublishedNewsItemById(newsId);
    if (!item) return { title: 'News Not Found' };
    return {
      title: `${item.headline} | News`,
      description: item.summary.slice(0, 160),
    };
  } catch {
    return { title: 'News' };
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  marketing: 'Marketing',
  ai: 'AI',
  industry: 'Industry',
  research: 'Research',
};

const IMPACT_COLORS: Record<string, string> = {
  high: 'text-red-400 bg-red-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-green-400 bg-green-400/10',
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'text-green-400 bg-green-400/10',
  neutral: 'text-greige bg-white/5',
  negative: 'text-red-400 bg-red-400/10',
};

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ newsId: string }>;
}) {
  const { newsId } = await params;

  let item: NewsItem | null = null;
  try {
    item = await getPublishedNewsItemById(newsId);
  } catch {
    // empty
  }

  if (!item) notFound();

  const breadcrumbSchema = newsBreadcrumb(item.headline);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <article className="section-wide max-w-4xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />

          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Insights</Link>
            <span>/</span>
            <Link href="/insights/news" className="hover:text-atomic-tangerine">News</Link>
            <span>/</span>
            <span className="text-shroomy">{item.headline}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {item.headline}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ color: '#088BA0', backgroundColor: 'rgba(8, 139, 160, 0.08)' }}
            >
              {CATEGORY_LABELS[item.category] || item.category}
            </span>
            <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${IMPACT_COLORS[item.impact] || ''}`}>
              {item.impact} impact
            </span>
            <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${SENTIMENT_COLORS[item.sentiment] || ''}`}>
              {item.sentiment}
            </span>
            {item.source.publishedAt && (
              <span className="text-xs text-greige">
                {new Date(item.source.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Summary */}
          <section className="mb-10">
            <p className="text-shroomy text-lg leading-relaxed">
              {item.summary}
            </p>
          </section>

          {/* Our Take (Commentary) */}
          {item.commentary && (
            <section className="glass rounded-xl p-8 mb-10 border-l-4 border-[#088BA0]">
              <h2 className="text-xl font-semibold text-white mb-4">Our Take</h2>
              <div>
                {item.commentary.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-shroomy leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}

          {/* Source link */}
          {item.source.url && (
            <div className="mb-10">
              <a
                href={item.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-atomic-tangerine hover:text-hot-sauce transition-colors"
              >
                <span>Read original source at {item.source.name}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-greige bg-white/5 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <RelatedContent
            currentType="news"
            currentId={item.newsId}
            tags={item.tags}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
