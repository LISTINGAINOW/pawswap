'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Sparkles } from 'lucide-react';
import { hapticLight, hapticSuccess } from '@/lib/haptics';
import { trackEvent } from '@/lib/analytics';

interface Props {
  totalSwiped: number;
}

const STORAGE_KEY = 'pupular-digest-prompt';

export default function WeeklyDigestPrompt({ totalSwiped }: Props) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const status = localStorage.getItem(STORAGE_KEY);
      // Show once after 10 swipes, only if not dismissed/submitted
      if (!status && totalSwiped >= 10) {
        setTimeout(() => setVisible(true), 800);
      }
    } catch { /* ignore */ }
  }, [totalSwiped]);

  const dismiss = () => {
    hapticLight();
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, 'dismissed'); } catch { /* ignore */ }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    hapticSuccess();
    // Store email locally (ready for backend integration)
    try {
      localStorage.setItem(STORAGE_KEY, 'subscribed');
      localStorage.setItem('pupular-digest-email', email.trim());
    } catch { /* ignore */ }
    trackEvent('digest_signup', { totalSwiped });
    setSubmitted(true);
    setTimeout(() => setVisible(false), 2500);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm"
          role="dialog"
          aria-label="Weekly pet matches signup"
        >
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
            {submitted ? (
              <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                <div className="text-5xl">🐾</div>
                <p className="text-lg font-bold text-gray-900">You&apos;re on the list!</p>
                <p className="text-sm text-gray-500">We&apos;ll send your weekly pet matches every Sunday morning.</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-br from-sage-500 to-sage-600 px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-white/80" aria-hidden="true" />
                      <p className="font-bold text-white">Get weekly pet matches</p>
                    </div>
                    <button
                      type="button"
                      onClick={dismiss}
                      aria-label="Dismiss"
                      className="rounded-full p-1 text-white/70 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-sage-100">
                    Your perfect pet, delivered every Sunday. No spam, ever.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="px-5 py-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-200"
                        aria-label="Email address"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-sage-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600 active:scale-95"
                    >
                      Subscribe
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={dismiss}
                    className="mt-2 w-full text-center text-xs text-gray-400 hover:text-gray-600"
                  >
                    No thanks
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
