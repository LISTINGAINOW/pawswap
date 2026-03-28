'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, MapPin, Info } from 'lucide-react';
import Image from 'next/image';
import type { Pet } from '@/data/pets';

interface Props {
  pet: Pet;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onInfo: () => void;
  isTop: boolean;
}

export default function SwipeCard({ pet, onSwipeLeft, onSwipeRight, onInfo, isTop }: Props) {
  const [exitX, setExitX] = useState(0);
  const [showOverlay, setShowOverlay] = useState<'like' | 'nope' | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitX(500);
      setShowOverlay('like');
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -threshold) {
      setExitX(-500);
      setShowOverlay('nope');
      setTimeout(onSwipeLeft, 300);
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setExitX(500);
      setShowOverlay('like');
      setTimeout(onSwipeRight, 300);
    } else {
      setExitX(-500);
      setShowOverlay('nope');
      setTimeout(onSwipeLeft, 300);
    }
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-xl">
        {/* Photo */}
        <div className="relative h-[72%] w-full">
          <Image
            src={pet.photo}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={isTop}
          />

          {/* Like overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-green-500/20"
            style={{ opacity: likeOpacity }}
          >
            <div className="rotate-[-20deg] rounded-xl border-4 border-green-500 px-6 py-2">
              <span className="text-4xl font-extrabold text-green-500">LOVE</span>
            </div>
          </motion.div>

          {/* Nope overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-red-500/20"
            style={{ opacity: nopeOpacity }}
          >
            <div className="rotate-[20deg] rounded-xl border-4 border-red-500 px-6 py-2">
              <span className="text-4xl font-extrabold text-red-500">NOPE</span>
            </div>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Distance badge */}
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 backdrop-blur-sm">
            <MapPin className="h-3.5 w-3.5" />
            {pet.distance}
          </div>

          {/* Pet type badge */}
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-sm backdrop-blur-sm">
            {pet.type === 'dog' ? '🐕' : '🐈'} {pet.breed}
          </div>
        </div>

        {/* Info section */}
        <div className="flex h-[28%] flex-col justify-between p-5">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-gray-900">{pet.name}</h2>
              <span className="text-lg text-gray-500">{pet.age}</span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {pet.traits.slice(0, 3).map((trait) => (
                <span
                  key={trait}
                  className="rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-700"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          {isTop && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleButtonSwipe('left')}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-300 bg-white text-red-400 shadow-sm transition-all hover:scale-110 hover:bg-red-50 hover:shadow-md active:scale-95"
              >
                <X className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={onInfo}
                className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-sky-300 bg-white text-sky-400 shadow-sm transition-all hover:scale-110 hover:bg-sky-50 active:scale-95"
              >
                <Info className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => handleButtonSwipe('right')}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-green-300 bg-white text-green-500 shadow-sm transition-all hover:scale-110 hover:bg-green-50 hover:shadow-md active:scale-95"
              >
                <Heart className="h-7 w-7" />
              </button>
            </div>
          )}
        </div>

        {/* Animated overlays for button swipes */}
        {showOverlay === 'like' && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm">
            <div className="animate-heart-pop text-8xl">❤️</div>
          </div>
        )}
        {showOverlay === 'nope' && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 backdrop-blur-sm">
            <div className="animate-heart-pop text-8xl">👋</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
