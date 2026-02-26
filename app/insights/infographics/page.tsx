import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllPublishedInfographics, Infographic } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Infographics | Grist',
  description: 'Visual breakdowns of data, frameworks, and strategies worth sharing. From The Starr Conspiracy.',
};

export default async function InfographicsListingPage() {
  let infographics: Infographic[] = [];
  try {
    infographics = await getAllPublishedInfographics();
  } catch {
    // empty
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-20">
        <section className="section-wide mb-12">
          <nav className="flex items-center gap-2 text-sm text-greige mb-8">
            <Link href="/" className="hover:text-atomic-tangerine">Home</Link>
            <span>/</span>
            <Link href="/insights" className="hover:text-atomic-tangerine">Grist</Link>
            <span>/</span>
            <span className="text-shroomy">Infographics</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Infographics</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Visual breakdowns of data, frameworks, and strategies worth sharing.
          </p>
        </section>

        <section className="section-wide">
          {infographics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {infographics.map((ig) => (
                <Link
                  key={ig.infographicId}
                  href={`/insights/infographics/${ig.infographicId}`}
                  className="group glass rounded-xl overflow-hidden hover:no-underline transition-all duration-300 hover:border-white/10"
                  style={{ borderLeftColor: '#818CF8', borderLeftWidth: 3 }}
                >
                  {ig.imageUrl && (
                    <div className="relative w-full aspect-[4/3] bg-white/5">
                      <Image
                        src={ig.imageUrl}
                        alt={ig.altText || ig.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h2 className="text-white font-semibold text-lg group-hover:text-atomic-tangerine transition-colors line-clamp-2">
                      {ig.title}
                    </h2>
                    <p className="text-greige text-sm mt-2 line-clamp-2">
                      {ig.description}
                    </p>
                    {ig.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {ig.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-greige bg-white/5 rounded-full px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
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
