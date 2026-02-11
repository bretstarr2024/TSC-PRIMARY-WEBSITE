import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InsightCard } from '@/components/insights/InsightCard';
import { getAllPublishedComparisons, Comparison } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Comparisons | Insights',
  description: 'Side-by-side analyses of B2B marketing tools, strategies, and approaches to inform your decisions.',
};

export default async function ComparisonsListingPage() {
  let comparisons: Comparison[] = [];
  try {
    comparisons = await getAllPublishedComparisons();
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
            <span className="text-shroomy">Comparisons</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Comparisons</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Side-by-side analyses to inform your strategic decisions.
          </p>
        </section>

        <section className="section-wide">
          {comparisons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisons.map((comp) => (
                <InsightCard
                  key={comp.comparisonId}
                  type="comparison"
                  title={comp.title}
                  description={comp.introduction.slice(0, 160) + '...'}
                  href={`/insights/comparisons/${comp.comparisonId}`}
                  tags={comp.tags}
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
