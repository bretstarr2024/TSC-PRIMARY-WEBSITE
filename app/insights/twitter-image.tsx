import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Insights | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Insights',
    badge: 'insights',
    subtitle: 'Blog, research, tools, and expert perspectives on B2B marketing.',
  });
}
