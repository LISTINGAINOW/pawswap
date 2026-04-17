'use client';

import { useState, useEffect } from 'react';
import { Share2, X } from 'lucide-react';
import Image from 'next/image';
import { mockPets, Pet } from '@/data/pets';
import { trackEvent } from '@/lib/analytics';
import { trackRevenue } from '@/lib/revenue';
import { getPetShareText, getPetUrl } from '@/lib/pet-links';
import { getOrCreateRefCode } from '@/lib/referrals';

interface Props {
  onSelect: (pet: Pet) => void;
}

export default function PetOfTheDay({ onSelect }: Props) {
  const [pet, setPet] = useState<Pet | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );

    // Prefer featured pets for sponsored Pet of the Day
    const featuredPets = mockPets.filter((p) => p.featured);
    const pool = featuredPets.length > 0 ? featuredPets : mockPets;
    const index = dayOfYear % pool.length;
    const selected = pool[index];
    setPet(selected);

    if (selected.featured) {
      trackRevenue('featured_impression', undefined, { pet_id: selected.id, context: 'pet_of_the_day' });
      trackEvent('sponsored_pet_viewed' as never, { pet_id: selected.id, shelter: selected.shelter });
    }

    const lastDismissed = localStorage.getItem('pupular-potd-dismissed');
    if (lastDismissed === today.toDateString()) {
      setDismissed(true);
    }

    const t = setTimeout(() => setSparkle(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    localStorage.setItem('pupular-potd-dismissed', new Date().toDateString());
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!pet) return;
    const text = getPetShareText(pet, { context: 'pet-of-the-day' });
    const url = getPetUrl(pet.id, getOrCreateRefCode());
    trackEvent('share_pet', { petId: pet.id, petName: pet.name, context: 'pet_of_the_day' });
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: `Pet of the Day: ${pet.name}`, text, url });
      } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  if (!pet || dismissed) return null;

  const isSponsored = pet.featured;

  return (
    <div className={`mx-4 mt-3 transition-all duration-500 ${sparkle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 ring-2 ring-amber-200 shadow-sm">
        {/* Sparkle decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="absolute left-[15%] top-2 animate-bounce text-[10px]" style={{ animationDelay: '0.1s' }}>✨</span>
          <span className="absolute right-[20%] top-3 animate-bounce text-[10px]" style={{ animationDelay: '0.4s' }}>⭐</span>
          <span className="absolute bottom-3 left-[8%] animate-bounce text-[10px]" style={{ animationDelay: '0.7s' }}>✨</span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(pet)}
          className="flex w-full items-center gap-3 p-3 text-left"
        >
          {/* Photo */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-amber-300 shadow-sm">
            <Image src={imgError ? '/placeholder-pet.png' : pet.photo} alt={pet.name} fill className="object-cover" onError={() => setImgError(true)} />
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-amber-600/40 to-transparent pb-0.5">
              <span className="text-[16px]">⭐</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                ⭐ Pet of the Day
              </span>
            </div>
            <p className="mt-0.5 text-sm font-bold text-gray-900">{pet.name}</p>
            <p className="text-xs text-amber-700">{pet.breed} · {pet.age} · {pet.distance}</p>
            {isSponsored && (
              <p className="mt-0.5 text-[10px] text-amber-600/70">
                Sponsored by {pet.shelter}
              </p>
            )}
          </div>
        </button>

        {/* Action buttons */}
        <div className="absolute right-2 top-2 flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share pet of the day"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition hover:bg-amber-200"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss pet of the day"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600 transition hover:bg-amber-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
