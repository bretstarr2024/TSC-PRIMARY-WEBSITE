import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllPublishedCaseStudies, CaseStudy } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Case Studies | Insights',
  description: 'Real engagement outcomes with measurable results from The Starr Conspiracy.',
};

export default async function CaseStudiesListingPage() {
  let caseStudies: CaseStudy[] = [];
  try {
    caseStudies = await getAllPublishedCaseStudies();
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
            <span className="text-shroomy">Case Studies</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Case Studies</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Real engagement outcomes with measurable results.
          </p>
        </section>

        <section className="section-wide">
          {caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseStudies.map((cs) => (
                <Link
                  key={cs.caseStudyId}
                  href={`/insights/case-studies/${cs.caseStudyId}`}
                  className="glass rounded-xl p-6 block hover:no-underline group transition-all duration-300 hover:border-white/10"
                  style={{ borderLeftColor: '#7C3AED', borderLeftWidth: 3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white font-semibold group-hover:text-atomic-tangerine transition-colors">
                      {cs.client}
                    </span>
                    <span className="text-xs text-greige bg-white/5 px-2 py-0.5 rounded">
                      {cs.industry}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-3 line-clamp-2">
                    {cs.title}
                  </h3>

                  <p className="text-shroomy text-sm leading-relaxed line-clamp-2 mb-4">
                    {cs.challenge.slice(0, 120)}...
                  </p>

                  {cs.metrics.length > 0 && (
                    <div className="space-y-2">
                      {cs.metrics.slice(0, 3).map((metric, i) => (
                        <div key={i} className="flex items-baseline gap-3">
                          <span className="text-atomic-tangerine font-bold text-lg flex-shrink-0">{metric.value}</span>
                          <span className="text-greige text-xs">{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
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
