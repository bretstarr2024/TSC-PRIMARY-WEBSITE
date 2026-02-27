import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ChecklistRenderer } from '@/components/insights/ChecklistRenderer';
import { AssessmentRenderer } from '@/components/insights/AssessmentRenderer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedToolById, getAllToolIds, Tool } from '@/lib/resources-db';
import { toolBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllToolIds();
    return ids.map((toolId) => ({ toolId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ toolId: string }>;
}): Promise<Metadata> {
  const { toolId } = await params;
  try {
    const tool = await getPublishedToolById(toolId);
    if (!tool) return { title: 'Tool Not Found' };
    return {
      title: `${tool.title} | Tools`,
      description: tool.description.slice(0, 160),
      alternates: { canonical: `/insights/tools/${toolId}` },
      openGraph: {
        type: 'article',
        title: tool.title,
        description: tool.description.slice(0, 160),
      },
    };
  } catch {
    return { title: 'Tool' };
  }
}

const TOOL_TYPE_LABELS: Record<string, string> = {
  checklist: 'Checklist',
  assessment: 'Assessment',
  calculator: 'Calculator',
};

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = await params;

  let tool: Tool | null = null;
  try {
    tool = await getPublishedToolById(toolId);
  } catch {
    // empty
  }

  if (!tool) notFound();

  const breadcrumbSchema = toolBreadcrumb(tool.title);

  return (
    <>
      <ScrollProgress />
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
            <Link href="/insights/tools" className="hover:text-atomic-tangerine">Tools</Link>
            <span>/</span>
            <span className="text-shroomy">{tool.title}</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 inline-block"
              style={{ color: '#F472B6', backgroundColor: 'rgba(244, 114, 182, 0.08)' }}
            >
              {TOOL_TYPE_LABELS[tool.toolType] || tool.toolType}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {tool.title}
            </h1>
            <p className="text-xl text-shroomy leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Interactive Tool */}
          <section className="mb-10">
            {tool.toolType === 'checklist' && tool.checklistItems && (
              <ChecklistRenderer items={tool.checklistItems} />
            )}

            {tool.toolType === 'assessment' && tool.assessmentQuestions && tool.assessmentResults && (
              <AssessmentRenderer
                questions={tool.assessmentQuestions}
                results={tool.assessmentResults}
              />
            )}

            {tool.toolType === 'calculator' && (
              <div className="glass rounded-xl p-8 text-center">
                <p className="text-greige">Calculator tools coming soon.</p>
              </div>
            )}
          </section>

          {/* Tags */}
          {tool.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {tool.tags.map((tag) => (
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
            currentType="tool"
            currentId={tool.toolId}
            tags={tool.tags}
            clusterName={tool.clusterName || undefined}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
