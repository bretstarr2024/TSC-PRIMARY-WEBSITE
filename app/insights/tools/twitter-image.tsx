import { renderOgImage } from '@/lib/og/render-og-image';

export const runtime = 'nodejs';
export const alt = 'Tools | The Starr Conspiracy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return renderOgImage({
    title: 'Tools',
    badge: 'tool',
    subtitle: 'Interactive assessments and checklists for B2B marketing leaders.',
  });
}
