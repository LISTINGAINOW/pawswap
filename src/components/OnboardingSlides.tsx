'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart, ArrowLeftRight, Star } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const slides = [
  {
    emoji: '🐾',
    title: 'Meet your match',
    description: 'Swipe through adorable pets near you looking for forever homes.',
    color: 'bg-sage-100',
    accent: 'bg-sage-500',
  },
  {
    emoji: '👉',
    icon: ArrowLeftRight,
    title: 'Swipe to decide',
    description: 'Swipe right to save a pet you love. Swipe left to keep looking. It\'s that easy.',
    color: 'bg-warm-100',
    accent: 'bg-warm-500',
  },
  {
    emoji: '❤️',
    icon: Heart,
    title: 'Save your favorites',
    description: 'All your saved pets in one place with shelter contact info so you can apply to adopt.',
    color: 'bg-blush-100',
    accent: 'bg-blush-500',
  },
  {
    emoji: '🏠',
    icon: Star,
    title: 'Find them a home',
    description: 'Every swipe brings an animal one step closer to a loving family. Ready?',
    color: 'bg-sky-100',
    accent: 'bg-sky-500',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function OnboardingSlides({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = slides[current];

  const handleNext = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(current - 1);
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-between px-8 py-12 transition-colors duration-500 ${slide.color}`}
    >
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
        {current < slides.length - 1 && (
          <button
            type="button"
            onClick={onComplete}
            className="text-sm font-medium text-gray-400 hover:text-gray-600"
          >
            Skip
          </button>
        )}
      </div>

      {/* Animated slide content */}
      <div className="relative flex w-full flex-col items-center overflow-hidden text-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
        {/* Dots */}
        <div className="flex gap-2" role="tablist" aria-label="Onboarding steps">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === current}
              aria-label={`Step ${i + 1} of ${slides.length}`}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-8 bg-sage-500' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={handleNext}
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white transition hover:bg-sage-600 active:scale-95"
        >
          {current === slides.length - 1 ? "Let's go!" : 'Next'}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
