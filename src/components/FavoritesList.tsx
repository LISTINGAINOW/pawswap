'use client';

import { Heart, X, MapPin, Phone, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import type { Pet } from '@/data/pets';

interface Props {
  favorites: Pet[];
  onRemove: (id: string) => void;
  onBack: () => void;
  onSelect: (pet: Pet) => void;
}

export default function FavoritesList({ favorites, onRemove, onBack, onSelect }: Props) {
  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Favorites</h1>
            <p className="text-sm text-gray-500">{favorites.length} {favorites.length === 1 ? 'pet' : 'pets'} saved</p>
          </div>
          <Heart className="ml-auto h-6 w-6 fill-red-500 text-red-500" />
        </div>

        {favorites.length === 0 ? (
          <div className="mt-20 text-center">
            <div className="text-6xl">🐾</div>
            <h2 className="mt-4 text-xl font-semibold text-gray-700">No favorites yet</h2>
            <p className="mt-2 text-gray-500">Swipe right on pets you love and they&apos;ll show up here!</p>
            <button
              type="button"
              onClick={onBack}
              className="mt-6 rounded-2xl bg-sage-500 px-8 py-3 font-semibold text-white hover:bg-sage-600"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((pet) => (
              <div
                key={pet.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex cursor-pointer" onClick={() => onSelect(pet)}>
                  <div className="relative h-32 w-32 shrink-0">
                    <Image
                      src={pet.photo}
                      alt={pet.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
                        <span className="text-sm text-gray-500">{pet.age}</span>
                      </div>
                      <p className="text-sm text-gray-500">{pet.breed}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" />
                        {pet.distance} · {pet.shelter}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${pet.shelterPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs font-medium text-sage-600 hover:text-sage-700"
                      >
                        <Phone className="h-3 w-3" />
                        Call shelter
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(pet.id);
                    }}
                    className="self-start p-3 text-gray-300 hover:text-red-400"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
