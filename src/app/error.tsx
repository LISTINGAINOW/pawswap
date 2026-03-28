'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sage-50 px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-7xl">🐶</div>
        <h1 className="text-2xl font-bold text-gray-900">Oops, something went sideways!</h1>
        <p className="max-w-sm text-gray-500">
          Even the best-trained pups knock things over sometimes. Don't worry — your favorites are safe!
        </p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white transition hover:bg-sage-600"
          >
            🔄 Try Again
          </button>
          <a
            href="/"
            className="rounded-2xl border-2 border-sage-200 px-6 py-3 font-semibold text-sage-600 transition hover:bg-sage-50"
          >
            🏠 Go Home
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 max-w-sm rounded-xl bg-red-50 p-4 text-left text-xs text-red-700">
            <summary className="cursor-pointer font-semibold">Error details</summary>
            <pre className="mt-2 whitespace-pre-wrap break-all">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
