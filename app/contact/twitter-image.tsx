import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Contact The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'CONTINUE?',
    badge: 'contact',
    subtitle: "You've seen what we do. Now let's talk about what you need.",
  });
}
