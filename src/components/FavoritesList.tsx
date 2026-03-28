'use client';

import { useState } from 'react';
import { Heart, X, MapPin, Phone, ArrowLeft, Navigation, Share2, GitCompareArrows } from 'lucide-react';
import { hapticLight } from '@/lib/haptics';
import Image from 'next/image';
import type { Pet } from '@/data/pets';

interface Props {
  favorites: Pet[];
  onRemove: (id: string) => void;
  onBack: () => void;
  onSelect: (pet: Pet) => void;
  onCompare?: (pets: [Pet, Pet]) => void;
}

export default function FavoritesList({ favorites, onRemove, onBack, onSelect, onCompare }: Props) {
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  const toggleCompareSelect = (id: string) => {
    hapticLight();
    setCompareSelection(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const handleCompare = () => {
    if (compareSelection.length === 2 && onCompare) {
      const pets = compareSelection.map(id => favorites.find(p => p.id === id)!);
      onCompare(pets as [Pet, Pet]);
      setCompareMode(false);
      setCompareSelection([]);
    }
  };

  const handleShareAll = async () => {
    hapticLight();
    const text = `🐾 Check out my ${favorites.length} favorite pets on Pupular!\n\n` +
      favorites.map(p => `• ${p.name} — ${p.breed} (${p.age})`).join('\n') +
      '\n\nFind your match: https://www.pupular.app';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: 'My Pupular Favorites', text }); } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };
  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Favorites</h1>
            <p className="text-sm text-gray-500">{favorites.length} {favorites.length === 1 ? 'pet' : 'pets'} saved</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {favorites.length >= 2 && (
              <button
                type="button"
                onClick={() => { setCompareMode(!compareMode); setCompareSelection([]); }}
                className={`flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium transition ${compareMode ? 'bg-sage-500 text-white' : 'bg-sage-100 text-sage-600'}`}
              >
                <GitCompareArrows className="h-3.5 w-3.5" />
                Compare
              </button>
            )}
            {favorites.length > 0 && (
              <button type="button" onClick={handleShareAll} className="rounded-full bg-purple-50 p-2 text-purple-500 hover:bg-purple-100">
                <Share2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="mt-20 text-center">
            <div className="animate-float text-7xl">🐾</div>
            <h2 className="mt-6 text-xl font-semibold text-gray-700">No favorites yet</h2>
            <p className="mt-2 text-gray-500">Swipe right on pets you love and they&apos;ll show up here!</p>
            <button
              type="button"
              onClick={onBack}
              className="mt-8 rounded-2xl bg-sage-500 px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-sage-600 hover:shadow-md"
            >
              Start Swiping 🐾
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((pet) => (
              <div
                key={pet.id}
                className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md ${compareMode && compareSelection.includes(pet.id) ? 'ring-2 ring-sage-500' : ''}`}
              >
                <div className="flex cursor-pointer" onClick={() => compareMode ? toggleCompareSelect(pet.id) : onSelect(pet)}>
                  <div className="relative h-36 w-36 shrink-0">
                    <Image
                      src={pet.photo}
                      alt={pet.name}
                      fill
                      className="object-cover"
                    />
                    {/* Type indicator */}
                    <div className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                      {pet.type === 'dog' ? '🐕' : '🐈'}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
                        <span className="text-sm text-gray-500">{pet.age}</span>
                      </div>
                      <p className="text-sm text-gray-500">{pet.breed} · {pet.size}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {pet.distance} · {pet.shelter}
                      </div>
                      {pet.adoptionFee && (
                        <span className="mt-1.5 inline-block rounded-full bg-sage-50 px-2 py-0.5 text-xs font-medium text-sage-600">
                          Adoption fee: {pet.adoptionFee}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${pet.shelterPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-600 transition hover:bg-sage-100"
                      >
                        <Phone className="h-3 w-3" />
                        Call
                      </a>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(pet.shelterAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600 transition hover:bg-sky-100"
                      >
                        <Navigation className="h-3 w-3" />
                        Directions
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(pet.id);
                    }}
                    className="self-start p-3 text-gray-300 transition hover:text-red-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Compare CTA */}
            {compareMode && compareSelection.length === 2 && (
              <button
                type="button"
                onClick={handleCompare}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 font-semibold text-white shadow-md transition hover:bg-sage-600"
              >
                <GitCompareArrows className="h-5 w-5" />
                Compare These Two
              </button>
            )}
            {compareMode && compareSelection.length < 2 && (
              <p className="text-center text-sm text-sage-500">Select {2 - compareSelection.length} more {compareSelection.length === 0 ? 'pets' : 'pet'} to compare</p>
            )}

            {/* CTAs */}
            {favorites.length >= 1 && !compareMode && (
              <div className="mt-6 space-y-3">
                <a
                  href="/checklist"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-sage-500 px-6 py-4 font-semibold text-white transition hover:bg-sage-600"
                >
                  ✅ Adoption Checklist
                </a>
                <div className="rounded-2xl bg-sage-100 p-5 text-center">
                  <p className="text-sm font-medium text-sage-700">
                    💡 Ready to meet them? Call the shelters to schedule visits!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
