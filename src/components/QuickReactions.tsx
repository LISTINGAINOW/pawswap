'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticLight } from '@/lib/haptics';

interface Props {
  petName: string;
  onReaction?: (emoji: string) => void;
}

const REACTIONS: { emoji: string; label: string }[] = [
  { emoji: '😍', label: 'Love it' },
  { emoji: '🥺', label: 'So cute' },
  { emoji: '😂', label: 'Funny' },
  { emoji: '🤩', label: 'Amazing' },
  { emoji: '💀', label: 'Dead from cuteness' },
  { emoji: '🥰', label: 'Adorable' },
];

export default function QuickReactions({ petName, onReaction }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [floatingEmoji, setFloatingEmoji] = useState<{ emoji: string; id: number } | null>(null);

  const handleReaction = (emoji: string) => {
    hapticLight();
    setSelected(emoji);
    setFloatingEmoji({ emoji, id: Date.now() });
    onReaction?.(emoji);
    setTimeout(() => setFloatingEmoji(null), 1000);
    setTimeout(() => setSelected(null), 2000);
  };

  return (
    <div className="relative flex items-center justify-center gap-2 py-1" role="group" aria-label={`React to ${petName}`}>
      {REACTIONS.map(({ emoji, label }) => (
        <button
          key={emoji}
          type="button"
          onClick={() => handleReaction(emoji)}
          aria-label={`${label} — react to ${petName}`}
          className={`rounded-full p-1.5 text-lg transition-all active:scale-125 ${
            selected === emoji ? 'scale-125 bg-sage-100' : 'hover:scale-110'
          }`}
        >
          {emoji}
        </button>
      ))}

      {/* Floating emoji animation */}
      <AnimatePresence>
        {floatingEmoji && (
          <motion.div
            key={floatingEmoji.id}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -80, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="pointer-events-none absolute -top-4 text-3xl"
          >
            {floatingEmoji.emoji}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
