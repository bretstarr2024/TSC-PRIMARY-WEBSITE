import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { AuthorBio } from '@/components/insights/AuthorBio';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedExpertQaById, getAllExpertQaIds, ExpertQaItem } from '@/lib/resources-db';
import { getArticleSchema } from '@/lib/schema/people';
import { expertQaBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllExpertQaIds();
    return ids.map((qaId) => ({ qaId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ qaId: string }>;
}): Promise<Metadata> {
  const { qaId } = await params;
  try {
    const qa = await getPublishedExpertQaById(qaId);
    if (!qa) return { title: 'Q&A Not Found' };
    return {
      title: `${qa.question} — ${qa.expert.name} | Expert Q&A`,
      description: qa.answer.slice(0, 160),
    };
  } catch {
    return { title: 'Expert Q&A' };
  }
}

export default async function ExpertQaDetailPage({
  params,
}: {
  params: Promise<{ qaId: string }>;
}) {
  const { qaId } = await params;

  let qa: ExpertQaItem | null = null;
  try {
    qa = await getPublishedExpertQaById(qaId);
  } catch {
    // empty
  }

  if (!qa) notFound();

  const breadcrumbSchema = expertQaBreadcrumb(qa.question);

  const articleSchema = getArticleSchema({
    title: qa.question,
    description: qa.answer.slice(0, 160),
    datePublished: qa.createdAt.toISOString(),
    author: qa.expert.name,
    tags: qa.tags,
  });

  const expertInitials = qa.expert.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <article className="section-wide max-w-4xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />

          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Grist</Link>
            <span>/</span>
            <Link href="/insights/expert-qa" className="hover:text-atomic-tangerine">Expert Q&A</Link>
            <span>/</span>
            <span className="text-shroomy">{qa.question}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">
            {qa.question}
          </h1>

          {/* Expert card */}
          <div className="glass rounded-xl p-6 flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-atomic-tangerine to-hot-sauce flex items-center justify-center text-white font-bold text-lg shrink-0">
              {expertInitials}
            </div>
            <div>
              <span className="text-white font-semibold">{qa.expert.name}</span>
              <p className="text-greige text-sm">
                {qa.expert.title}{qa.expert.organization ? `, ${qa.expert.organization}` : ''}
              </p>
            </div>
          </div>

          {/* Answer paragraphs */}
          <div className="mb-10">
            {qa.answer.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-shroomy leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Quotable snippets */}
          {qa.quotableSnippets.length > 0 && (
            <div className="space-y-6 mb-10">
              {qa.quotableSnippets.map((snippet, i) => (
                <blockquote
                  key={i}
                  className="border-l-4 border-atomic-tangerine pl-6 py-3"
                >
                  <p className="text-white text-lg italic leading-relaxed">
                    &ldquo;{snippet}&rdquo;
                  </p>
                  <footer className="text-greige text-sm mt-2">
                    &mdash; {qa.expert.name}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}

          {/* Tags */}
          {qa.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {qa.tags.map((tag) => (
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
            currentType="expert-qa"
            currentId={qa.qaId}
            tags={qa.tags}
            clusterName={qa.clusterName}
          />

          <AuthorBio featuredAuthor={qa.expert.name} />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
