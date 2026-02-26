import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContentRenderer } from '@/components/insights/ContentRenderer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedIndustryBriefById, getAllIndustryBriefIds, IndustryBrief } from '@/lib/resources-db';
import { industryBriefBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllIndustryBriefIds();
    return ids.map((briefId) => ({ briefId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ briefId: string }>;
}): Promise<Metadata> {
  const { briefId } = await params;
  try {
    const brief = await getPublishedIndustryBriefById(briefId);
    if (!brief) return { title: 'Brief Not Found' };
    return {
      title: `${brief.title} | Industry Briefs`,
      description: brief.summary.slice(0, 160),
    };
  } catch {
    return { title: 'Industry Brief' };
  }
}

export default async function IndustryBriefDetailPage({
  params,
}: {
  params: Promise<{ briefId: string }>;
}) {
  const { briefId } = await params;

  let brief: IndustryBrief | null = null;
  try {
    brief = await getPublishedIndustryBriefById(briefId);
  } catch {
    // empty
  }

  if (!brief) notFound();

  const breadcrumbSchema = industryBriefBreadcrumb(brief.title);

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
            <Link href="/insights" className="hover:text-atomic-tangerine">Grist</Link>
            <span>/</span>
            <Link href="/insights/industry-briefs" className="hover:text-atomic-tangerine">Industry Briefs</Link>
            <span>/</span>
            <span className="text-shroomy">{brief.title}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {brief.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-greige mb-10">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ color: '#D97706', backgroundColor: 'rgba(217, 119, 6, 0.08)' }}
            >
              {brief.industry}
            </span>
            {brief.author && (
              <>
                <span className="w-1 h-1 rounded-full bg-greige" />
                <span>{brief.author}</span>
              </>
            )}
            {brief.publishedAt && (
              <>
                <span className="w-1 h-1 rounded-full bg-greige" />
                <time dateTime={new Date(brief.publishedAt).toISOString()}>
                  {new Date(brief.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            )}
          </div>

          {/* Summary in glass card */}
          <div className="glass rounded-xl p-8 mb-10 border-l-4 border-[#D97706]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-greige mb-3">Executive Summary</h2>
            <p className="text-shroomy text-lg leading-relaxed">
              {brief.summary}
            </p>
          </div>

          {/* Full content */}
          <ContentRenderer content={brief.content} />

          {/* Key Findings */}
          {brief.keyFindings.length > 0 && (
            <section className="mt-10 mb-10">
              <h2 className="text-2xl font-semibold text-white mb-6">Key Findings</h2>
              <div className="space-y-3">
                {brief.keyFindings.map((finding, i) => (
                  <div key={i} className="glass rounded-lg p-4 flex items-start gap-3">
                    <span className="text-atomic-tangerine font-bold text-lg shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-shroomy leading-relaxed">{finding}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recommendations */}
          {brief.recommendations.length > 0 && (
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-white mb-6">Recommendations</h2>
              <div className="space-y-3">
                {brief.recommendations.map((rec, i) => (
                  <div key={i} className="glass rounded-lg p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-atomic-tangerine mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <p className="text-shroomy leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <RelatedContent
            currentType="industry-brief"
            currentId={brief.briefId}
            tags={brief.tags}
            clusterName={brief.clusterName}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
