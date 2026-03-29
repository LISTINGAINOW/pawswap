'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Pet } from '@/data/pets';

interface Props {
  pet: Pet | null;
  onDismiss: () => void;
}

const funMessages = [
  '{name} just wagged their tail so hard they fell over.',
  '{name} is doing zoomies in their kennel right now.',
  'You and {name} are going to be best friends.',
  '{name} already picked out a spot on your couch.',
  'Fun fact: {name} has been rehearsing their "welcome home" face.',
  '{name} just told the other animals, "I\'m going HOME."',
  'Someone at {shelter} is about to be very happy for {name}.',
  '{name} says: "Finally, someone with taste."',
];

function getRandomMessage(pet: Pet): string {
  const msg = funMessages[Math.floor(Math.random() * funMessages.length)];
  return msg.replace(/\{name\}/g, pet.name).replace(/\{shelter\}/g, pet.shelter);
}

export default function MatchToast({ pet, onDismiss }: Props) {
  useEffect(() => {
    if (pet) {
      const timer = setTimeout(onDismiss, 3500);
      return () => clearTimeout(timer);
    }
  }, [pet, onDismiss]);

  return (
    <AnimatePresence>
      {pet && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-sm"
        >
          <div
            role="alert"
            aria-live="polite"
            className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-black/5"
            onClick={onDismiss}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100">
              <span className="text-2xl">{pet.type === 'dog' ? '🐕' : '🐈'}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">
                {pet.name} saved! ❤️
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                {getRandomMessage(pet)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
