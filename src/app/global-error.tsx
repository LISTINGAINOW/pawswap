'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error('Global app error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f6f7f4' }}>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '72px', lineHeight: 1 }}>🐾</div>
          <h1 style={{ marginTop: '24px', fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>
            Something unexpected happened
          </h1>
          <p style={{ marginTop: '12px', color: '#6b7280', maxWidth: '360px', lineHeight: 1.6 }}>
            The pups are working on it! Your favorites are still saved in your browser.
          </p>
          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '12px 24px',
                borderRadius: '16px',
                backgroundColor: '#7a8c63',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
              }}
            >
              🔄 Try Again
            </button>
            <a
              href="/"
              style={{
                padding: '12px 24px',
                borderRadius: '16px',
                border: '2px solid #c8d5b1',
                color: '#7a8c63',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '15px',
              }}
            >
              🏠 Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
