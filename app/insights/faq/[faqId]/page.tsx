import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedFaqById, getAllFaqIds, FaqItem } from '@/lib/resources-db';
import { faqBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllFaqIds();
    return ids.map((faqId) => ({ faqId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ faqId: string }>;
}): Promise<Metadata> {
  const { faqId } = await params;
  try {
    const faq = await getPublishedFaqById(faqId);
    if (!faq) return { title: 'FAQ Not Found' };
    return {
      title: `${faq.question} | FAQ`,
      description: faq.answer.slice(0, 160),
    };
  } catch {
    return { title: 'FAQ' };
  }
}

export default async function FaqDetailPage({
  params,
}: {
  params: Promise<{ faqId: string }>;
}) {
  const { faqId } = await params;

  let faq: FaqItem | null = null;
  try {
    faq = await getPublishedFaqById(faqId);
  } catch {
    // empty
  }

  if (!faq) notFound();

  const breadcrumbSchema = faqBreadcrumb(faq.question);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <article className="section-wide max-w-4xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <Link href="/insights/faq" className="hover:text-atomic-tangerine">FAQ</Link>
            <span>/</span>
            <span className="text-shroomy">{faq.question}</span>
          </nav>

          <span
            className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6"
            style={{ color: '#E1FF00', backgroundColor: 'rgba(225, 255, 0, 0.08)' }}
          >
            {faq.category}
          </span>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-8">
            {faq.question}
          </h1>

          <div className="glass rounded-xl p-8 mb-10">
            <p className="text-shroomy text-lg leading-relaxed whitespace-pre-line">
              {faq.answer}
            </p>
          </div>

          {faq.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {faq.tags.map((tag) => (
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
            currentType="faq"
            currentId={faq.faqId}
            tags={faq.tags}
            clusterName={faq.clusterName}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
