'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Props {
  show: boolean;
  onTakeQuiz: () => void;
  onDismiss: () => void;
}

export default function QuizPrompt({ show, onTakeQuiz, onDismiss }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm"
        >
          <div className="relative rounded-2xl bg-white px-5 py-5 shadow-xl ring-1 ring-black/5">
            {/* Dismiss X */}
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss quiz prompt"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3 pr-6">
              <span className="text-3xl">🧠</span>
              <div>
                <p className="font-bold text-gray-900">Get smarter matches!</p>
                <p className="mt-0.5 text-sm text-gray-500">Take the quick 5-question quiz?</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={onTakeQuiz}
                className="flex-1 rounded-xl bg-sage-500 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600 active:scale-95"
              >
                Take the Quiz
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 active:scale-95"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
