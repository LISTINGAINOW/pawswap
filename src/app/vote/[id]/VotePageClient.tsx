'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Pet } from '@/data/pets';
import { safeGetJSON, safeSetJSON } from '@/utils/storage';

interface Props {
  pet: Pet;
}

export default function VotePageClient({ pet }: Props) {
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleVote = (choice: 'yes' | 'no') => {
    setVote(choice);
    const votes = safeGetJSON<Record<string, string>>('pupular-wingman-votes') ?? {};
    votes[pet.id] = choice;
    safeSetJSON('pupular-wingman-votes', votes);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sage-50 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-sage-700">🐾 Pupular</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your friend is thinking about adopting {pet.name}!
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
          <div className="relative h-72 w-full">
            <Image
              src={imgError ? '/placeholder-pet.png' : pet.photos[0] || pet.photo}
              alt={`${pet.name} — ${pet.breed}`}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <h2 className="text-2xl font-bold text-white drop-shadow-lg">{pet.name}</h2>
              <p className="text-sm text-white/80">{pet.breed} · {pet.age}</p>
            </div>
          </div>

          <div className="p-5">
            <div className="flex flex-wrap gap-2 mb-3">
              {pet.traits.slice(0, 3).map(t => (
                <span key={t} className="rounded-full bg-sage-50 px-2.5 py-1 text-xs font-medium text-sage-700">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">{pet.description}</p>
            <p className="mt-2 text-xs text-gray-400">{pet.shelter}</p>

            {!vote ? (
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleVote('no')}
                  className="flex-1 rounded-2xl border-2 border-red-200 py-4 text-lg font-bold text-red-500 transition hover:bg-red-50 active:scale-95"
                >
                  ❌ Hmm…
                </button>
                <button
                  type="button"
                  onClick={() => handleVote('yes')}
                  className="flex-1 rounded-2xl border-2 border-green-200 py-4 text-lg font-bold text-green-600 transition hover:bg-green-50 active:scale-95"
                >
                  ✅ Yes!
                </button>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl bg-sage-50 p-4 text-center">
                <div className="mb-2 text-3xl">{vote === 'yes' ? '🎉' : '🤔'}</div>
                <p className="font-bold text-gray-900">
                  {vote === 'yes'
                    ? `You think ${pet.name} is a great match!`
                    : `Maybe there's a better match out there!`}
                </p>
                <p className="mt-1 text-sm text-gray-500">Your friend will see your vote.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="font-semibold text-gray-900">Find your own perfect pet match 🐾</p>
          <p className="mt-1 text-sm text-gray-400">
            Take our personality quiz to find the perfect companion
          </p>
          <a
            href="https://pupular.app"
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white hover:bg-sage-600"
          >
            Download Pupular
          </a>
        </div>
      </div>
    </div>
  );
}
