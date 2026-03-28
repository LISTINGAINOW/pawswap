'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { hapticLight } from '@/lib/haptics';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        hapticLight();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      aria-label="Back to top"
      className="fixed bottom-24 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/10 transition hover:shadow-xl"
    >
      <ChevronUp className="h-5 w-5 text-gray-600" />
    </button>
  );
}
