'use client';

import { X, Heart, MapPin, Phone, Mail, Clock, ExternalLink, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import type { Pet } from '@/data/pets';

interface Props {
  pet: Pet;
  onClose: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
}

export default function PetDetail({ pet, onClose, onFavorite, isFavorited }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus first element on open and trap focus inside modal
  useEffect(() => {
    closeBtnRef.current?.focus();
    const focusable = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;

      const elements = Array.from(containerRef.current?.querySelectorAll<HTMLElement>(focusable) ?? []);
      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${pet.name}`}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={containerRef}
        className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl"
      >
        {/* Photo carousel */}
        <div className="relative h-80 w-full sm:h-96">
          <Image
            src={pet.photos[photoIndex] || pet.photo}
            alt={`${pet.name}, photo ${photoIndex + 1} of ${pet.photos.length}`}
            fill
            className="rounded-t-3xl object-cover"
          />
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-md transition hover:bg-black/50"
          >
            <X className="h-5 w-5 text-white" aria-hidden="true" />
          </button>

          {/* Photo nav */}
          {pet.photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous photo"
                onClick={() => setPhotoIndex((i) => (i > 0 ? i - 1 : pet.photos.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 backdrop-blur-md"
              >
                <ChevronLeft className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Next photo"
                onClick={() => setPhotoIndex((i) => (i < pet.photos.length - 1 ? i + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 backdrop-blur-md"
              >
                <ChevronRight className="h-5 w-5 text-white" aria-hidden="true" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
                {pet.photos.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${i === photoIndex ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Type badge */}
          <div className="absolute left-4 top-4 rounded-full bg-black/30 px-3 py-1 text-sm backdrop-blur-md">
            <span className="text-white" aria-label={`Type: ${pet.type}`}>{pet.type === 'dog' ? '🐕' : '🐈'} {pet.breed}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{pet.name}</h2>
              <p className="mt-1 text-lg text-gray-500">{pet.breed} · {pet.age} · {pet.gender} · {pet.size}</p>
            </div>
            {pet.adoptionFee && (
              <span className="flex items-center gap-1 rounded-full bg-sage-100 px-3 py-1.5 text-sm font-semibold text-sage-700">
                <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                <span aria-label={`Adoption fee: ${pet.adoptionFee}`}>{pet.adoptionFee.replace('$', '')}</span>
              </span>
            )}
          </div>

          {/* Description */}
          <p className="mt-4 text-base leading-relaxed text-gray-600">{pet.description}</p>

          {/* Traits */}
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Traits</h3>
            <div className="flex flex-wrap gap-2" role="list">
              {pet.traits.map((trait) => (
                <span
                  key={trait}
                  role="listitem"
                  className="rounded-full bg-sage-50 px-3 py-1 text-sm font-medium text-sage-700"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Good with */}
          {pet.goodWith.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Good with</h3>
              <div className="flex flex-wrap gap-2" role="list">
                {pet.goodWith.map((item) => (
                  <span
                    key={item}
                    role="listitem"
                    className="rounded-full bg-sky-50 px-3 py-1 text-sm font-medium text-sky-600"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Shelter info */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-sage-200 bg-sage-50">
            <div className="border-b border-sage-200 px-4 py-3">
              <h3 className="font-bold text-gray-900">{pet.shelter}</h3>
            </div>
            <address className="not-italic space-y-2.5 px-4 py-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="h-4 w-4 shrink-0 text-sage-500" aria-hidden="true" />
                {pet.shelterAddress}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="h-4 w-4 shrink-0 text-sage-500" aria-hidden="true" />
                <a href={`tel:${pet.shelterPhone}`} className="text-sage-600 hover:underline">{pet.shelterPhone}</a>
              </div>
              {pet.shelterEmail && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="h-4 w-4 shrink-0 text-sage-500" aria-hidden="true" />
                  <a href={`mailto:${pet.shelterEmail}`} className="text-sage-600 hover:underline">{pet.shelterEmail}</a>
                </div>
              )}
              {pet.shelterHours && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="h-4 w-4 shrink-0 text-sage-500" aria-hidden="true" />
                  {pet.shelterHours}
                </div>
              )}
            </address>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-3 pb-2">
            <button
              type="button"
              onClick={onFavorite}
              aria-label={isFavorited ? `Remove ${pet.name} from favorites` : `Save ${pet.name} to favorites`}
              aria-pressed={isFavorited}
              className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-lg font-semibold transition-all ${
                isFavorited
                  ? 'bg-red-50 text-red-500 ring-2 ring-red-200'
                  : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500' : ''}`} aria-hidden="true" />
              {isFavorited ? 'Saved ♥' : 'Save'}
            </button>
            <a
              href={pet.adoptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Apply to adopt ${pet.name} (opens in new tab)`}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white transition-all hover:bg-sage-600"
            >
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
              Apply to Adopt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
