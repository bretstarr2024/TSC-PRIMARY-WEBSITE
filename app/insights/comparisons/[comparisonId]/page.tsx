import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedComparisonById, getAllComparisonIds, Comparison } from '@/lib/resources-db';
import { comparisonBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllComparisonIds();
    return ids.map((comparisonId) => ({ comparisonId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ comparisonId: string }>;
}): Promise<Metadata> {
  const { comparisonId } = await params;
  try {
    const comp = await getPublishedComparisonById(comparisonId);
    if (!comp) return { title: 'Comparison Not Found' };
    return {
      title: `${comp.title} | Comparisons`,
      description: comp.introduction.slice(0, 160),
    };
  } catch {
    return { title: 'Comparison' };
  }
}

export default async function ComparisonDetailPage({
  params,
}: {
  params: Promise<{ comparisonId: string }>;
}) {
  const { comparisonId } = await params;

  let comp: Comparison | null = null;
  try {
    comp = await getPublishedComparisonById(comparisonId);
  } catch {
    // empty
  }

  if (!comp) notFound();

  const breadcrumbSchema = comparisonBreadcrumb(comp.title);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <article className="section-wide max-w-5xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />

          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Grist</Link>
            <span>/</span>
            <Link href="/insights/comparisons" className="hover:text-atomic-tangerine">Comparisons</Link>
            <span>/</span>
            <span className="text-shroomy">{comp.title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {comp.title}
          </h1>

          <p className="text-shroomy text-lg leading-relaxed mb-10">
            {comp.introduction}
          </p>

          {/* Comparison Table */}
          {comp.criteria.length > 0 && comp.items.length > 0 && (
            <div className="glass rounded-xl overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="p-4 text-greige text-sm font-semibold">Criteria</th>
                      {comp.items.map((item) => (
                        <th key={item.name} className="p-4 text-white text-sm font-semibold">
                          {item.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comp.criteria.map((criterion) => (
                      <tr key={criterion.name} className="border-b border-white/5">
                        <td className="p-4">
                          <span className="text-shroomy text-sm font-medium">{criterion.name}</span>
                          {criterion.description && (
                            <p className="text-greige text-xs mt-1">{criterion.description}</p>
                          )}
                        </td>
                        {comp.items.map((item) => {
                          const score = item.scores[criterion.name] ?? 0;
                          return (
                            <td key={item.name} className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white/5 rounded-full h-2 max-w-[100px]">
                                  <div
                                    className="h-2 rounded-full bg-atomic-tangerine"
                                    style={{ width: `${Math.min(score * 10, 100)}%` }}
                                  />
                                </div>
                                <span className="text-white text-sm font-medium">{score}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pros/Cons per item */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {comp.items.map((item) => (
              <div key={item.name} className="glass rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4">{item.name}</h3>
                {item.description && (
                  <p className="text-shroomy text-sm mb-4">{item.description}</p>
                )}

                {item.pros.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Pros</h4>
                    <ul className="space-y-1">
                      {item.pros.map((pro, i) => (
                        <li key={i} className="text-shroomy text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-0.5 shrink-0">+</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.cons.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Cons</h4>
                    <ul className="space-y-1">
                      {item.cons.map((con, i) => (
                        <li key={i} className="text-shroomy text-sm flex items-start gap-2">
                          <span className="text-red-400 mt-0.5 shrink-0">-</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Best For */}
          {comp.bestFor && comp.bestFor.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">Best For</h2>
              <div className="space-y-3">
                {comp.bestFor.map((bf, i) => (
                  <div key={i} className="glass rounded-lg p-4">
                    <span className="text-white font-medium">{bf.useCase}:</span>{' '}
                    <span className="text-shroomy">{bf.recommendation}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Verdict */}
          <div className="glass rounded-xl p-8 mb-10 border-l-4 border-[#ED0AD2]">
            <h2 className="text-xl font-semibold text-white mb-3">Verdict</h2>
            <p className="text-shroomy text-lg leading-relaxed">
              {comp.verdict}
            </p>
          </div>

          <RelatedContent
            currentType="comparison"
            currentId={comp.comparisonId}
            tags={comp.tags}
            clusterName={comp.clusterName}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
