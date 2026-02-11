import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllPublishedGlossaryTerms, GlossaryTerm } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Glossary | Insights',
  description: 'Clear definitions for the terms that matter in modern B2B marketing, AI, and go-to-market strategy.',
};

export default async function GlossaryListingPage() {
  let terms: GlossaryTerm[] = [];
  try {
    terms = await getAllPublishedGlossaryTerms();
  } catch {
    // empty
  }

  // Group terms by first letter
  const grouped: Record<string, typeof terms> = {};
  for (const term of terms) {
    const letter = term.term.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(term);
  }

  const letters = Object.keys(grouped).sort();
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
            <span className="text-shroomy">Glossary</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Glossary</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Clear definitions for the terms that matter in modern marketing.
          </p>
        </section>

        <section className="section-wide">
          {terms.length > 0 ? (
            <>
              {/* A-Z Navigation */}
              <div className="flex flex-wrap gap-2 mb-12">
                {alphabet.map((letter) => {
                  const hasTerms = letters.includes(letter);
                  return (
                    <a
                      key={letter}
                      href={hasTerms ? `#letter-${letter}` : undefined}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        hasTerms
                          ? 'glass text-white hover:text-atomic-tangerine cursor-pointer'
                          : 'text-greige/30 cursor-default'
                      }`}
                    >
                      {letter}
                    </a>
                  );
                })}
              </div>

              {/* Term sections by letter */}
              <div className="space-y-12">
                {letters.map((letter) => (
                  <div key={letter} id={`letter-${letter}`}>
                    <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                      {letter}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {grouped[letter].map((term) => (
                        <Link
                          key={term.termId}
                          href={`/insights/glossary/${term.termId}`}
                          className="glass rounded-xl p-5 block hover:no-underline group transition-all duration-200 hover:border-white/10"
                          style={{ borderLeftColor: '#73F5FF', borderLeftWidth: 3 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-white font-semibold group-hover:text-atomic-tangerine transition-colors">
                              {term.term}
                            </h3>
                            {term.acronym && (
                              <span className="text-xs text-greige bg-white/5 px-2 py-0.5 rounded">
                                {term.acronym}
                              </span>
                            )}
                          </div>
                          <p className="text-shroomy text-sm leading-relaxed line-clamp-2">
                            {term.shortDefinition}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
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
