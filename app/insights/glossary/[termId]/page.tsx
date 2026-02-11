import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedGlossaryTermById, getAllGlossaryTermIds, GlossaryTerm } from '@/lib/resources-db';
import { glossaryBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllGlossaryTermIds();
    return ids.map((termId) => ({ termId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ termId: string }>;
}): Promise<Metadata> {
  const { termId } = await params;
  try {
    const term = await getPublishedGlossaryTermById(termId);
    if (!term) return { title: 'Term Not Found' };
    return {
      title: `${term.term} — Definition | Glossary`,
      description: term.shortDefinition,
    };
  } catch {
    return { title: 'Glossary Term' };
  }
}

export default async function GlossaryDetailPage({
  params,
}: {
  params: Promise<{ termId: string }>;
}) {
  const { termId } = await params;

  let term: GlossaryTerm | null = null;
  try {
    term = await getPublishedGlossaryTermById(termId);
  } catch {
    // empty
  }

  if (!term) notFound();

  const breadcrumbSchema = glossaryBreadcrumb(term.term);

  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    description: term.shortDefinition,
    ...(term.acronym && { alternateName: term.acronym }),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <article className="section-wide max-w-4xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />

          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Insights</Link>
            <span>/</span>
            <Link href="/insights/glossary" className="hover:text-atomic-tangerine">Glossary</Link>
            <span>/</span>
            <span className="text-shroomy">{term.term}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white">
              {term.term}
            </h1>
            {term.acronym && (
              <span className="text-lg text-greige bg-white/5 px-3 py-1 rounded-lg">
                {term.acronym}
              </span>
            )}
          </div>

          {/* Short definition - quote box */}
          <div className="glass rounded-xl p-8 mb-10 border-l-4 border-[#73F5FF]">
            <p className="text-shroomy text-lg leading-relaxed italic">
              {term.shortDefinition}
            </p>
          </div>

          {/* Full definition */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">Full Definition</h2>
            <p className="text-shroomy leading-relaxed whitespace-pre-line">
              {term.fullDefinition}
            </p>
          </section>

          {/* Examples */}
          {term.examples.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">Examples</h2>
              <ol className="list-decimal list-inside space-y-3">
                {term.examples.map((example, i) => (
                  <li key={i} className="text-shroomy leading-relaxed">
                    {example}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Synonyms */}
          {term.synonyms.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">Synonyms</h2>
              <div className="flex flex-wrap gap-2">
                {term.synonyms.map((synonym) => (
                  <span
                    key={synonym}
                    className="text-sm text-shroomy bg-white/5 px-3 py-1.5 rounded-lg"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Related Terms */}
          {term.relatedTerms.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold text-white mb-4">Related Terms</h2>
              <div className="flex flex-wrap gap-2">
                {term.relatedTerms.map((related) => (
                  <span
                    key={related}
                    className="text-sm text-atomic-tangerine bg-white/5 px-3 py-1.5 rounded-lg"
                  >
                    {related}
                  </span>
                ))}
              </div>
            </section>
          )}

          <RelatedContent
            currentType="glossary"
            currentId={term.termId}
            tags={term.tags}
            clusterName={term.clusterName}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
