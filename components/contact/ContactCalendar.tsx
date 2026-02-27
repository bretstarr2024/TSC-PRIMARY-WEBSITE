'use client';

import { useEffect, useRef, useState } from 'react';

interface ContactCalendarProps {
  service?: string | null;
}

export function ContactCalendar({ service }: ContactCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  // Build Cal.com URL with optional service context in notes (no internal tracking metadata)
  const calBaseUrl = 'https://cal.com/team/tsc/25-50?embed=true&theme=dark&layout=month_view';
  const calUrl = service
    ? `${calBaseUrl}&notes=${encodeURIComponent(`Interested in: ${service}`)}`
    : calBaseUrl;

  // Lazy-load iframe when container is near viewport (200px margin)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Listen for Cal.com embed resize messages — smooth CSS transition handles the animation
  useEffect(() => {
    if (!inView) return;
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
  }, [inView]);

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
      {inView ? (
        <iframe
          src={calUrl}
          className="w-full h-full border-0"
          title="Book a meeting with The Starr Conspiracy"
          allow="payment"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-greige">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-greige/30 border-t-atomic-tangerine rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading calendar...</p>
          </div>
        </div>
      )}
    </div>
  );
}
