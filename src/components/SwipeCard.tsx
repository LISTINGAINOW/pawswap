'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, MapPin, Info, Share2 } from 'lucide-react';
import { hapticMedium, hapticSuccess } from '@/lib/haptics';
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
  const [photoIndex, setPhotoIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const scale = useTransform(x, [-300, 0, 300], [0.95, 1, 0.95]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      hapticSuccess();
      setExitX(500);
      setShowOverlay('like');
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -threshold) {
      hapticMedium();
      setExitX(-500);
      setShowOverlay('nope');
      setTimeout(onSwipeLeft, 300);
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      hapticSuccess();
      setExitX(500);
      setShowOverlay('like');
      setTimeout(onSwipeRight, 300);
    } else {
      hapticMedium();
      setExitX(-500);
      setShowOverlay('nope');
      setTimeout(onSwipeLeft, 300);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    hapticMedium();
    const shareText = `🐾 Meet ${pet.name}! ${pet.breed}, ${pet.age} — looking for a forever home.\n\nFind adoptable pets on Pupular:`;
    const shareUrl = 'https://www.pupular.app';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: `Meet ${pet.name} on Pupular`, text: shareText, url: shareUrl });
      } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex < pet.photos.length - 1) setPhotoIndex(photoIndex + 1);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (photoIndex > 0) setPhotoIndex(photoIndex - 1);
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, scale, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
        {/* Photo */}
        <div className="relative h-[68%] w-full">
          <Image
            src={pet.photos[photoIndex] || pet.photo}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={isTop}
          />

          {/* Photo navigation dots */}
          {pet.photos.length > 1 && (
            <div className="absolute left-0 right-0 top-3 flex justify-center gap-1.5">
              {pet.photos.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === photoIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Tap zones for photo nav */}
          {pet.photos.length > 1 && isTop && (
            <>
              <button
                type="button"
                onClick={prevPhoto}
                className="absolute bottom-0 left-0 top-0 w-1/3"
                aria-label="Previous photo"
              />
              <button
                type="button"
                onClick={nextPhoto}
                className="absolute bottom-0 right-0 top-0 w-1/3"
                aria-label="Next photo"
              />
            </>
          )}

          {/* Like overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-green-500/20"
            style={{ opacity: likeOpacity }}
          >
            <div className="rotate-[-20deg] rounded-xl border-4 border-green-500 bg-green-500/10 px-6 py-2 backdrop-blur-sm">
              <span className="text-4xl font-extrabold text-green-500">LOVE 💚</span>
            </div>
          </motion.div>

          {/* Nope overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-red-500/20"
            style={{ opacity: nopeOpacity }}
          >
            <div className="rotate-[20deg] rounded-xl border-4 border-red-500 bg-red-500/10 px-6 py-2 backdrop-blur-sm">
              <span className="text-4xl font-extrabold text-red-500">NOPE</span>
            </div>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Distance badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            <MapPin className="h-3 w-3" />
            {pet.distance}
          </div>

          {/* Name + age overlay on photo */}
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">{pet.name}</h2>
              <span className="text-xl text-white/80">{pet.age}</span>
            </div>
            <p className="mt-0.5 text-sm text-white/70">{pet.breed}</p>
          </div>
        </div>

        {/* Info section */}
        <div className="flex h-[32%] flex-col justify-between p-5">
          <div>
            <div className="flex flex-wrap gap-1.5">
              {pet.traits.slice(0, 4).map((trait) => (
                <span
                  key={trait}
                  className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700"
                >
                  {trait}
                </span>
              ))}
              {pet.goodWith.length > 0 && (
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-600">
                  Good with {pet.goodWith[0].toLowerCase()}
                </span>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">{pet.description}</p>
          </div>

          {/* Action buttons */}
          {isTop && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleButtonSwipe('left')}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-200 bg-white text-red-400 shadow-sm transition-all hover:scale-110 hover:border-red-300 hover:bg-red-50 hover:shadow-md active:scale-95"
              >
                <X className="h-7 w-7" strokeWidth={3} />
              </button>
              <button
                type="button"
                onClick={onInfo}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-200 bg-white text-sky-400 shadow-sm transition-all hover:scale-110 hover:bg-sky-50 active:scale-95"
              >
                <Info className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-200 bg-white text-purple-400 shadow-sm transition-all hover:scale-110 hover:bg-purple-50 active:scale-95"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleButtonSwipe('right')}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-green-200 bg-white text-green-500 shadow-sm transition-all hover:scale-110 hover:border-green-300 hover:bg-green-50 hover:shadow-md active:scale-95"
              >
                <Heart className="h-7 w-7" strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>

        {/* Animated overlays for button swipes */}
        {showOverlay === 'like' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-3xl bg-green-500/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="text-8xl"
            >
              ❤️
            </motion.div>
          </motion.div>
        )}
        {showOverlay === 'nope' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-3xl bg-red-500/10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="text-8xl"
            >
              👋
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
