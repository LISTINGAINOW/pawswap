'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Share2, X } from 'lucide-react';
import type { Pet } from '@/data/pets';
import Confetti from './Confetti';
import { trackEvent } from '@/lib/analytics';
import { hapticSuccess } from '@/lib/haptics';

interface Props {
  pet: Pet;
  userName?: string;
  onClose: () => void;
}

export default function FoundMyMatch({ pet, userName = 'I', onClose }: Props) {
  const [imgError, setImgError] = useState(false);
  const [shared, setShared] = useState(false);

  const adoptionDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleShare = async () => {
    hapticSuccess();
    trackEvent('found_my_match', { petId: pet.id, petName: pet.name });

    const text = `${userName === 'I' ? 'I' : userName} just adopted ${pet.name} through Pupular! 🐾❤️\n\nFind your own perfect pet match at pupular.app`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${userName} adopted ${pet.name}! 🎉`,
          text,
          url: 'https://pupular.app',
        });
        setShared(true);
        return;
      } catch {
        /* cancelled */
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Confetti trigger={true} onComplete={() => {}} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/30"
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Gradient header */}
        <div className="bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500 px-6 pb-5 pt-8 text-center text-white">
          <p className="mb-2 text-5xl">🎉</p>
          <h1 className="text-2xl font-extrabold">CONGRATULATIONS!</h1>
          <p className="mt-1 text-sm text-pink-100">A new chapter begins 🐾❤️</p>
        </div>

        {/* Pet card */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-rose-200">
              <Image
                src={imgError ? '/placeholder-pet.png' : pet.photos[0] || pet.photo}
                alt={pet.name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{pet.name}</h2>
              <p className="text-sm text-gray-500">
                {pet.breed} · {pet.age}
              </p>
              <p className="mt-1 text-xs text-gray-400">Adopted {adoptionDate}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-center">
            <p className="text-sm font-semibold text-rose-700">
              &ldquo;{userName === 'I' ? 'I' : userName} adopted {pet.name} through Pupular! 🐾❤️&rdquo;
            </p>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            Share your story to help more pets find homes
          </p>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-sm font-semibold text-white hover:opacity-90 active:scale-95"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              {shared ? '✅ Story shared!' : 'Share Your Story'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
