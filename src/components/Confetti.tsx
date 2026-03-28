'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#10b981'];
const EMOJIS = ['🐾', '❤️', '🎉', '✨', '💚', '🐕', '🐈'];

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
  emoji: string;
  delay: number;
}

export default function Confetti({ trigger, onComplete }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: -(Math.random() * 600 + 200),
        rotation: Math.random() * 720 - 360,
        scale: Math.random() * 0.5 + 0.5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        emoji: Math.random() > 0.6 ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : '',
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: '50vw',
                y: '50vh',
                scale: 0,
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                x: `calc(50vw + ${p.x}px)`,
                y: `calc(50vh + ${p.y}px)`,
                scale: p.scale,
                rotate: p.rotation,
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                delay: p.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute"
            >
              {p.emoji ? (
                <span className="text-2xl">{p.emoji}</span>
              ) : (
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
