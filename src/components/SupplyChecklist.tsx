'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, ShoppingCart } from 'lucide-react';
import type { Pet } from '@/data/pets';
import { getSupplyLinks } from '@/lib/affiliates';
import { trackRevenue } from '@/lib/revenue';
import { trackEvent } from '@/lib/analytics';

interface Props {
  pet: Pet;
}

export default function SupplyChecklist({ pet }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const supplies = getSupplyLinks(pet);

  // Persist "already have it" state per pet
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`pupular-supplies-${pet.id}`);
      if (saved) setOwned(new Set(JSON.parse(saved)));
    } catch { /* ignore */ }
  }, [pet.id]);

  const toggleOwned = (category: string) => {
    setOwned((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      try {
        localStorage.setItem(`pupular-supplies-${pet.id}`, JSON.stringify([...next]));
      } catch { /* ignore */ }
      return next;
    });
  };

  const handleShopClick = (category: string, url: string) => {
    trackRevenue('affiliate_click', undefined, { pet_id: pet.id, category, pet_type: pet.type });
    trackEvent('affiliate_click' as never, { category, pet_id: pet.id });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const ready = owned.size;
  const total = supplies.length;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-sage-100 bg-sage-50">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-sage-600" />
          <span className="text-sm font-semibold text-sage-700">
            Get ready for {pet.name}!
          </span>
          <span className="rounded-full bg-sage-200 px-2 py-0.5 text-[10px] font-bold text-sage-700">
            {ready}/{total} ready
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-sage-500 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-sage-500 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-sage-100 px-4 pb-4 pt-2 space-y-2">
          {/* Progress bar */}
          <div className="mb-3">
            <div className="h-2 overflow-hidden rounded-full bg-sage-200">
              <div
                className="h-full rounded-full bg-sage-500 transition-all duration-300"
                style={{ width: `${(ready / total) * 100}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-sage-600">
              {ready === total
                ? `All set for ${pet.name}! 🎉`
                : `${ready} of ${total} essentials ready`}
            </p>
          </div>

          {supplies.map((item) => {
            const isOwned = owned.has(item.category);
            return (
              <div
                key={item.category}
                className={`flex items-center gap-3 rounded-lg p-2.5 transition ${
                  isOwned ? 'bg-sage-100 opacity-60' : 'bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleOwned(item.category)}
                  aria-label={isOwned ? `Unmark ${item.category} as owned` : `Mark ${item.category} as owned`}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    isOwned
                      ? 'border-sage-500 bg-sage-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {isOwned && <span className="text-[10px] font-bold leading-none">✓</span>}
                </button>
                <span className="text-base">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isOwned ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {item.name}
                  </p>
                  <p className="text-[11px] text-gray-400">{item.priceRange}</p>
                </div>
                {!isOwned && (
                  <button
                    type="button"
                    onClick={() => handleShopClick(item.category, item.url)}
                    className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-100 shrink-0"
                  >
                    Shop
                    <ExternalLink className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}

          <p className="pt-1 text-[10px] text-gray-400 text-center">
            Powered by Chewy · Pupular may earn a commission
          </p>
        </div>
      )}
    </div>
  );
}
