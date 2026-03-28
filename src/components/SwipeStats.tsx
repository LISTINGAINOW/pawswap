'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pet } from '@/data/pets';

interface Props {
  totalSwiped: number;
  favorites: number;
  currentPet: Pet | null;
}

const MILESTONES = [10, 25, 50, 75, 100];
const MILESTONE_MSGS = [
  "You're getting the hang of this!",
  "Quarter century of pets! 🐾",
  "50 pets! You're on a roll!",
  "75! Almost at 💯",
  "💯 pets swiped! Legend status!",
];

export default function SwipeStats({ totalSwiped, favorites, currentPet }: Props) {
  const [showMilestone, setShowMilestone] = useState<string | null>(null);

  useEffect(() => {
    const idx = MILESTONES.indexOf(totalSwiped);
    if (idx !== -1) {
      setShowMilestone(MILESTONE_MSGS[idx]);
      setTimeout(() => setShowMilestone(null), 3000);
    }
  }, [totalSwiped]);

  const loveRate = totalSwiped > 0 ? Math.round((favorites / totalSwiped) * 100) : 0;

  return (
    <>
      {/* Milestone toast */}
      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed left-4 right-4 top-20 z-50 mx-auto max-w-sm"
          >
            <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-center shadow-xl">
              <p className="text-lg font-bold text-white">{totalSwiped} pets swiped! 🎉</p>
              <p className="text-sm text-white/80">{showMilestone}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini stats - love rate */}
      {totalSwiped >= 5 && (
        <div className="mx-4 mt-1 flex items-center justify-center gap-4 text-xs text-gray-400">
          <span>❤️ {loveRate}% love rate</span>
          <span>•</span>
          <span>{totalSwiped} swiped</span>
          {currentPet && (
            <>
              <span>•</span>
              <span>{currentPet.type === 'dog' ? '🐕' : '🐈'} #{totalSwiped + 1}</span>
            </>
          )}
        </div>
      )}
    </>
  );
}
