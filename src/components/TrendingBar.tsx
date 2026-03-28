'use client';

import { TrendingUp } from 'lucide-react';
import Image from 'next/image';
import type { Pet } from '@/data/pets';
import { mockPets } from '@/data/pets';

interface Props {
  onSelect: (pet: Pet) => void;
}

// Simulated trending — in production this would be real swipe data
const trendingPets = mockPets.slice(0, 5);

export default function TrendingBar({ onSelect }: Props) {
  return (
    <div className="mx-4 mt-3">
      <div className="flex items-center gap-1.5 mb-2">
        <TrendingUp className="h-3.5 w-3.5 text-sage-500" />
        <span className="text-xs font-semibold uppercase tracking-widest text-sage-500">Trending near you</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {trendingPets.map((pet) => (
          <button
            key={pet.id}
            type="button"
            onClick={() => onSelect(pet)}
            className="shrink-0"
          >
            <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-sage-300 ring-offset-2 ring-offset-sage-50 transition hover:ring-sage-500">
              <Image
                src={pet.photo}
                alt={pet.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-1 text-center text-[10px] font-medium text-gray-500">{pet.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
