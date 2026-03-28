'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => { setOffline(true); setWasOffline(true); };
    const handleOnline = () => {
      setOffline(false);
      // Show "back online" briefly then hide
      setTimeout(() => setWasOffline(false), 3000);
    };

    if (typeof window !== 'undefined') {
      setOffline(!navigator.onLine);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
    }

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!offline && !wasOffline) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${
        offline
          ? 'bg-amber-100 text-amber-800'
          : 'bg-sage-100 text-sage-700'
      }`}
    >
      {offline ? (
        <>
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>You&apos;re offline — your favorites are still saved! 🐾</span>
        </>
      ) : (
        <>
          <span>✅ Back online!</span>
        </>
      )}
    </div>
  );
}
