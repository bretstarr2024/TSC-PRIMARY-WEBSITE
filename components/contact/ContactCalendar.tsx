'use client';

import { useEffect, useRef } from 'react';

interface ContactCalendarProps {
  service?: string | null;
  ctaSource?: string | null;
}

export function ContactCalendar({ service, ctaSource }: ContactCalendarProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build Cal.com URL with optional service + CTA attribution in notes
  const calBaseUrl = 'https://cal.com/team/tsc/25-50?embed=true&theme=dark&layout=month_view';
  const notesParts: string[] = [];
  if (service) notesParts.push(`Interested in: ${service}`);
  notesParts.push(`Source: ${ctaSource || 'contact-calendar'}`);
  const calUrl = `${calBaseUrl}&notes=${encodeURIComponent(notesParts.join(' | '))}`;

  // Listen for Cal.com embed resize messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (iframeRef.current) {
        const data = e.data;
        if (data && typeof data === 'object') {
          const height =
            data.iframeHeight ||
            data?.data?.iframeHeight ||
            (data.type === 'CAL:iframe:resize' && data.data?.height);
          if (height && typeof height === 'number' && height > 300) {
            iframeRef.current.style.height = `${height + 40}px`;
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div
      className="rounded-xl overflow-hidden"
      data-track-cta="contact-calendar"
      data-track-component="ContactCalendar"
      data-track-label="Book a call"
      data-track-destination="cal.com"
    >
      <iframe
        ref={iframeRef}
        src={calUrl}
        className="w-full border-0"
        style={{ height: 700 }}
        title="Book a meeting with The Starr Conspiracy"
        allow="payment"
      />
    </div>
  );
}
