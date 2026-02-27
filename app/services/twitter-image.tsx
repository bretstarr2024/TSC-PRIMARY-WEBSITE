import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Services | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Services',
    badge: 'services',
    subtitle: 'Brand, demand, digital, content, advisory, and AI — the full stack.',
  });
}
