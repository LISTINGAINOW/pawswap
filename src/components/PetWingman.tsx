'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { hapticMedium } from '@/lib/haptics';
import { trackEvent } from '@/lib/analytics';
import type { Pet } from '@/data/pets';
import { safeSet } from '@/utils/storage';

interface Props {
  pet: Pet;
  variant?: 'card' | 'detail';
}

export default function PetWingman({ pet, variant = 'detail' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticMedium();

    const url = `https://pupular.app/vote/${pet.id}`;
    const text = `I'm thinking about adopting ${pet.name} — a ${pet.age} ${pet.breed}! 🐾 What do you think?`;

    safeSet('pupular-wingman-used', 'true');
    trackEvent('wingman_shared', { petId: pet.id, petName: pet.name });

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: `Should I adopt ${pet.name}?`, text, url });
        return;
      } catch {
        /* cancelled */
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Ask a friend about ${pet.name}`}
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-200 bg-white text-blue-400 shadow-sm transition-all hover:scale-110 hover:bg-blue-50 active:scale-95"
      >
        <Users className="h-4 w-4" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-blue-200 py-3 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-50"
    >
      <Users className="h-4 w-4" aria-hidden="true" />
      {copied ? '✅ Link copied!' : 'Ask a Friend 🤔'}
    </button>
  );
}
