'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

/** Fires a stories_viewed analytics event once on mount. */
export default function StoriesViewTracker() {
  useEffect(() => {
    trackEvent('stories_viewed');
  }, []);
  return null;
}
