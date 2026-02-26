import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InsightCard } from '@/components/insights/InsightCard';
import { getAllPublishedExpertQa, ExpertQaItem } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Expert Q&A | Grist',
  description: 'Candid perspectives from experienced B2B marketing leaders on strategy, AI, and growth.',
};

export default async function ExpertQaListingPage() {
  let items: ExpertQaItem[] = [];
  try {
    items = await getAllPublishedExpertQa();
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
            <Link href="/insights" className="hover:text-atomic-tangerine">Grist</Link>
            <span>/</span>
            <span className="text-shroomy">Expert Q&A</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Expert Q&A</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Candid perspectives from experienced marketing leaders.
          </p>
        </section>

        <section className="section-wide">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((qa) => (
                <InsightCard
                  key={qa.qaId}
                  type="expert-qa"
                  title={qa.question}
                  description={qa.answer.slice(0, 160) + '...'}
                  href={`/insights/expert-qa/${qa.qaId}`}
                  author={qa.expert.name}
                  tags={qa.tags}
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
