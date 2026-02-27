import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedIndustryBriefById, getAllIndustryBriefIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'Industry Brief | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllIndustryBriefIds();
    return ids.map((briefId) => ({ briefId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ briefId: string }> }) {
  const { briefId } = await params;
  try {
    const brief = await getPublishedIndustryBriefById(briefId);
    return renderOgImage({
      title: brief?.title ?? 'Industry Brief',
      badge: 'industry-brief',
    });
  } catch {
    return renderOgImage({ title: 'Industry Brief', badge: 'industry-brief' });
  }
}
