'use client';

import { useEffect } from 'react';

interface ContentErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  backLabel: string;
  backHref: string;
}

export function ContentError({ error, reset, backLabel, backHref }: ContentErrorProps) {
  useEffect(() => {
    console.error('Content error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="font-arcade text-2xl sm:text-3xl text-atomic-tangerine mb-6">
          Content unavailable
        </h2>
        <p className="text-shroomy mb-8">
          This content couldn&apos;t be loaded right now. Try again, or browse other content.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={reset}
            className="px-6 py-3 bg-atomic-tangerine text-white font-medium rounded-lg hover:bg-hot-sauce transition-colors text-sm"
          >
            Try again
          </button>
          <a
            href={backHref}
            className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:border-white/40 transition-colors text-sm"
          >
            {backLabel}
          </a>
          <a
            href="/"
            className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg hover:border-white/40 transition-colors text-sm"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
