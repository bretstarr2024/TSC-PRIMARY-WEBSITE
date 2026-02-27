import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedComparisonById, getAllComparisonIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'Comparison | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllComparisonIds();
    return ids.map((comparisonId) => ({ comparisonId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ comparisonId: string }> }) {
  const { comparisonId } = await params;
  try {
    const item = await getPublishedComparisonById(comparisonId);
    return renderOgImage({
      title: item?.title ?? 'Comparison',
      badge: 'comparison',
    });
  } catch {
    return renderOgImage({ title: 'Comparison', badge: 'comparison' });
  }
}
