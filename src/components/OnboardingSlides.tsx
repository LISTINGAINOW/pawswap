'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const slides = [
  {
    emoji: '🐾',
    title: 'Meet your match',
    description: 'Discover adorable pets near you who are looking for their forever homes.',
  },
  {
    emoji: '👆',
    title: 'Swipe like you know them',
    description: 'Swipe right to save a pet you love. Swipe left to keep looking. Simple as that.',
  },
  {
    emoji: '❤️',
    title: 'Find your pet',
    description: 'All your saved pets in one place — with shelter info so you can reach out and adopt.',
  },
  {
    emoji: '🏠',
    title: 'Help shelters',
    description: 'Every swipe helps connect animals with loving families. Ready to find your match?',
  },
];

export default function OnboardingSlides({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const progressPct = ((current + 1) / slides.length) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-sage-50 px-8 py-12">
      {/* Top row: back + skip */}
      <div className="flex w-full items-center justify-between">
        {current > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 text-gray-600 transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-10 w-10" />
        )}
        <button
          type="button"
          onClick={onComplete}
          className="text-sm font-medium text-gray-400 hover:text-gray-600"
        >
          Skip to swiping
        </button>
      </div>

      {/* Animated slide content */}
      <div className="relative flex w-full flex-col items-center overflow-hidden text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="text-8xl"
            >
              {slide.emoji}
            </motion.div>
            <h2 className="mt-8 text-3xl font-bold text-gray-900">{slide.title}</h2>
            <p className="mt-4 max-w-xs text-lg leading-relaxed text-gray-600">{slide.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex w-full flex-col items-center gap-6">
        {/* Progress bar */}
        <div className="w-full max-w-xs" aria-label={`Step ${current + 1} of ${slides.length}`}>
          <div className="mb-1.5 flex justify-end">
            <span className="text-xs font-medium text-gray-400">{current + 1}/{slides.length}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <motion.div
              className="h-full rounded-full bg-sage-500"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleNext}
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white transition hover:bg-sage-600 active:scale-95"
        >
          {current === slides.length - 1 ? "Let's find my pet!" : 'Next'}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
