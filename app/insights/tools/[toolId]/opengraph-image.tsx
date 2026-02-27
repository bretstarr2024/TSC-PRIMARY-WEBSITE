import { renderOgImage } from '@/lib/og/render-og-image';
import { getPublishedToolById, getAllToolIds } from '@/lib/resources-db';

export const runtime = 'nodejs';
export const alt = 'Tool | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export async function generateStaticParams() {
  try {
    const ids = await getAllToolIds();
    return ids.map((toolId) => ({ toolId }));
  } catch {
    return [];
  }
}

export default async function Image({ params }: { params: Promise<{ toolId: string }> }) {
  const { toolId } = await params;
  try {
    const tool = await getPublishedToolById(toolId);
    return renderOgImage({
      title: tool?.title ?? 'Tool',
      badge: 'tool',
    });
  } catch {
    return renderOgImage({ title: 'Tool', badge: 'tool' });
  }
}
