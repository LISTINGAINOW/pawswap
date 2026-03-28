'use client';

import { useState, useEffect } from 'react';
import { Flame, Eye } from 'lucide-react';

interface StreakData {
  currentStreak: number;
  lastActiveDate: string;
  totalPetsViewed: number;
  todayViewed: number;
}

function getStreakData(): StreakData {
  try {
    const stored = localStorage.getItem('pupular-streak');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { currentStreak: 0, lastActiveDate: '', totalPetsViewed: 0, todayViewed: 0 };
}

function saveStreakData(data: StreakData) {
  localStorage.setItem('pupular-streak', JSON.stringify(data));
}

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, lastActiveDate: '', totalPetsViewed: 0, todayViewed: 0 });

  useEffect(() => {
    const data = getStreakData();
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (data.lastActiveDate === today) {
      // Already active today
      setStreak(data);
    } else if (data.lastActiveDate === yesterday) {
      // Continuing streak
      const updated = { ...data, currentStreak: data.currentStreak + 1, lastActiveDate: today, todayViewed: 0 };
      saveStreakData(updated);
      setStreak(updated);
    } else {
      // Streak broken or first time
      const updated = { ...data, currentStreak: 1, lastActiveDate: today, todayViewed: 0 };
      saveStreakData(updated);
      setStreak(updated);
    }
  }, []);

  const recordView = () => {
    setStreak(prev => {
      const updated = {
        ...prev,
        totalPetsViewed: prev.totalPetsViewed + 1,
        todayViewed: prev.todayViewed + 1,
      };
      saveStreakData(updated);
      return updated;
    });
  };

  return { streak, recordView };
}

interface Props {
  streak: StreakData;
}

export default function DailyStreak({ streak }: Props) {
  if (streak.currentStreak <= 0 && streak.todayViewed <= 0) return null;

  return (
    <div className="mx-4 mt-2 flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2">
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-500" />
        <span className="text-xs font-bold text-orange-700">
          {streak.currentStreak} day streak!
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Eye className="h-3.5 w-3.5 text-amber-500" />
        <span className="text-xs text-amber-700">
          {streak.todayViewed} today · {streak.totalPetsViewed} total
        </span>
      </div>
    </div>
  );
}
