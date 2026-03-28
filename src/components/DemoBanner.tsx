'use client';

import { useState } from 'react';
import { X, Info } from 'lucide-react';

interface Props {
  source: 'live' | 'mock';
}

export default function DemoBanner({ source }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (source === 'live' || dismissed) return null;

  return (
    <div className="mx-4 mt-2 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-2.5 text-xs">
      <Info className="h-4 w-4 shrink-0 text-amber-500" />
      <p className="flex-1 text-amber-700">
        <strong>Demo mode</strong> — Showing sample pets. Real shelter data coming soon!
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 text-amber-400 hover:text-amber-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
