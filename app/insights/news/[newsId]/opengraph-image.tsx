import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedNewsItemById, getAllNewsIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'News | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllNewsIds();
    return ids.map((newsId) => ({ newsId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ newsId: string }> }) {
  const { newsId } = await params;
  try {
    const item = await getPublishedNewsItemById(newsId);
    return renderOgImage({
      title: item?.headline ?? 'News',
      badge: 'news',
    });
  } catch {
    return renderOgImage({ title: 'News', badge: 'news' });
  }
}
