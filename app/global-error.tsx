'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: '#141213', color: '#ffffff', fontFamily: 'system-ui, sans-serif', margin: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            <h2 style={{ color: '#FF5910', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              Something went sideways
            </h2>
            <p style={{ color: '#d1d1c6', marginBottom: '2rem' }}>
              Even our AI has bad days. Let&apos;s try that again.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#FF5910',
                  color: '#ffffff',
                  fontWeight: 500,
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 500,
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
