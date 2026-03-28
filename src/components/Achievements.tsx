'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { hapticHeavy } from '@/lib/haptics';

interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalSwiped: number;
  totalFavorited: number;
  dogsLoved: number;
  catsLoved: number;
  streakDays: number;
  quizCompleted: boolean;
  shareCount: number;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-swipe', emoji: '👆', title: 'First Swipe!', description: 'You swiped your first pet', condition: (s) => s.totalSwiped >= 1 },
  { id: 'pet-lover', emoji: '❤️', title: 'Pet Lover', description: 'Saved 5 favorites', condition: (s) => s.totalFavorited >= 5 },
  { id: 'cant-stop', emoji: '🔥', title: "Can't Stop", description: 'Swiped 25 pets', condition: (s) => s.totalSwiped >= 25 },
  { id: 'super-swiper', emoji: '⚡', title: 'Super Swiper', description: 'Swiped 50 pets', condition: (s) => s.totalSwiped >= 50 },
  { id: 'pet-whisperer', emoji: '🐾', title: 'Pet Whisperer', description: 'Swiped 100 pets', condition: (s) => s.totalSwiped >= 100 },
  { id: 'dog-person', emoji: '🐕', title: 'Dog Person', description: 'Loved 5 dogs', condition: (s) => s.dogsLoved >= 5 },
  { id: 'cat-person', emoji: '🐈', title: 'Cat Person', description: 'Loved 5 cats', condition: (s) => s.catsLoved >= 5 },
  { id: 'animal-lover', emoji: '🌟', title: 'Animal Lover', description: 'Loved both dogs AND cats', condition: (s) => s.dogsLoved >= 1 && s.catsLoved >= 1 },
  { id: 'quiz-master', emoji: '🧠', title: 'Quiz Master', description: 'Completed the personality quiz', condition: (s) => s.quizCompleted },
  { id: 'social-butterfly', emoji: '🦋', title: 'Social Butterfly', description: 'Shared a pet with friends', condition: (s) => s.shareCount >= 1 },
  { id: 'streak-3', emoji: '🔥', title: 'On Fire', description: '3-day streak', condition: (s) => s.streakDays >= 3 },
  { id: 'streak-7', emoji: '💎', title: 'Diamond Streak', description: '7-day streak', condition: (s) => s.streakDays >= 7 },
  { id: 'collector', emoji: '🏆', title: 'Collector', description: 'Saved 15 favorites', condition: (s) => s.totalFavorited >= 15 },
  { id: 'save-all', emoji: '😻', title: 'Save Them All', description: 'Loved every single pet', condition: (s) => s.totalFavorited >= 20 },
];

function getUnlockedAchievements(stats: UserStats): string[] {
  return ACHIEVEMENTS.filter(a => a.condition(stats)).map(a => a.id);
}

function getStoredUnlocked(): string[] {
  try {
    const stored = localStorage.getItem('pupular-achievements');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function storeUnlocked(ids: string[]) {
  localStorage.setItem('pupular-achievements', JSON.stringify(ids));
}

export function useAchievements(stats: UserStats) {
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const current = getUnlockedAchievements(stats);
    const stored = getStoredUnlocked();
    const fresh = current.filter(id => !stored.includes(id));

    if (fresh.length > 0) {
      const achievement = ACHIEVEMENTS.find(a => a.id === fresh[0]);
      if (achievement) {
        hapticHeavy();
        setNewAchievement(achievement);
        storeUnlocked([...stored, ...fresh]);
      }
    }
  }, [stats]);

  return {
    newAchievement,
    dismissAchievement: () => setNewAchievement(null),
    allAchievements: ACHIEVEMENTS,
    unlockedIds: getUnlockedAchievements(stats),
  };
}

interface BadgeProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export function AchievementBadge({ achievement, onDismiss }: BadgeProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onDismiss, 4000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onDismiss]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="fixed left-4 right-4 top-4 z-[60] mx-auto max-w-sm"
          onClick={onDismiss}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-4 shadow-xl">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 15 }}
              className="text-4xl"
            >
              {achievement.emoji}
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-extrabold text-white">
                🏆 Achievement Unlocked!
              </p>
              <p className="text-base font-bold text-white/90">{achievement.title}</p>
              <p className="text-xs text-white/70">{achievement.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Trophy case component for viewing all achievements
interface TrophyCaseProps {
  unlockedIds: string[];
  onClose: () => void;
}

export function TrophyCase({ unlockedIds, onClose }: TrophyCaseProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
              {unlockedIds.length}/{ACHIEVEMENTS.length}
            </span>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-gray-100 p-2">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 p-5">
          {ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.includes(a.id);
            return (
              <div
                key={a.id}
                className={`rounded-2xl p-4 text-center transition ${
                  unlocked
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm'
                    : 'bg-gray-50 opacity-40 grayscale'
                }`}
              >
                <div className="text-3xl">{a.emoji}</div>
                <p className="mt-1 text-sm font-bold text-gray-900">{a.title}</p>
                <p className="text-[10px] text-gray-500">{a.description}</p>
                {unlocked && <div className="mt-1 text-[10px] font-bold text-amber-500">✓ Unlocked</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
