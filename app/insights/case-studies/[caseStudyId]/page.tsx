import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedCaseStudyById, getAllCaseStudyIds, CaseStudy } from '@/lib/resources-db';
import { caseStudyBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllCaseStudyIds();
    return ids.map((caseStudyId) => ({ caseStudyId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ caseStudyId: string }>;
}): Promise<Metadata> {
  const { caseStudyId } = await params;
  try {
    const cs = await getPublishedCaseStudyById(caseStudyId);
    if (!cs) return { title: 'Case Study Not Found' };
    return {
      title: `${cs.title} | Case Studies`,
      description: cs.challenge.slice(0, 160),
    };
  } catch {
    return { title: 'Case Study' };
  }
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ caseStudyId: string }>;
}) {
  const { caseStudyId } = await params;

  let cs: CaseStudy | null = null;
  try {
    cs = await getPublishedCaseStudyById(caseStudyId);
  } catch {
    // empty
  }

  if (!cs) notFound();

  const breadcrumbSchema = caseStudyBreadcrumb(cs.title);

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
            <Link href="/insights/case-studies" className="hover:text-atomic-tangerine">Case Studies</Link>
            <span>/</span>
            <span className="text-shroomy">{cs.title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {cs.title}
          </h1>

          <div className="flex items-center gap-3 mb-10">
            <span className="text-shroomy font-medium">{cs.client}</span>
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ color: '#7C3AED', backgroundColor: 'rgba(124, 58, 237, 0.08)' }}
            >
              {cs.industry}
            </span>
          </div>

          {/* Challenge */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">The Challenge</h2>
            <div className="glass rounded-xl p-6">
              {cs.challenge.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-shroomy leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Approach */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Our Approach</h2>
            <div className="glass rounded-xl p-6">
              {cs.approach.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-shroomy leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* Results */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Results</h2>
            <div className="glass rounded-xl p-6 mb-6">
              {cs.results.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-shroomy leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Metrics grid */}
            {cs.metrics.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cs.metrics.map((metric, i) => (
                  <div key={i} className="glass rounded-xl p-6 text-center">
                    <span className="text-atomic-tangerine font-bold text-2xl md:text-3xl block mb-1">
                      {metric.value}
                    </span>
                    <span className="text-greige text-sm">{metric.label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Testimonial */}
          {cs.testimonial && (
            <blockquote className="border-l-4 border-[#7C3AED] pl-6 py-4 my-10">
              <p className="text-white text-lg italic leading-relaxed mb-3">
                &ldquo;{cs.testimonial.quote}&rdquo;
              </p>
              <footer className="text-greige text-sm">
                &mdash; {cs.testimonial.attribution}
              </footer>
            </blockquote>
          )}

          <RelatedContent
            currentType="case-study"
            currentId={cs.caseStudyId}
            tags={cs.tags}
            clusterName={cs.clusterName}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
