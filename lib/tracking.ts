'use client';

export interface TrackEvent {
  type: 'cta_click' | 'page_view' | 'arcade_play';
  page: string;
  component: string;
  label: string;
  destination: string;
  ctaId: string;
  metadata?: Record<string, string | number | boolean>;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'tsc-sid';
  let sid = sessionStorage.getItem(KEY);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(KEY, sid);
  }
  return sid;
}

export function track(event: TrackEvent): void {
  if (typeof window === 'undefined') return;

  const payload = {
    ...event,
    sessionId: getSessionId(),
    referrer: document.referrer,
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };

  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track', blob);
  } else {
    fetch('/api/track', {
      method: 'POST',
      body: blob,
      keepalive: true,
    }).catch(() => {
      // Silently fail — tracking should never break the site
    });
  }
}
