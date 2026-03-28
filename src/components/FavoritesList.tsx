'use client';

import { Heart, X, MapPin, Phone, ArrowLeft, ExternalLink, Navigation } from 'lucide-react';
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
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
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
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md"
              >
                <div className="flex cursor-pointer" onClick={() => onSelect(pet)}>
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

            {/* Contact all shelters CTA */}
            {favorites.length >= 2 && (
              <div className="mt-6 rounded-2xl bg-sage-100 p-5 text-center">
                <p className="text-sm font-medium text-sage-700">
                  💡 Ready to meet them? Call the shelters to schedule visits!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
