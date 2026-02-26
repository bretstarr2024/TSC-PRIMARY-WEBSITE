'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { track } from '@/lib/tracking';

export function TrackingProvider() {
  const pathname = usePathname();

  // Track page views on route change
  useEffect(() => {
    track({
      type: 'page_view',
      page: pathname,
      component: 'page',
      label: document.title,
      destination: pathname,
      ctaId: '',
    });
  }, [pathname]);

  // Global click listener for data-track-cta elements
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('[data-track-cta]');
      if (!target) return;

      const el = target as HTMLElement;
      track({
        type: 'cta_click',
        page: pathname,
        component: el.dataset.trackComponent || 'unknown',
        label: el.dataset.trackLabel || el.textContent?.trim() || '',
        destination: el.dataset.trackDestination || (el as HTMLAnchorElement).href || '',
        ctaId: el.dataset.trackCta || '',
        metadata: el.dataset.trackMeta ? JSON.parse(el.dataset.trackMeta) : undefined,
      });
    }

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [pathname]);

  return null;
}
