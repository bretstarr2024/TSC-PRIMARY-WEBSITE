'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="font-arcade text-2xl sm:text-3xl text-atomic-tangerine mb-6">
          Something broke
        </h2>
        <p className="text-shroomy mb-8">
          An unexpected error occurred. Try again, or head back to the homepage.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-atomic-tangerine text-white font-medium rounded-lg hover:bg-hot-sauce transition-colors text-sm"
          >
            Try again
          </button>
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
