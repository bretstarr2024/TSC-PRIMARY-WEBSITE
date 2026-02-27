import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedVideoById, getAllVideoIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'Video | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllVideoIds();
    return ids.map((videoId) => ({ videoId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;
  try {
    const video = await getPublishedVideoById(videoId);
    return renderOgImage({
      title: video?.title ?? 'Video',
      badge: 'video',
    });
  } catch {
    return renderOgImage({ title: 'Video', badge: 'video' });
  }
}
