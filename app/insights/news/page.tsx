import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InsightCard } from '@/components/insights/InsightCard';
import { getAllPublishedNews, NewsItem } from '@/lib/resources-db';

export const revalidate = 1800; // 30 min for news

export const metadata: Metadata = {
  title: 'News & Analysis | Insights',
  description: 'What\'s happening in B2B marketing — with our take on why it matters.',
};

export default async function NewsListingPage() {
  let newsItems: NewsItem[] = [];
  try {
    newsItems = await getAllPublishedNews();
  } catch {
    // empty
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <section className="section-wide mb-12">
          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Insights</Link>
            <span>/</span>
            <span className="text-shroomy">News & Analysis</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">News & Analysis</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            What&apos;s happening in B2B marketing &mdash; with our take on why it matters.
          </p>
        </section>

        <section className="section-wide">
          {newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <InsightCard
                  key={item.newsId}
                  type="news"
                  title={item.headline}
                  description={item.summary.slice(0, 160) + '...'}
                  href={`/insights/news/${item.newsId}`}
                  date={item.source.publishedAt ? new Date(item.source.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : undefined}
                  tags={item.tags}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-greige text-lg">Content is being generated. Check back soon.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
