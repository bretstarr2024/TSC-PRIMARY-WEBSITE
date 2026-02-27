import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'The Starr Conspiracy — Game Over for Traditional B2B Marketing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'GAME OVER',
    badge: 'homepage',
    subtitle: 'The SaaS marketing era is over. AI-native marketing is a whole new game.',
  });
}
