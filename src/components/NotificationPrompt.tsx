'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'pupular-notif-intent';
const TRIGGER_COUNT = 3;

interface Props {
  favoriteCount: number;
}

export default function NotificationPrompt({ favoriteCount }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const intent = localStorage.getItem(STORAGE_KEY);
    if (intent) return; // Already answered
    if (favoriteCount >= TRIGGER_COUNT) {
      // Small delay so it doesn't appear at the same time as confetti
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, [favoriteCount]);

  const dismiss = (answer: 'yes' | 'no') => {
    localStorage.setItem(STORAGE_KEY, answer);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-sm"
        >
          <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                <Bell className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  Want alerts when new pets match your preferences?
                </p>
                <p className="mt-0.5 text-xs text-gray-400">
                  We&apos;ll let you know when pets you&apos;d love are available nearby.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => dismiss('yes')}
                    className="rounded-full bg-purple-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-600"
                  >
                    Yes, notify me!
                  </button>
                  <button
                    type="button"
                    onClick={() => dismiss('no')}
                    className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
                  >
                    Not now
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => dismiss('no')}
                className="text-gray-300 transition hover:text-gray-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
