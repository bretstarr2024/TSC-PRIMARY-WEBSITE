import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Blog | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Blog',
    badge: 'blog',
    subtitle: 'Strategic thinking on B2B marketing, growth engines, and AI transformation.',
  });
}
