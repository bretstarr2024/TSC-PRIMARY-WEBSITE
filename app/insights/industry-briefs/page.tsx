import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InsightCard } from '@/components/insights/InsightCard';
import { getAllPublishedIndustryBriefs, IndustryBrief } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Industry Briefs | Grist',
  description: 'Data-driven snapshots of market trends and buyer behavior in B2B marketing.',
};

export default async function IndustryBriefsListingPage() {
  let briefs: IndustryBrief[] = [];
  try {
    briefs = await getAllPublishedIndustryBriefs();
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
            <span className="text-shroomy">Industry Briefs</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Industry Briefs</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Data-driven snapshots of market trends and buyer behavior.
          </p>
        </section>

        <section className="section-wide">
          {briefs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {briefs.map((brief) => (
                <InsightCard
                  key={brief.briefId}
                  type="industry-brief"
                  title={brief.title}
                  description={brief.summary.slice(0, 160) + '...'}
                  href={`/insights/industry-briefs/${brief.briefId}`}
                  author={brief.author}
                  tags={brief.tags}
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
