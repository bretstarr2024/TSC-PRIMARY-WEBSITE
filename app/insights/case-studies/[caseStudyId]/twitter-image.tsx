import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedCaseStudyById, getAllCaseStudyIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'Case Study | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllCaseStudyIds();
    return ids.map((caseStudyId) => ({ caseStudyId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ caseStudyId: string }> }) {
  const { caseStudyId } = await params;
  try {
    const cs = await getPublishedCaseStudyById(caseStudyId);
    return renderOgImage({
      title: cs?.title ?? 'Case Study',
      badge: 'case-study',
      subtitle: cs?.client ? `Client: ${cs.client}` : undefined,
    });
  } catch {
    return renderOgImage({ title: 'Case Study', badge: 'case-study' });
  }
}
