import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { InsightCard } from '@/components/insights/InsightCard';
import { getAllPublishedVideos, Video } from '@/lib/resources-db';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Videos | Grist',
  description: 'Strategic video perspectives on B2B marketing, AI transformation, and growth from The Starr Conspiracy.',
};

export default async function VideosListingPage() {
  let videos: Video[] = [];
  try {
    videos = await getAllPublishedVideos();
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
            <span className="text-shroomy">Videos</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Videos</h1>
          <p className="text-xl text-shroomy max-w-2xl">
            Strategic video perspectives on B2B marketing, AI transformation, and growth.
          </p>
        </section>

        <section className="section-wide">
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <InsightCard
                  key={video.videoId}
                  type="video"
                  title={video.title}
                  description={video.description.slice(0, 160) + '...'}
                  href={`/insights/videos/${video.videoId}`}
                  author={video.speaker || undefined}
                  tags={video.tags}
                />
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
