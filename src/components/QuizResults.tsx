'use client';

import { Sparkles, ArrowRight, RotateCcw, Share2 } from 'lucide-react';
import Image from 'next/image';
import type { Pet } from '@/data/pets';

interface Props {
  matches: Pet[];
  resultType?: string;
  onStartSwiping: () => void;
  onRetakeQuiz: () => void;
  onSelectPet: (pet: Pet) => void;
}

export default function QuizResults({ matches, resultType, onStartSwiping, onRetakeQuiz, onSelectPet }: Props) {
  const handleShareResult = async () => {
    const url = `${window.location.origin}/quiz/result?type=${resultType || 'cuddly-dog'}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🐾 My Pawnder Result!',
          text: 'I just found my perfect pet match! What\'s yours?',
          url,
        });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };
  return (
    <div className="flex min-h-screen flex-col bg-sage-50 px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100">
            <Sparkles className="h-8 w-8 text-sage-500" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Your Top Matches!</h1>
          <p className="mt-2 text-gray-500">Based on your lifestyle, here are your perfect companions</p>
        </div>

        {/* Matches */}
        <div className="space-y-4">
          {matches.map((pet, index) => (
            <button
              key={pet.id}
              type="button"
              onClick={() => onSelectPet(pet)}
              className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md active:scale-[0.98]"
            >
              <div className="relative">
                <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                  <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
                </div>
                <div className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-sage-500 text-xs font-bold text-white shadow">
                  #{index + 1}
                </div>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
                <p className="text-sm text-gray-500">{pet.breed} · {pet.age}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {pet.traits.slice(0, 2).map((trait) => (
                    <span key={trait} className="rounded-full bg-sage-50 px-2 py-0.5 text-xs text-sage-600">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-gray-300" />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={onStartSwiping}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-sage-600"
          >
            Start Swiping 🐾
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleShareResult}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-medium text-sage-600 shadow-sm ring-1 ring-black/5 transition hover:bg-sage-50"
            >
              <Share2 className="h-4 w-4" />
              Share Result
            </button>
            <button
              type="button"
              onClick={onRetakeQuiz}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3 text-sm font-medium text-gray-500 shadow-sm ring-1 ring-black/5 transition hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Retake
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          These are suggestions based on your answers. You can still browse all pets!
        </p>
      </div>
    </div>
  );
}
