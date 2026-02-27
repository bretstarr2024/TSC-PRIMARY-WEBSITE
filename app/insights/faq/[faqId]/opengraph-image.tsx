import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedFaqById, getAllFaqIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'FAQ | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllFaqIds();
    return ids.map((faqId) => ({ faqId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ faqId: string }> }) {
  const { faqId } = await params;
  try {
    const faq = await getPublishedFaqById(faqId);
    return renderOgImage({
      title: faq?.question ?? 'FAQ',
      badge: 'faq',
    });
  } catch {
    return renderOgImage({ title: 'FAQ', badge: 'faq' });
  }
}
