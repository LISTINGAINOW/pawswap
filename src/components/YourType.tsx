'use client';

import { useState } from 'react';
import type { Pet } from '@/data/pets';

interface PersonalityType {
  title: string;
  emoji: string;
  description: string;
}

function analyzeType(favorites: Pet[]): PersonalityType | null {
  if (favorites.length < 3) return null;

  const dogs = favorites.filter((p) => p.type === 'dog').length;
  const cats = favorites.filter((p) => p.type === 'cat').length;

  // Top breed
  const breedCounts: Record<string, number> = {};
  for (const pet of favorites) {
    breedCounts[pet.breed] = (breedCounts[pet.breed] || 0) + 1;
  }
  const topBreed = Object.entries(breedCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  // Top size
  const sizeCounts: Record<string, number> = {};
  for (const pet of favorites) {
    sizeCounts[pet.size] = (sizeCounts[pet.size] || 0) + 1;
  }
  const topSize = Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

  if (dogs > cats * 2) {
    const breedLower = topBreed.toLowerCase();
    if (breedLower.includes('golden') || breedLower.includes('retriever')) {
      return {
        title: 'Golden Retriever Person',
        emoji: '🐕',
        description:
          "You love friendly, loyal companions. You're warm, social, and always ready for an adventure!",
      };
    }
    if (breedLower.includes('lab')) {
      return {
        title: 'Lab Lover',
        emoji: '🦮',
        description:
          "Enthusiastic, devoted, and endlessly playful — Labs match your unstoppable energy!",
      };
    }
    if (topSize === 'Small') {
      return {
        title: 'Small Dog Enthusiast',
        emoji: '🐩',
        description:
          "Big love in a tiny package! You appreciate the oversized personality of small pups.",
      };
    }
    if (topSize === 'Large' || topSize === 'Extra Large') {
      return {
        title: 'Big Dog Person',
        emoji: '🦮',
        description:
          "You go big or go home! You love a dog that can keep up with your adventurous side.",
      };
    }
    return {
      title: 'Dog Person',
      emoji: '🐕',
      description:
        "Loyal, energetic, and always happy to see you — just like the pups you love!",
    };
  }

  if (cats > dogs * 2) {
    return {
      title: 'Cat Person',
      emoji: '🐈',
      description:
        "Independent, thoughtful, and a little mysterious — you and your feline friends are kindred spirits.",
    };
  }

  return {
    title: 'Animal Lover',
    emoji: '🐾',
    description:
      "Dogs, cats — you love them all! Your heart is big enough for every creature.",
  };
}

interface Props {
  favorites: Pet[];
}

export default function YourType({ favorites }: Props) {
  const [copied, setCopied] = useState(false);
  const type = analyzeType(favorites);

  if (!type) return null;

  const handleShare = async () => {
    const text = `I'm a "${type.title}" ${type.emoji} according to Pupular!\n\n${type.description}\n\nFind your pet match at https://www.pupular.app 🐾`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'My Pet Personality on Pupular', text });
      } catch {
        /* cancelled */
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 p-5 ring-1 ring-purple-100">
      <p className="text-xs font-bold uppercase tracking-widest text-purple-400">
        Your Pet Personality
      </p>
      <div className="mt-2 flex items-start gap-3">
        <span className="text-4xl">{type.emoji}</span>
        <div>
          <p className="text-base font-bold text-gray-900">You&apos;re a {type.title}!</p>
          <p className="mt-0.5 text-sm text-gray-500">{type.description}</p>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Based on your {favorites.length} saved {favorites.length === 1 ? 'pet' : 'pets'}
      </div>
      <button
        type="button"
        onClick={handleShare}
        className="mt-3 w-full rounded-xl bg-purple-500 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
      >
        {copied ? '✅ Copied to clipboard!' : '🔗 Share Your Pet Type'}
      </button>
    </div>
  );
}
