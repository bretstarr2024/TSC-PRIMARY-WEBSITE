import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InsightCard } from '@/components/insights/InsightCard';
import { getAllPublishedTools, Tool } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Tools | Insights',
  description: 'Interactive checklists, assessments, and calculators for B2B marketing leaders.',
};

const TOOL_TYPE_INFO: Record<string, { label: string; description: string }> = {
  checklist: {
    label: 'Checklists',
    description: 'Step-by-step frameworks to audit and improve your marketing operations.',
  },
  assessment: {
    label: 'Assessments',
    description: 'Evaluate your readiness and maturity across key marketing dimensions.',
  },
  calculator: {
    label: 'Calculators',
    description: 'Quantify ROI, budget requirements, and performance benchmarks.',
  },
};

export default async function ToolsListingPage() {
  let tools: Tool[] = [];
  try {
    tools = await getAllPublishedTools();
  } catch {
    // empty
  }

  const toolsByType = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
    if (!acc[tool.toolType]) acc[tool.toolType] = [];
    acc[tool.toolType].push(tool);
    return acc;
  }, {});

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
            <span className="text-shroomy">Tools</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Tools</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Interactive checklists, assessments, and calculators for B2B marketing leaders.
          </p>
        </section>

        {/* Tool Type Overview */}
        <section className="section-wide mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(TOOL_TYPE_INFO).map(([type, info]) => (
              <div key={type} className="glass rounded-xl p-6" style={{ borderLeftColor: '#F472B6', borderLeftWidth: 3 }}>
                <h3 className="text-white font-semibold text-lg mb-2">{info.label}</h3>
                <p className="text-shroomy text-sm">{info.description}</p>
                <p className="text-greige text-xs mt-3">
                  {toolsByType[type]?.length || 0} available
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tools by Type */}
        <section className="section-wide">
          {tools.length > 0 ? (
            <div className="space-y-12">
              {Object.entries(toolsByType).map(([type, typeTools]) => (
                <div key={type}>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-greige mb-6">
                    {TOOL_TYPE_INFO[type]?.label || type}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeTools.map((tool) => (
                      <InsightCard
                        key={tool.toolId}
                        type="tool"
                        title={tool.title}
                        description={tool.description.slice(0, 160) + '...'}
                        href={`/insights/tools/${tool.toolId}`}
                        tags={tool.tags}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-greige text-lg">Tools are being developed. Check back soon.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
