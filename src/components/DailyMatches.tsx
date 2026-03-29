'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type { Pet } from '@/data/pets';
import type { Answer } from '@/lib/compatibility';
import { getCompatibilityPct } from '@/lib/compatibility';
import { safeGetJSON, safeSetJSON } from '@/utils/storage';
import { trackEvent } from '@/lib/analytics';

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function seededIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % max;
}

function pickDailyMatches(pets: Pet[], quizAnswers: Answer[], quizDone: boolean): Pet[] {
  if (pets.length === 0) return [];
  const dateKey = todayKey();

  if (quizDone && quizAnswers.length > 0) {
    const sorted = [...pets].sort(
      (a, b) => getCompatibilityPct(b, quizAnswers) - getCompatibilityPct(a, quizAnswers)
    );
    return sorted.slice(0, Math.min(3, sorted.length));
  }

  const picks: Pet[] = [];
  const used = new Set<number>();
  let attempt = 0;
  while (picks.length < 3 && picks.length < pets.length && attempt < 200) {
    const idx = seededIndex(dateKey + String(attempt), pets.length);
    if (!used.has(idx)) {
      used.add(idx);
      picks.push(pets[idx]);
    }
    attempt++;
  }
  return picks;
}

interface Props {
  pets: Pet[];
  quizAnswers: Answer[];
  quizDone: boolean;
  onSelectPet: (pet: Pet) => void;
  onClose: () => void;
  onTakeQuiz?: () => void;
}

export default function DailyMatches({ pets, quizAnswers, quizDone, onSelectPet, onClose, onTakeQuiz }: Props) {
  const [viewed, setViewed] = useState<string[]>([]);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const dateKey = todayKey();
  const storageKey = `pupular-daily-matches-${dateKey}`;

  useEffect(() => {
    const saved = safeGetJSON<string[]>(storageKey);
    if (saved) setViewed(saved);
  }, [storageKey]);

  const dailyPets = pickDailyMatches(pets, quizAnswers, quizDone);
  const allViewed = dailyPets.length > 0 && dailyPets.every(p => viewed.includes(p.id));

  const handleView = (pet: Pet) => {
    if (!viewed.includes(pet.id)) {
      const updated = [...viewed, pet.id];
      setViewed(updated);
      safeSetJSON(storageKey, updated);
      trackEvent('daily_matches_viewed', { petId: pet.id, petName: pet.name });
    }
    onSelectPet(pet);
  };

  if (dailyPets.length === 0) return null;

  return (
    <div className="px-4 py-2">
      <div className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <h2 className="font-bold text-gray-900">Your Daily Matches 🎯</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:text-gray-600"
            aria-label="Close daily matches"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {allViewed ? (
          <div className="py-4 text-center">
            <div className="mb-2 text-3xl">⏰</div>
            <p className="font-semibold text-gray-700">Come back tomorrow for new matches!</p>
            <p className="mt-1 text-sm text-gray-400">Your next set arrives at midnight</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {dailyPets.map((pet, i) => {
              const compat =
                quizDone && quizAnswers.length > 0
                  ? getCompatibilityPct(pet, quizAnswers)
                  : null;
              const isViewed = viewed.includes(pet.id);
              return (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => handleView(pet)}
                  aria-label={`View ${pet.name}, daily match #${i + 1}`}
                  className={`w-28 flex-none overflow-hidden rounded-xl border-2 transition-all ${
                    isViewed
                      ? 'border-gray-200 opacity-60'
                      : 'border-amber-300 hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  <div className="relative h-32 w-full">
                    <Image
                      src={imgErrors[pet.id] ? '/placeholder-pet.png' : pet.photos[0] || pet.photo}
                      alt={pet.name}
                      fill
                      className="object-cover"
                      onError={() => setImgErrors(prev => ({ ...prev, [pet.id]: true }))}
                    />
                    {!isViewed && (
                      <div className="absolute left-1 top-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        #{i + 1}
                      </div>
                    )}
                    {compat !== null && (
                      <div className="absolute bottom-1 left-1 right-1 rounded-full bg-green-500/90 py-0.5 text-center text-[10px] font-bold text-white">
                        {compat}% Match
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-1.5">
                    <p className="truncate text-xs font-semibold text-gray-800">{pet.name}</p>
                    <p className="truncate text-[10px] text-gray-400">{pet.breed}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <p className="mt-2 text-center text-[10px] font-medium text-amber-600">
          {quizDone
            ? '✨ Picked for you based on your quiz'
            : (
              <button
                type="button"
                onClick={onTakeQuiz}
                className="underline underline-offset-2 hover:text-amber-700"
              >
                ✨ Take the quiz for personalized matches
              </button>
            )}
        </p>
      </div>
    </div>
  );
}
