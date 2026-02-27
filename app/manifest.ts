import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Starr Conspiracy',
    short_name: 'TSC',
    description: 'B2B marketing agency. Fundamentals + AI.',
    start_url: '/',
    display: 'standalone',
    background_color: '#141213',
    theme_color: '#FF5910',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
