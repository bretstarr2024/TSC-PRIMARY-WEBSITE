import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedInfographicById, getAllInfographicIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'Infographic | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllInfographicIds();
    return ids.map((infographicId) => ({ infographicId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ infographicId: string }> }) {
  const { infographicId } = await params;
  try {
    const item = await getPublishedInfographicById(infographicId);
    return renderOgImage({
      title: item?.title ?? 'Infographic',
      badge: 'infographic',
    });
  } catch {
    return renderOgImage({ title: 'Infographic', badge: 'infographic' });
  }
}
