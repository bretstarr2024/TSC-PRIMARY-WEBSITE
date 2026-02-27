import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedGlossaryTermById, getAllGlossaryTermIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'Glossary | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllGlossaryTermIds();
    return ids.map((termId) => ({ termId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ termId: string }> }) {
  const { termId } = await params;
  try {
    const term = await getPublishedGlossaryTermById(termId);
    return renderOgImage({
      title: term?.term ?? 'Glossary',
      badge: 'glossary',
    });
  } catch {
    return renderOgImage({ title: 'Glossary', badge: 'glossary' });
  }
}
