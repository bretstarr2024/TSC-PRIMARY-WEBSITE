'use client';

import { useEffect, useRef } from 'react';

interface ContactCalendarProps {
  service?: string | null;
}

export function ContactCalendar({ service }: ContactCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Build Cal.com URL with optional service context in notes (no internal tracking metadata)
  const calBaseUrl = 'https://cal.com/team/tsc/25-50?embed=true&theme=dark&layout=month_view';
  const calUrl = service
    ? `${calBaseUrl}&notes=${encodeURIComponent(`Interested in: ${service}`)}`
    : calBaseUrl;

  // Listen for Cal.com embed resize messages — smooth CSS transition handles the animation
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (containerRef.current) {
        const data = e.data;
        if (data && typeof data === 'object') {
          const height =
            data.iframeHeight ||
            data?.data?.iframeHeight ||
            (data.type === 'CAL:iframe:resize' && data.data?.height);
          if (height && typeof height === 'number' && height > 300) {
            containerRef.current.style.height = `${height}px`;
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden"
      style={{ height: 600, transition: 'height 0.3s ease' }}
      data-track-cta="contact-calendar"
      data-track-component="ContactCalendar"
      data-track-label="Book a call"
      data-track-destination="cal.com"
    >
      <iframe
        src={calUrl}
        className="w-full h-full border-0"
        title="Book a meeting with The Starr Conspiracy"
        allow="payment"
      />
    </div>
  );
}
