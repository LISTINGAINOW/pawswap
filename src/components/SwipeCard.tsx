'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Heart, X, MapPin, Info, Share2, Sparkles } from 'lucide-react';
import { hapticMedium, hapticSuccess } from '@/lib/haptics';
import Image from 'next/image';
import type { Pet } from '@/data/pets';
import type { Answer } from '@/lib/compatibility';
import { getCompatibilityPct } from '@/lib/compatibility';

interface Props {
  pet: Pet;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onInfo: () => void;
  onTakeQuiz?: () => void;
  isTop: boolean;
  quizAnswers?: Answer[];
  quizDone?: boolean;
  isFirstCard?: boolean;
}

export default function SwipeCard({ pet, onSwipeLeft, onSwipeRight, onInfo, onTakeQuiz, isTop, quizAnswers = [], quizDone = false, isFirstCard = false }: Props) {
  const compatPct = quizDone && quizAnswers.length > 0 ? getCompatibilityPct(pet, quizAnswers) : null;
  const [showHints, setShowHints] = useState(true);
  const [exitX, setExitX] = useState(0);
  const [showOverlay, setShowOverlay] = useState<'like' | 'nope' | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
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
    const typeEmoji = pet.type === 'dog' ? '🐕' : '🐈';
    const shareText = `Meet ${pet.name} ${typeEmoji} — ${pet.age} ${pet.breed} looking for a forever home! Check them out on Pupular 🐾`;
    const shareUrl = 'https://www.pupular.app';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Meet ${pet.name} on Pupular`,
          text: shareText,
          url: shareUrl,
        });
      } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
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
      style={{ x, rotate, scale, zIndex: isTop ? 10 : 0, willChange: 'transform' }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }}
      role={isTop ? 'article' : undefined}
      aria-label={isTop ? `${pet.name}, ${pet.breed}, ${pet.age}, ${pet.gender}` : undefined}
      aria-roledescription={isTop ? 'swipe card' : undefined}
    >
      <motion.div
        className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5"
        initial={isFirstCard ? { y: 24, opacity: 0 } : false}
        animate={isFirstCard ? { y: 0, opacity: 1 } : undefined}
        transition={isFirstCard ? { type: 'spring', stiffness: 400, damping: 15, delay: 0.2 } : undefined}
      >
        {/* Photo */}
        <div className="relative min-h-0 flex-1 w-full">
          <Image
            src={imgError ? '/placeholder-pet.png' : (pet.photos[photoIndex] || pet.photo)}
            alt={`${pet.name} — ${pet.breed}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
            priority={isTop}
            loading={isTop ? 'eager' : 'lazy'}
            onError={() => setImgError(true)}
          />

          {/* Photo navigation dots */}
          {pet.photos.length > 1 && (
            <div className="absolute left-0 right-0 top-3 flex justify-center gap-1.5" aria-hidden="true">
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
                aria-label={`Previous photo of ${pet.name}`}
                disabled={photoIndex === 0}
              />
              <button
                type="button"
                onClick={nextPhoto}
                className="absolute bottom-0 right-0 top-0 w-1/3"
                aria-label={`Next photo of ${pet.name}`}
                disabled={photoIndex === pet.photos.length - 1}
              />
            </>
          )}

          {/* Like overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-green-500/20"
            style={{ opacity: likeOpacity }}
            aria-hidden="true"
          >
            <div className="rotate-[-20deg] rounded-xl border-4 border-green-500 bg-green-500/10 px-6 py-2 backdrop-blur-sm">
              <span className="text-4xl font-extrabold text-green-500">LOVE 💚</span>
            </div>
          </motion.div>

          {/* Nope overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-red-500/20"
            style={{ opacity: nopeOpacity }}
            aria-hidden="true"
          >
            <div className="rotate-[20deg] rounded-xl border-4 border-red-500 bg-red-500/10 px-6 py-2 backdrop-blur-sm">
              <span className="text-4xl font-extrabold text-red-500">NOPE</span>
            </div>
          </motion.div>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent" aria-hidden="true" />

          {/* Distance badge */}
          <div
            className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md"
            aria-label={`${pet.distance} away`}
          >
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {pet.distance}
          </div>

          {/* Compatibility badge */}
          {isTop && (
            compatPct !== null ? (
              <div
                className={`absolute left-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-md ${
                  compatPct >= 80
                    ? 'bg-green-500/90 text-white'
                    : compatPct >= 50
                    ? 'bg-yellow-400/90 text-gray-900'
                    : 'bg-red-400/90 text-white'
                }`}
                aria-label={`${compatPct}% compatibility match`}
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                {compatPct}% Match
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onTakeQuiz?.(); }}
                className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-sage-700 backdrop-blur-md hover:bg-white/95"
              >
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Match %
              </button>
            )
          )}

          {/* Name + age overlay on photo */}
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">{pet.name}</h2>
              <span className="text-xl text-white/80" aria-label={`Age: ${pet.age}`}>{pet.age}</span>
            </div>
            <p className="mt-0.5 text-sm text-white/70">{pet.breed}</p>
          </div>
        </div>

        {/* Info section — fixed height so buttons always fit regardless of card height */}
        <div className="flex h-[165px] flex-none flex-col justify-between p-4">
          <div>
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Traits">
              {pet.traits.slice(0, 4).map((trait) => (
                <span
                  key={trait}
                  role="listitem"
                  className="rounded-full bg-sage-100 px-2.5 py-1 text-xs font-medium text-sage-700"
                >
                  {trait}
                </span>
              ))}
              {pet.goodWith.length > 0 && (
                <span role="listitem" className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-600">
                  Good with {pet.goodWith[0].toLowerCase()}
                </span>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500">{pet.description}</p>
          </div>

          {/* Action buttons */}
          {isTop && (
            <div className="flex items-center justify-center gap-3" role="group" aria-label={`Actions for ${pet.name}`}>
              <button
                type="button"
                onClick={() => handleButtonSwipe('left')}
                aria-label={`Pass on ${pet.name}`}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-200 bg-white text-red-400 shadow-sm transition-all hover:scale-110 hover:border-red-300 hover:bg-red-50 hover:shadow-md active:scale-95"
              >
                <X className="h-7 w-7" strokeWidth={3} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onInfo}
                aria-label={`More info about ${pet.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-200 bg-white text-sky-400 shadow-sm transition-all hover:scale-110 hover:bg-sky-50 active:scale-95"
              >
                <Info className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label={`Share ${pet.name}`}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-200 bg-white text-purple-400 shadow-sm transition-all hover:scale-110 hover:bg-purple-50 active:scale-95"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => handleButtonSwipe('right')}
                aria-label={`Save ${pet.name} to favorites`}
                className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-green-200 bg-white text-green-500 shadow-sm transition-all hover:scale-110 hover:border-green-300 hover:bg-green-50 hover:shadow-md active:scale-95"
              >
                <Heart className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Swipe hint arrows — only for first card, auto-fade after 3 loops */}
          {isFirstCard && isTop && (
            <AnimatePresence>
              {showHints && (
                <motion.div
                  className="flex items-center justify-center gap-8 pb-1 pt-0.5"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: 3, duration: 1.2 }}
                  onAnimationComplete={() => setShowHints(false)}
                  aria-hidden="true"
                >
                  <span className="text-xs font-medium text-gray-400">← Skip</span>
                  <span className="text-xs font-medium text-gray-400">Save →</span>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Animated overlays for button swipes */}
        {showOverlay === 'like' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center rounded-3xl bg-green-500/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-hidden="true"
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
            aria-hidden="true"
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
      </motion.div>
    </motion.div>
  );
}
