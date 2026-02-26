import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FaqFlipCard } from '@/components/insights/FaqFlipCard';
import { getAllPublishedFaqs, FaqItem } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'FAQ | Grist',
  description: 'Direct answers to the questions B2B marketers actually ask. From strategy to AI to demand gen.',
};

export default async function FaqListingPage() {
  let faqs: FaqItem[] = [];
  try {
    faqs = await getAllPublishedFaqs();
  } catch {
    // empty
  }

  // Group FAQs by category
  const grouped: Record<string, typeof faqs> = {};
  for (const faq of faqs) {
    const cat = faq.category || 'General';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(faq);
  }

  const categories = Object.keys(grouped).sort();

  // Build FAQPage schema for SEO/AEO
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <script
          type="application/ld+json"
          id="faq-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <section className="section-wide mb-12">
          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Grist</Link>
            <span>/</span>
            <span className="text-shroomy">FAQ</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">FAQ</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Direct answers to the questions B2B marketers actually ask.
          </p>
        </section>

        <section className="section-wide">
          {faqs.length > 0 ? (
            <div className="space-y-12">
              {categories.map((category) => (
                <div key={category}>
                  <h2 className="text-2xl font-semibold text-white mb-6">{category}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {grouped[category].map((faq) => (
                      <FaqFlipCard
                        key={faq.faqId}
                        question={faq.question}
                        answer={faq.answer}
                        faqId={faq.faqId}
                        tags={faq.tags}
                      />
                    ))}
                  </div>
                </div>
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
