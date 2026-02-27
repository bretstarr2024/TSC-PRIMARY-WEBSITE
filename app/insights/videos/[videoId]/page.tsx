import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { ContentRenderer } from '@/components/insights/ContentRenderer';
import { RelatedContent } from '@/components/insights/RelatedContent';
import { CtaStrip } from '@/components/insights/CtaStrip';
import { getPublishedVideoById, getAllVideoIds, Video } from '@/lib/resources-db';
import { videoBreadcrumb } from '@/lib/schema/breadcrumbs';

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const ids = await getAllVideoIds();
    return ids.map((videoId) => ({ videoId }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ videoId: string }>;
}): Promise<Metadata> {
  const { videoId } = await params;
  try {
    const video = await getPublishedVideoById(videoId);
    if (!video) return { title: 'Video Not Found' };
    return {
      title: `${video.title} | Videos`,
      description: video.description.slice(0, 160),
      alternates: { canonical: `/insights/videos/${videoId}` },
      openGraph: {
        type: 'article',
        title: video.title,
        description: video.description.slice(0, 160),
      },
    };
  } catch {
    return { title: 'Video' };
  }
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;

  let video: Video | null = null;
  try {
    video = await getPublishedVideoById(videoId);
  } catch {
    // empty
  }

  if (!video) notFound();

  const breadcrumbSchema = videoBreadcrumb(video.title);

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
            <Link href="/insights/videos" className="hover:text-atomic-tangerine">Videos</Link>
            <span>/</span>
            <span className="text-shroomy">{video.title}</span>
          </nav>

          {/* Video Embed */}
          {video.embedUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 border border-white/10">
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          )}

          {/* External video link (when no embed) */}
          {!video.embedUrl && video.videoUrl && (
            <div className="glass rounded-xl p-8 mb-8 text-center">
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-atomic-tangerine hover:text-hot-sauce transition-colors text-lg font-medium"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Video</span>
              </a>
            </div>
          )}

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {video.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {video.speaker && (
              <span className="text-shroomy">
                <span className="text-greige">Speaker:</span> {video.speaker}
              </span>
            )}
            {video.duration && (
              <span className="text-greige">{video.duration}</span>
            )}
          </div>

          {/* Answer Capsule */}
          {video.answerCapsule && (
            <div className="glass rounded-xl p-6 mb-8 border-l-4 border-[#10B981]">
              <p className="text-white text-lg leading-relaxed italic">
                {video.answerCapsule}
              </p>
            </div>
          )}

          {/* Description */}
          <section className="mb-10">
            <ContentRenderer content={video.description} />
          </section>

          {/* Transcript */}
          {video.transcript && (
            <details className="glass rounded-xl p-6 mb-10 group">
              <summary className="cursor-pointer text-white font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Full Transcript
              </summary>
              <div className="mt-4 pt-4 border-t border-white/10">
                <ContentRenderer content={video.transcript} />
              </div>
            </details>
          )}

          {/* Tags */}
          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {video.tags.map((tag) => (
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
            currentType="video"
            currentId={video.videoId}
            tags={video.tags}
            clusterName={video.clusterName || undefined}
          />

          <CtaStrip />
        </article>
      </main>
      <Footer />
    </>
  );
}
