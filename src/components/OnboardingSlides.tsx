'use client';

import { useState } from 'react';
import { ChevronRight, Heart, ArrowLeftRight, Star } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const slides = [
  {
    emoji: '🐾',
    title: 'Meet your match',
    description: 'Swipe through adorable pets near you looking for forever homes.',
    color: 'bg-sage-100',
  },
  {
    emoji: '👉',
    icon: ArrowLeftRight,
    title: 'Swipe to decide',
    description: 'Swipe right to save a pet you love. Swipe left to keep looking. It\'s that easy.',
    color: 'bg-warm-100',
  },
  {
    emoji: '❤️',
    icon: Heart,
    title: 'Save your favorites',
    description: 'All your saved pets in one place with shelter contact info so you can apply to adopt.',
    color: 'bg-blush-100',
  },
  {
    emoji: '🏠',
    icon: Star,
    title: 'Find them a home',
    description: 'Every swipe brings an animal one step closer to a loving family. Ready?',
    color: 'bg-sky-100',
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

  return (
    <div className={`flex min-h-screen flex-col items-center justify-between px-8 py-12 transition-colors duration-500 ${slide.color}`}>
      {/* Skip */}
      <div className="flex w-full justify-end">
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

      {/* Content */}
      <div className="flex flex-col items-center text-center">
        <div className="text-8xl">{slide.emoji}</div>
        <h2 className="mt-8 text-3xl font-bold text-gray-900">{slide.title}</h2>
        <p className="mt-4 max-w-xs text-lg leading-relaxed text-gray-600">{slide.description}</p>
      </div>

      {/* Navigation */}
      <div className="flex w-full flex-col items-center gap-6">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
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
          className="flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white transition hover:bg-sage-600"
        >
          {current === slides.length - 1 ? "Let's go!" : 'Next'}
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
