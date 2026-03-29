'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, X } from 'lucide-react';
import { hapticSuccess, hapticLight } from '@/lib/haptics';

interface WrappedStats {
  totalSwiped: number;
  totalFavorited: number;
  topBreed: string;
  streakDays: number;
  quizCompleted: boolean;
  dogsLoved: number;
  catsLoved: number;
}

interface Props {
  stats: WrappedStats;
  onClose: () => void;
}

const GRADIENT_PALETTES = [
  'from-purple-600 via-pink-500 to-orange-400',
  'from-blue-600 via-cyan-400 to-teal-400',
  'from-green-500 via-emerald-400 to-teal-500',
  'from-rose-500 via-pink-500 to-purple-600',
];

function getPetPersonality(stats: WrappedStats): { title: string; emoji: string; desc: string } {
  const isDog = stats.dogsLoved >= stats.catsLoved;
  if (stats.totalSwiped >= 200) return { title: 'Super Swiper', emoji: '⚡', desc: 'You\'ve seen more pets than most shelters have in a year.' };
  if (stats.totalFavorited >= 20) return { title: 'Big-Hearted Adopter', emoji: '❤️', desc: 'You fall in love easily — and that\'s a beautiful thing.' };
  if (stats.streakDays >= 7) return { title: 'Dedicated Searcher', emoji: '🔥', desc: 'You show up every day. Your future pet is lucky.' };
  if (isDog) return { title: 'Dog Lover', emoji: '🐕', desc: 'Loyal, enthusiastic, and always up for a walk.' };
  return { title: 'Cat Person', emoji: '🐈', desc: 'Thoughtful, independent, and appreciates a good nap.' };
}

export default function PupularWrapped({ stats, onClose }: Props) {
  const [palette] = useState(() => GRADIENT_PALETTES[Math.floor(Math.random() * GRADIENT_PALETTES.length)]);
  const personality = getPetPersonality(stats);
  const animalType = stats.dogsLoved >= stats.catsLoved ? '🐕 Dog' : '🐈 Cat';

  const handleShare = async () => {
    hapticSuccess();
    const text = [
      '🐾 My Pupular Wrapped',
      `📊 ${stats.totalSwiped.toLocaleString()} pets swiped`,
      `❤️ ${stats.totalFavorited} favorites saved`,
      stats.topBreed !== 'N/A' ? `🏆 Top breed: ${stats.topBreed}` : null,
      `🔥 ${stats.streakDays}-day streak`,
      `${animalType} person`,
      '',
      'Find your perfect pet: https://www.pupular.app',
    ].filter(Boolean).join('\n');

    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: 'My Pupular Wrapped', text, url: 'https://www.pupular.app' }); } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };

  const statCards = [
    { label: 'Pets swiped', value: stats.totalSwiped.toLocaleString(), emoji: '👆' },
    { label: 'Favorites saved', value: stats.totalFavorited.toString(), emoji: '❤️' },
    { label: 'Day streak', value: stats.streakDays.toString(), emoji: '🔥' },
    { label: 'Fave animal', value: animalType, emoji: '' },
  ];

  return (
    <div className="fixed inset-0 z-[55] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-t-3xl sm:rounded-3xl"
        role="dialog"
        aria-label="Pupular Wrapped"
      >
        {/* Main wrapped card */}
        <div className={`bg-gradient-to-br ${palette} px-6 pb-8 pt-6 text-white`}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">Pupular Wrapped</p>
            <button
              type="button"
              onClick={() => { hapticLight(); onClose(); }}
              className="rounded-full bg-white/20 p-1.5 hover:bg-white/30"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Personality type */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-center"
          >
            <div className="text-7xl">{personality.emoji}</div>
            <h2 className="mt-3 text-4xl font-black tracking-tight">{personality.title}</h2>
            <p className="mt-2 text-sm text-white/80">{personality.desc}</p>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-2 gap-3"
          >
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.07 }}
                className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm"
              >
                <p className="text-2xl font-black">{card.value}</p>
                <p className="mt-0.5 text-xs text-white/70">{card.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Top breed */}
          {stats.topBreed && stats.topBreed !== 'N/A' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="mt-3 rounded-2xl bg-white/20 p-4 backdrop-blur-sm"
            >
              <p className="text-xs text-white/70">Your most-saved breed</p>
              <p className="mt-0.5 text-xl font-black">{stats.topBreed}</p>
            </motion.div>
          )}

          {/* Quiz badge */}
          {stats.quizCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-3 flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-3 backdrop-blur-sm"
            >
              <span className="text-2xl">🧠</span>
              <p className="text-sm font-semibold">Quiz Master — found your perfect match type</p>
            </motion.div>
          )}
        </div>

        {/* Share button */}
        <div className="bg-white px-6 py-4">
          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 py-3.5 font-semibold text-white transition hover:bg-gray-800 active:scale-95"
          >
            <Share2 className="h-5 w-5" />
            Share My Wrapped
          </button>
        </div>
      </motion.div>
    </div>
  );
}
