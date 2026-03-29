'use client';

import { useState, useEffect } from 'react';
import { X, MapPin, Phone, ArrowLeft, Navigation, Share2, GitCompareArrows, BookOpen, ArrowUpDown, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hapticLight, hapticSuccess } from '@/lib/haptics';
import Image from 'next/image';
import type { Pet } from '@/data/pets';
import type { Answer } from '@/lib/compatibility';
import { getCompatibilityPct } from '@/lib/compatibility';
import { trackEvent } from '@/lib/analytics';
import ShelterMap from './ShelterMap';
import YourType from './YourType';
import SupplyChecklist from './SupplyChecklist';
import FeaturedBadge from './FeaturedBadge';

/** Generate or retrieve a persistent referral code for this user. */
function getOrCreateRefCode(): string {
  try {
    const existing = localStorage.getItem('pupular-ref-code');
    if (existing) return existing;
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 7; i++) code += chars[Math.floor(Math.random() * chars.length)];
    localStorage.setItem('pupular-ref-code', code);
    return code;
  } catch {
    return 'pupular';
  }
}

type SortOption = 'date' | 'compatibility' | 'distance' | 'name';

const SORT_LABELS: Record<SortOption, string> = {
  date: 'Date Added',
  compatibility: 'Best Match',
  distance: 'Distance',
  name: 'Name A–Z',
};

interface Props {
  favorites: Pet[];
  onRemove: (id: string) => void;
  onBack: () => void;
  onSelect: (pet: Pet) => void;
  onCompare?: (pets: [Pet, Pet]) => void;
  quizAnswers?: Answer[];
  quizDone?: boolean;
  totalFavorited?: number;
  storiesViewed?: boolean;
}

export default function FavoritesList({ favorites, onRemove, onBack, onSelect, onCompare, quizAnswers = [], quizDone = false, totalFavorited = 0, storiesViewed = false }: Props) {
  const [compareMode, setCompareMode] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'pets' | 'shelters'>('pets');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [wingmanVotes, setWingmanVotes] = useState<Record<string, string>>({});
  const [openSupplies, setOpenSupplies] = useState<string | null>(null);

  // Load wingman votes from localStorage
  useEffect(() => {
    try {
      const votes = localStorage.getItem('pupular-wingman-votes');
      if (votes) setWingmanVotes(JSON.parse(votes));
    } catch { /* ignore */ }
  }, []);

  // Persist sort preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pupular-favorites-sort');
      if (saved && SORT_LABELS[saved as SortOption]) setSortBy(saved as SortOption);
    } catch { /* ignore */ }
  }, []);

  const handleSortChange = (option: SortOption) => {
    hapticLight();
    setSortBy(option);
    setShowSortMenu(false);
    try { localStorage.setItem('pupular-favorites-sort', option); } catch { /* ignore */ }
  };

  const parseDistance = (dist: string) => parseFloat(dist.replace(/[^\d.]/g, '')) || 999;

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'compatibility':
        if (!quizDone || quizAnswers.length === 0) return 0;
        return getCompatibilityPct(b, quizAnswers) - getCompatibilityPct(a, quizAnswers);
      case 'distance':
        return parseDistance(a.distance) - parseDistance(b.distance);
      case 'name':
        return a.name.localeCompare(b.name);
      default: // 'date' — preserve insertion order
        return 0;
    }
  });

  const toggleCompareSelect = (id: string) => {
    hapticLight();
    setCompareSelection(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const handleCompare = () => {
    if (compareSelection.length === 2 && onCompare) {
      const pets = compareSelection.map(id => favorites.find(p => p.id === id)!);
      onCompare(pets as [Pet, Pet]);
      setCompareMode(false);
      setCompareSelection([]);
    }
  };

  const handleShareAll = async () => {
    hapticLight();
    trackEvent('share_favorites', { count: favorites.length });
    const petList = favorites
      .map(p => `• ${p.name} ${p.type === 'dog' ? '🐕' : '🐈'} — ${p.age} ${p.breed} @ ${p.shelter}`)
      .join('\n');
    const text = `🐾 I found ${favorites.length} amazing pets on Pupular looking for homes!\n\n${petList}\n\nFind your match: https://www.pupular.app`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: 'My Pupular Favorites', text, url: 'https://www.pupular.app' }); } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleInvite = async () => {
    hapticSuccess();
    const refCode = getOrCreateRefCode();
    const text = `I have saved ${favorites.length} ${favorites.length === 1 ? 'pet' : 'pets'} on Pupular. Help them find homes. Join me: pupular.app/?ref=${refCode}`;
    trackEvent('referral_sent', { refCode, favoriteCount: favorites.length });
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: 'Join me on Pupular 🐾', text, url: `https://www.pupular.app/?ref=${refCode}` }); } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };

  const handleSharePet = async (pet: Pet) => {
    hapticLight();
    const typeEmoji = pet.type === 'dog' ? '🐕' : '🐈';
    const text = `Meet ${pet.name} ${typeEmoji} — ${pet.age} ${pet.breed} looking for a forever home! Check them out on Pupular 🐾`;
    const url = pet.adoptionUrl || 'https://www.pupular.app';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: `Meet ${pet.name} on Pupular`, text, url }); } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Favorites</h1>
            <p className="text-sm text-gray-500">{favorites.length} {favorites.length === 1 ? 'pet' : 'pets'} saved</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {favorites.length >= 2 && (
              <button
                type="button"
                onClick={() => { setCompareMode(!compareMode); setCompareSelection([]); }}
                className={`flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium transition ${compareMode ? 'bg-sage-500 text-white' : 'bg-sage-100 text-sage-600'}`}
              >
                <GitCompareArrows className="h-3.5 w-3.5" />
                Compare
              </button>
            )}
            {favorites.length > 0 && (
              <button type="button" onClick={handleShareAll} className="rounded-full bg-purple-50 p-2 text-purple-500 hover:bg-purple-100" aria-label="Share all favorites">
                <Share2 className="h-4 w-4" />
              </button>
            )}
            <button
              type="button"
              onClick={handleInvite}
              className="flex h-8 items-center gap-1 rounded-full bg-sage-100 px-3 text-xs font-medium text-sage-600 hover:bg-sage-200 transition"
              aria-label="Invite a friend"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        {favorites.length > 0 && (
          <div className="mb-4 flex rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('pets'); hapticLight(); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${activeTab === 'pets' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              ❤️ Saved Pets
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('shelters'); hapticLight(); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${activeTab === 'shelters' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              🗺️ Shelters
            </button>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="mt-20 flex flex-col items-center text-center">
            <div className="animate-bounce text-7xl">🐾</div>
            <h2 className="mt-6 text-xl font-semibold text-gray-700">No favorites yet!</h2>
            <p className="mt-2 max-w-xs text-gray-500">
              Swipe right on pets you love and they&apos;ll show up here. Your perfect match is waiting!
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={onBack}
                className="rounded-2xl bg-sage-500 px-8 py-3.5 font-semibold text-white shadow-sm transition hover:bg-sage-600 hover:shadow-md"
              >
                Start Swiping 🐾
              </button>
              <a
                href="/stories"
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-sage-200 px-6 py-3 text-sm font-medium text-sage-600 hover:bg-sage-50"
              >
                <BookOpen className="h-4 w-4" />
                Read Adoption Stories
              </a>
              <p className="text-xs text-gray-400">Tip: Swipe right or tap ❤️ to save a pet</p>
            </div>
          </div>
        ) : activeTab === 'shelters' ? (
          <div>
            <ShelterMap favorites={favorites} />
            <YourType favorites={favorites} />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sort bar */}
            <div className="relative flex items-center justify-between">

              <p className="text-xs text-gray-400">
                Sorted by <span className="font-semibold text-sage-600">{SORT_LABELS[sortBy]}</span>
                {sortBy === 'compatibility' && !quizDone && (
                  <span className="ml-1 text-gray-400">(take quiz first)</span>
                )}
              </p>
              <button
                type="button"
                onClick={() => { setShowSortMenu(!showSortMenu); hapticLight(); }}
                className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm hover:shadow-md"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                Sort
              </button>

              {/* Sort dropdown */}
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5"
                  >
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSortChange(opt)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-sage-50 ${sortBy === opt ? 'font-semibold text-sage-700' : 'text-gray-600'}`}
                      >
                        {SORT_LABELS[opt]}
                        {sortBy === opt && <span className="text-sage-500">✓</span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Milestones panel */}
            {(() => {
              const milestones = [
                { id: 'quiz', done: quizDone, icon: '🧠', label: 'Completed Quiz' },
                { id: 'five-saves', done: totalFavorited >= 5, icon: '❤️', label: 'Saved 5 Pets' },
                { id: 'stories', done: storiesViewed, icon: '📖', label: 'Viewed Adoption Stories' },
              ];
              const achievedMilestones = milestones.filter((m) => m.done);
              if (achievedMilestones.length === 0) return null;
              return (
                <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Your milestones">
                  {achievedMilestones.map((m) => (
                    <div
                      key={m.id}
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1.5 text-xs font-medium text-sage-700"
                    >
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{m.icon}</span>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Pet cards */}
            <AnimatePresence mode="popLayout">
              {sortedFavorites.map((pet) => {
                const compat = quizDone && quizAnswers.length > 0 ? getCompatibilityPct(pet, quizAnswers) : null;
                return (
                  <motion.div
                    key={pet.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all hover:shadow-md ${compareMode && compareSelection.includes(pet.id) ? 'ring-2 ring-sage-500' : ''}`}
                  >
                    <div className="flex cursor-pointer" onClick={() => compareMode ? toggleCompareSelect(pet.id) : onSelect(pet)}>
                      <div className="relative h-36 w-36 shrink-0">
                        <Image
                          src={imgErrors[pet.id] ? '/placeholder-pet.png' : pet.photo}
                          alt={pet.name}
                          fill
                          className="object-cover"
                          onError={() => setImgErrors(prev => ({ ...prev, [pet.id]: true }))}
                        />
                        <div className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                          {pet.type === 'dog' ? '🐕' : '🐈'}
                        </div>
                        {pet.featured && (
                          <div className="absolute left-0 right-0 top-0 flex justify-center py-1">
                            <FeaturedBadge />
                          </div>
                        )}
                        {compat !== null && (
                          <div className={`absolute left-0 right-0 top-0 flex items-center justify-center py-1 text-[10px] font-bold ${compat >= 80 ? 'bg-green-500/90 text-white' : compat >= 50 ? 'bg-yellow-400/90 text-gray-900' : 'bg-red-400/90 text-white'}`}>
                            {compat}% match
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <h3 className="text-lg font-bold text-gray-900">{pet.name}</h3>
                            <span className="text-sm text-gray-500">{pet.age}</span>
                          </div>
                          <p className="text-sm text-gray-500">{pet.breed} · {pet.size}</p>
                          <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="h-3 w-3" />
                            {pet.distance} · {pet.shelter}
                          </div>
                          {pet.adoptionFee && (
                            <span className="mt-1.5 inline-block rounded-full bg-sage-50 px-2 py-0.5 text-xs font-medium text-sage-600">
                              Fee: {pet.adoptionFee}
                            </span>
                          )}
                          {wingmanVotes[pet.id] === 'yes' && (
                            <span className="mt-1 block text-xs font-semibold text-green-600">
                              👥 A friend says YES!
                            </span>
                          )}
                          {wingmanVotes[pet.id] === 'no' && (
                            <span className="mt-1 block text-xs text-gray-400">
                              👥 Friend voted: maybe not
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${pet.shelterPhone}`}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Call ${pet.shelter}`}
                            className="flex items-center gap-1 rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-600 transition hover:bg-sage-100"
                          >
                            <Phone className="h-3 w-3" />
                            Call
                          </a>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(pet.shelterAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Get directions to ${pet.shelter}`}
                            className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-600 transition hover:bg-sky-100"
                          >
                            <Navigation className="h-3 w-3" />
                            Directions
                          </a>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleSharePet(pet); }}
                            aria-label={`Share ${pet.name}`}
                            className="flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-500 transition hover:bg-purple-100"
                          >
                            <Share2 className="h-3 w-3" />
                            Share
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setOpenSupplies(openSupplies === pet.id ? null : pet.id); }}
                            aria-label={`Supplies for ${pet.name}`}
                            className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                          >
                            🛒 Supplies
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemove(pet.id); }}
                        aria-label={`Remove ${pet.name} from favorites`}
                        className="self-start p-3 text-gray-300 transition hover:text-red-400"
                      >
                        <X className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                    {openSupplies === pet.id && (
                      <div className="px-3 pb-3" onClick={(e) => e.stopPropagation()}>
                        <SupplyChecklist pet={pet} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Compare CTA */}
            {compareMode && compareSelection.length === 2 && (
              <button
                type="button"
                onClick={handleCompare}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-500 py-4 font-semibold text-white shadow-md transition hover:bg-sage-600"
              >
                <GitCompareArrows className="h-5 w-5" />
                Compare These Two
              </button>
            )}
            {compareMode && compareSelection.length < 2 && (
              <p className="text-center text-sm text-sage-500">
                Select {2 - compareSelection.length} more {compareSelection.length === 0 ? 'pets' : 'pet'} to compare
              </p>
            )}

            {/* CTAs */}
            {favorites.length >= 1 && !compareMode && (
              <div className="mt-6 space-y-3">
                <a
                  href="/checklist"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-sage-500 px-6 py-4 font-semibold text-white transition hover:bg-sage-600"
                >
                  ✅ Adoption Checklist
                </a>
                <a
                  href="/stories"
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-sage-200 px-6 py-3.5 font-semibold text-sage-600 transition hover:bg-sage-50"
                >
                  <BookOpen className="h-4 w-4" />
                  Read Adoption Stories
                </a>
                <div className="rounded-2xl bg-sage-100 p-5 text-center">
                  <p className="text-sm font-medium text-sage-700">
                    Ready to meet them? Call the shelter to schedule a visit!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
