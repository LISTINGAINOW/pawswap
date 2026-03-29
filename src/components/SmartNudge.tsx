'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { safeGet, safeSet, safeGetJSON, safeSetJSON } from '@/utils/storage';
import { trackEvent } from '@/lib/analytics';

type NudgeId = 'swipe-no-save' | 'save-no-detail' | 'detail-no-contact' | 'return-nudge';

interface Props {
  totalSwiped: number;
  favoritesCount: number;
  detailViewCount: number;
}

export default function SmartNudge({ totalSwiped, favoritesCount, detailViewCount }: Props) {
  const [activeNudge, setActiveNudge] = useState<string | null>(null);
  const sessionNudgeShownRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionNudgeShownRef.current) return;

    const shownNudges = safeGetJSON<string[]>('pupular-shown-nudges') ?? [];
    const lastVisit = safeGet('pupular-last-visit');
    const now = Date.now();

    const show = (id: NudgeId, message: string) => {
      if (sessionNudgeShownRef.current) return;
      sessionNudgeShownRef.current = true;
      setActiveNudge(message);
      const updated = [...shownNudges, id];
      safeSetJSON('pupular-shown-nudges', updated);
      trackEvent('smart_nudge_shown', { nudgeId: id });
      timerRef.current = setTimeout(() => setActiveNudge(null), 5000);
    };

    // Return nudge first (3+ days since last visit)
    if (lastVisit && !shownNudges.includes('return-nudge')) {
      const daysSince = (now - parseInt(lastVisit)) / (1000 * 60 * 60 * 24);
      if (daysSince >= 3) {
        show('return-nudge', '🐾 Your matches miss you! 3 new pets were added nearby');
        safeSet('pupular-last-visit', String(now));
        return;
      }
    }

    if (totalSwiped >= 20 && favoritesCount === 0 && !shownNudges.includes('swipe-no-save')) {
      show('swipe-no-save', '💡 Remember, saving helps you compare pets later!');
    } else if (
      favoritesCount >= 5 &&
      detailViewCount === 0 &&
      !shownNudges.includes('save-no-detail')
    ) {
      show('save-no-detail', '👀 Tap a card to learn more about them');
    } else if (
      detailViewCount >= 3 &&
      safeGet('pupular-inquiry-sent') !== 'true' &&
      !shownNudges.includes('detail-no-contact')
    ) {
      show('detail-no-contact', '📅 Ready to meet one? Schedule a visit!');
    }

    // Update last visit timestamp on every mount
    safeSet('pupular-last-visit', String(now));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount with initial values

  return (
    <AnimatePresence>
      {activeNudge && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-3 rounded-2xl bg-gray-900/90 px-4 py-3 shadow-xl backdrop-blur-md">
            <p className="flex-1 text-sm font-medium text-white">{activeNudge}</p>
            <button
              type="button"
              onClick={() => setActiveNudge(null)}
              aria-label="Dismiss nudge"
              className="shrink-0 rounded-full p-1 text-gray-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
