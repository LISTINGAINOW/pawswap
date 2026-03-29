'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { Answer } from '@/lib/compatibility';

interface Props {
  answers: Answer[];
  onContinue: () => void;
}

interface PersonalityType {
  emoji: string;
  title: string;
  desc: string;
}

function getPersonalityType(answers: Answer[]): PersonalityType {
  const get = (q: number) => answers.find((a) => a.question === q)?.value ?? '';

  const q1 = get(1);
  const q2 = get(2);
  const q5 = get(5);

  if (q1 === 'chill' && (q5 === 'cuddly' || q5 === 'gentle')) {
    return {
      emoji: '🛋️',
      title: 'The Cozy Homebody',
      desc: 'You love lazy days and cuddle time. Your perfect pet is calm, gentle, and always close by.',
    };
  }

  if (q1 === 'active' || q1 === 'chaos') {
    return {
      emoji: '🏃',
      title: 'The Playful Adventurer',
      desc: "You've got energy to burn! Your perfect pet matches your enthusiasm and loves new adventures.",
    };
  }

  if (q5 === 'independent') {
    return {
      emoji: '😎',
      title: 'The Independent Spirit',
      desc: "You value your space — and so does your perfect pet. You'll make great company for each other.",
    };
  }

  if (q2 === 'family') {
    return {
      emoji: '🤗',
      title: 'The Natural Nurturer',
      desc: 'You have a big heart for everyone. Your perfect pet will thrive with your love and gentle care.',
    };
  }

  return {
    emoji: '🐾',
    title: 'The Animal Lover',
    desc: 'You just love animals — and honestly, any pet would be lucky to call you home.',
  };
}

export default function QuizCelebration({ answers, onContinue }: Props) {
  const type = getPersonalityType(answers);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sage-50 px-6 text-center">
      {/* Animated big emoji */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="text-8xl"
      >
        {type.emoji}
      </motion.div>

      {/* "You're" label */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-6 text-lg text-gray-500"
      >
        You&apos;re
      </motion.p>

      {/* Big bold type title */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="mt-1 text-3xl font-bold text-gray-900"
      >
        {type.title}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-4 max-w-xs text-base leading-relaxed text-gray-600"
      >
        {type.desc}
      </motion.p>

      {/* "See My Matches" button with ChevronRight */}
      <motion.button
        type="button"
        onClick={onContinue}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.4 }}
        className="mt-10 flex items-center gap-2 rounded-2xl bg-sage-500 px-8 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-sage-600 active:scale-95"
      >
        See My Matches
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </div>
  );
}
