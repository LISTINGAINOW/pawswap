'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

const tips = [
  { emoji: '🏠', text: 'Prepare your home before bringing a pet — secure loose cables, remove toxic plants, set up food/water stations.' },
  { emoji: '📋', text: 'Many shelters require an application + home check. Have your landlord approval ready if renting.' },
  { emoji: '🧸', text: 'Ask the shelter about the pet\'s history — previous home, medical needs, behavioral quirks.' },
  { emoji: '⏰', text: 'The first 3 days, 3 weeks, and 3 months are adjustment periods. Give your new pet time to decompress.' },
  { emoji: '💊', text: 'Budget $200-500 for initial vet visit, vaccinations, and supplies (bed, food, leash, litter box).' },
  { emoji: '🤝', text: 'If you have other pets, do a slow introduction — separate spaces first, then supervised meetups.' },
  { emoji: '❤️', text: 'Adopting a senior pet? They\'re often calmer, already trained, and deeply grateful for a second chance.' },
  { emoji: '📸', text: 'Take photos at the shelter visit — sometimes the connection is instant and you\'ll want to remember the moment.' },
];

export default function AdoptionTips() {
  const [currentTip, setCurrentTip] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setCurrentTip(Math.floor(Math.random() * tips.length));
  }, []);

  if (!visible) return null;

  const tip = tips[currentTip];

  return (
    <div className="mx-4 mt-3 flex items-start gap-3 rounded-2xl bg-warm-50 p-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-100 text-lg">
        {tip.emoji}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1.5">
          <Lightbulb className="h-3 w-3 text-warm-500" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-warm-500">Adoption tip</span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-warm-700">{tip.text}</p>
      </div>
      <button type="button" onClick={() => setVisible(false)} className="shrink-0 p-0.5 text-warm-300 hover:text-warm-500">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
