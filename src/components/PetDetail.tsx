'use client';

import { X, Heart, MapPin, Phone, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import type { Pet } from '@/data/pets';

interface Props {
  pet: Pet;
  onClose: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
}

export default function PetDetail({ pet, onClose, onFavorite, isFavorited }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
        {/* Photo carousel */}
        <div className="relative h-80 w-full">
          <Image
            src={pet.photos[photoIndex] || pet.photo}
            alt={pet.name}
            fill
            className="rounded-t-3xl object-cover sm:rounded-t-3xl"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm"
          >
            <X className="h-5 w-5" />
          </button>
          {pet.photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setPhotoIndex((i) => (i > 0 ? i - 1 : pet.photos.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setPhotoIndex((i) => (i < pet.photos.length - 1 ? i + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {pet.photos.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{pet.name}</h2>
              <p className="mt-1 text-lg text-gray-500">{pet.breed} · {pet.age} · {pet.gender}</p>
            </div>
            <span className="rounded-full bg-sage-100 px-3 py-1 text-sm font-medium text-sage-700">
              {pet.size}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-gray-600">{pet.description}</p>

          {/* Traits */}
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Traits</h3>
            <div className="flex flex-wrap gap-2">
              {pet.traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full bg-sage-50 px-3 py-1 text-sm font-medium text-sage-700"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Good with */}
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-400">Good with</h3>
            <div className="flex flex-wrap gap-2">
              {pet.goodWith.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Shelter info */}
          <div className="mt-6 rounded-2xl bg-warm-50 p-4">
            <h3 className="font-semibold text-gray-900">{pet.shelter}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 shrink-0" />
              {pet.shelterAddress}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 shrink-0" />
              {pet.shelterPhone}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onFavorite}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-lg font-semibold transition-all ${
                isFavorited
                  ? 'bg-red-50 text-red-500'
                  : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500' : ''}`} />
              {isFavorited ? 'Saved' : 'Save'}
            </button>
            <a
              href={pet.adoptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white transition-all hover:bg-sage-600"
            >
              <ExternalLink className="h-5 w-5" />
              Apply to Adopt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
