import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedExpertQaById, getAllExpertQaIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'Expert Q&A | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllExpertQaIds();
    return ids.map((qaId) => ({ qaId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ qaId: string }> }) {
  const { qaId } = await params;
  try {
    const qa = await getPublishedExpertQaById(qaId);
    return renderOgImage({
      title: qa?.question ?? 'Expert Q&A',
      badge: 'expert-qa',
      subtitle: qa?.expert ? `With ${qa.expert}` : undefined,
    });
  } catch {
    return renderOgImage({ title: 'Expert Q&A', badge: 'expert-qa' });
  }
}
