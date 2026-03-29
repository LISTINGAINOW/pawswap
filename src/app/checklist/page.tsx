'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Sparkles, Share2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { trackRevenue } from '@/lib/revenue';

interface CheckItem {
  id: string;
  text: string;
  category: string;
  emoji: string;
  shopLabel?: string;
  shopUrl?: string;
}

const CHEWY = 'https://www.chewy.com';
const MAPS = 'https://www.google.com/maps/search/veterinarians+near+me';

const checklistItems: CheckItem[] = [
  // Before the visit
  { id: 'research',  text: 'Research the breed/type — energy level, grooming needs, lifespan', category: 'Before the Visit', emoji: '📚' },
  { id: 'landlord',  text: 'Confirm pet policy with landlord (if renting)', category: 'Before the Visit', emoji: '🏠' },
  { id: 'budget',    text: 'Budget for initial costs: adoption fee + vet + supplies ($300–800)', category: 'Before the Visit', emoji: '💰', shopLabel: 'Compare Pet Insurance →', shopUrl: '/insurance' },
  { id: 'schedule',  text: 'Schedule a visit with the shelter', category: 'Before the Visit', emoji: '📅' },
  { id: 'family',    text: 'Make sure everyone in the household is on board', category: 'Before the Visit', emoji: '👨‍👩‍👧' },

  // At the shelter
  { id: 'history',   text: "Ask about the pet's history and behavior", category: 'At the Shelter', emoji: '❓' },
  { id: 'medical',   text: 'Get medical records (vaccinations, spay/neuter, microchip)', category: 'At the Shelter', emoji: '💊' },
  { id: 'food',      text: "Ask what food they've been eating (transition slowly)", category: 'At the Shelter', emoji: '🥘', shopLabel: 'Shop Dog & Cat Food →', shopUrl: `${CHEWY}/b/food?utm_source=pupular` },
  { id: 'meet',      text: 'If you have other pets, arrange a meet-and-greet', category: 'At the Shelter', emoji: '🤝' },
  { id: 'questions', text: 'Ask: "What should I know that isn\'t on the profile?"', category: 'At the Shelter', emoji: '💡' },

  // Preparing your home
  { id: 'petproof',  text: 'Pet-proof the house: secure cables, remove toxic plants', category: 'Preparing Home', emoji: '🔒' },
  { id: 'space',     text: 'Set up their space: bed, food/water bowls, crate if needed', category: 'Preparing Home', emoji: '🛏️', shopLabel: 'Shop Beds & Crates →', shopUrl: `${CHEWY}/b/beds-furniture?utm_source=pupular` },
  { id: 'supplies',  text: 'Buy supplies: leash/harness, collar + ID tag, toys, treats', category: 'Preparing Home', emoji: '🛍️', shopLabel: 'Shop Supplies on Chewy →', shopUrl: `${CHEWY}/b/new-pet-essentials?utm_source=pupular` },
  { id: 'litter',    text: 'For cats: litter box in a quiet location (1 per cat + 1 extra)', category: 'Preparing Home', emoji: '🧹', shopLabel: 'Shop Litter Boxes →', shopUrl: `${CHEWY}/b/litter-boxes?utm_source=pupular` },
  { id: 'vet',       text: 'Schedule a vet appointment within the first week', category: 'Preparing Home', emoji: '🩺', shopLabel: 'Find Vets Near You →', shopUrl: MAPS },

  // First week
  { id: 'decompress', text: "Give them 3 days to decompress — don't overwhelm with visitors", category: 'First Week', emoji: '🕊️' },
  { id: 'routine',    text: 'Establish a routine: same feeding times, walk times, sleep spot', category: 'First Week', emoji: '⏰' },
  { id: 'patience',   text: 'Be patient — accidents and anxiety are normal at first', category: 'First Week', emoji: '💛' },
  { id: 'bond',       text: 'Bond through gentle play, treats, and just being present', category: 'First Week', emoji: '❤️', shopLabel: 'Shop Toys & Treats →', shopUrl: `${CHEWY}/b/toys?utm_source=pupular` },
  { id: 'insurance',  text: 'Set up pet insurance before the first vet visit', category: 'First Week', emoji: '🛡️', shopLabel: 'Compare Pet Insurance →', shopUrl: '/insurance' },
  { id: 'photos',     text: 'Take photos and celebrate your new family member!', category: 'First Week', emoji: '📸' },
];

const categories = ['Before the Visit', 'At the Shelter', 'Preparing Home', 'First Week'];

function isExternal(url: string) {
  return url.startsWith('http');
}

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('pupular-checklist');
    if (saved) setChecked(new Set(JSON.parse(saved)));
  }, []);

  const toggleItem = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('pupular-checklist', JSON.stringify([...next]));
      return next;
    });
  };

  const handleShopClick = (item: CheckItem) => {
    if (!item.shopUrl) return;
    trackRevenue(
      isExternal(item.shopUrl) ? 'affiliate_click' : 'insurance_referral',
      undefined,
      { checklist_item: item.id },
    );
  };

  const totalChecked = checked.size;
  const totalItems = checklistItems.length;
  const progress = Math.round((totalChecked / totalItems) * 100);

  const handleShare = async () => {
    const text = `I'm ${progress}% ready to adopt a pet! 🐾\n\nUsing the adoption checklist on Pupular to prepare for my new furry family member.\n\nhttps://www.pupular.app/checklist`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: "I'm ready to adopt!", text, url: 'https://www.pupular.app/checklist' }); } catch { /* cancelled */ }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Adoption Checklist</h1>
            <p className="text-sm text-gray-500">{totalChecked}/{totalItems} complete</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Your progress</span>
            <span className="text-sm font-bold text-sage-600">{progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-sage-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sage-400 to-sage-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-sage-600">
              <Sparkles className="h-4 w-4" />
              You&apos;re ready to bring your new friend home! 🎉
            </div>
          )}
          <button
            type="button"
            onClick={handleShare}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-sage-500 py-2.5 text-sm font-semibold text-white transition hover:bg-sage-600"
          >
            <Share2 className="h-4 w-4" />
            I&apos;m {progress}% ready to adopt!
          </button>
        </div>

        {/* Checklist */}
        {categories.map((category) => {
          const items = checklistItems.filter((i) => i.category === category);
          const catChecked = items.filter((i) => checked.has(i.id)).length;
          return (
            <div key={category} className="mb-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">{category}</h2>
                <span className="text-xs text-gray-400">{catChecked}/{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((item) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <div key={item.id} className={`rounded-xl transition-all ${isChecked ? 'bg-sage-100 ring-1 ring-sage-200' : 'bg-white ring-1 ring-black/5 hover:ring-sage-200'}`}>
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="flex w-full items-start gap-3 p-3.5 text-left"
                      >
                        <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
                          isChecked ? 'bg-sage-500 text-white' : 'border-2 border-gray-300'
                        }`}>
                          {isChecked && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${isChecked ? 'text-sage-700 line-through' : 'text-gray-700'}`}>
                            <span className="mr-1.5">{item.emoji}</span>
                            {item.text}
                          </p>
                        </div>
                      </button>
                      {item.shopUrl && !isChecked && (
                        <div className="px-3.5 pb-3 pl-[52px]">
                          {isExternal(item.shopUrl) ? (
                            <a
                              href={item.shopUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => handleShopClick(item)}
                              className="inline-flex items-center gap-1 text-xs text-amber-700 hover:text-amber-800 hover:underline"
                            >
                              {item.shopLabel}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <Link
                              href={item.shopUrl}
                              onClick={() => handleShopClick(item)}
                              className="inline-flex items-center gap-1 text-xs text-sage-600 hover:text-sage-700 hover:underline"
                            >
                              {item.shopLabel}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
