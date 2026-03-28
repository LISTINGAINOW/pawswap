'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LAST_VISIT_KEY = 'pupular-last-visit';
const MS_PER_HOUR = 1000 * 60 * 60;

interface Props {
  favoriteCount: number;
}

export default function WelcomeBack({ favoriteCount }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

    // Always update last visit timestamp
    localStorage.setItem(LAST_VISIT_KEY, String(now));

    if (!lastVisit) return; // First ever visit — no welcome back

    const hoursSince = (now - Number(lastVisit)) / MS_PER_HOUR;
    if (hoursSince >= 24) {
      const days = Math.floor(hoursSince / 24);
      if (favoriteCount > 0) {
        setMessage(
          `Welcome back! You have ${favoriteCount} saved ${favoriteCount === 1 ? 'pet' : 'pets'} waiting — new arrivals may be available since your last visit!`
        );
      } else {
        setMessage(
          `Welcome back! It's been ${days} ${days === 1 ? 'day' : 'days'} — new pets may be available near you! 🐾`
        );
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="mx-4 mt-2"
        >
          <div className="flex items-start gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 ring-1 ring-amber-100">
            <span className="mt-0.5 text-xl">👋</span>
            <p className="flex-1 text-sm text-amber-800">{message}</p>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="shrink-0 text-amber-400 transition hover:text-amber-600"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
