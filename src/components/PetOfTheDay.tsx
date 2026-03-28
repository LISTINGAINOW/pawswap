'use client';

import { useState, useEffect } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { mockPets, Pet } from '@/data/pets';

interface Props {
  onSelect: (pet: Pet) => void;
}

export default function PetOfTheDay({ onSelect }: Props) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Pick a "pet of the day" based on the date (deterministic)
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = dayOfYear % mockPets.length;
    setPet(mockPets[index]);

    // Check if already dismissed today
    const lastDismissed = localStorage.getItem('pupular-potd-dismissed');
    if (lastDismissed === today.toDateString()) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pupular-potd-dismissed', new Date().toDateString());
  };

  if (!pet || dismissed) return null;

  return (
    <div className="mx-4 mt-3">
      <button
        type="button"
        onClick={() => onSelect(pet)}
        className="flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-warm-50 to-cinema-50 p-3 ring-1 ring-warm-200 transition hover:shadow-sm"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-warm-500">Pet of the Day</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{pet.name}</p>
          <p className="text-xs text-gray-500">{pet.breed} · {pet.age}</p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-warm-400" />
      </button>
    </div>
  );
}
