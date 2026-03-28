'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface Story {
  name: string;
  pet: string;
  petType: 'dog' | 'cat';
  emoji: string;
  quote: string;
  location: string;
  daysToAdopt: number;
}

const stories: Story[] = [
  {
    name: 'Sarah M.',
    pet: 'Max',
    petType: 'dog',
    emoji: '🐕',
    quote: 'Found Max on Pupular and knew instantly he was the one. Three months later and he runs the house.',
    location: 'Los Angeles, CA',
    daysToAdopt: 4,
  },
  {
    name: 'Marcus & Tia',
    pet: 'Whiskers',
    petType: 'cat',
    emoji: '🐈',
    quote: 'We swiped right on Whiskers as a joke... now she sleeps between us every night. Best "joke" ever.',
    location: 'San Diego, CA',
    daysToAdopt: 2,
  },
  {
    name: 'Priya K.',
    pet: 'Biscuit',
    petType: 'dog',
    emoji: '🐶',
    quote: 'The personality quiz said I needed a calm companion. Biscuit is anything BUT calm. He\'s perfect.',
    location: 'Santa Monica, CA',
    daysToAdopt: 7,
  },
  {
    name: 'Jake T.',
    pet: 'Shadow',
    petType: 'cat',
    emoji: '🐱',
    quote: 'Didn\'t think I was a cat person. Shadow changed my mind in about 10 minutes.',
    location: 'Pasadena, CA',
    daysToAdopt: 1,
  },
];

export default function SuccessStories() {
  const [index, setIndex] = useState(0);
  const story = stories[index];

  return (
    <div className="mx-4 mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex items-center gap-2">
        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
        <h3 className="text-sm font-bold text-gray-900">Happy Tails</h3>
        <span className="text-xs text-gray-400">{index + 1}/{stories.length}</span>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-100 text-2xl">
          {story.emoji}
        </div>
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-gray-600 italic">
            &ldquo;{story.quote}&rdquo;
          </p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-xs font-semibold text-gray-800">{story.name}</p>
            <span className="text-xs text-gray-400">adopted {story.pet} in {story.daysToAdopt} days</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIndex((i) => (i - 1 + stories.length) % stories.length)}
          className="rounded-full p-1 text-gray-300 hover:bg-gray-50 hover:text-gray-500"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1">
          {stories.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-4 bg-sage-500' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % stories.length)}
          className="rounded-full p-1 text-gray-300 hover:bg-gray-50 hover:text-gray-500"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
