'use client';

import { useState } from 'react';
import { Share2, Copy, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Props {
  resultType: string;
  meta: { title: string; description: string; emoji: string };
}

const personalityTraits: Record<string, string[]> = {
  'cuddly-dog': ['Loyal', 'Affectionate', 'Follows you everywhere', 'Best snuggler'],
  'cuddly-cat': ['Purring machine', 'Lap resident', 'Headbutts of love', 'Velcro mode'],
  'active-dog': ['Boundless energy', 'Trail warrior', 'Fetch champion', 'Zoomie specialist'],
  'active-cat': ['Midnight zoomies', 'Vertical explorer', 'Toy destroyer', 'Chaos agent'],
  'chill-dog': ['Professional napper', 'Couch expert', 'Zen energy', 'Gentle soul'],
  'chill-cat': ['Window watcher', 'Sunbeam chaser', 'Quiet companion', 'Low-maintenance love'],
  'playful-dog': ['Class clown', 'Trick learner', 'Joy machine', 'Makes everyone smile'],
  'playful-cat': ['One brain cell', 'Box enthusiast', 'Keyboard walker', 'Comedy gold'],
};

const bgColors: Record<string, string> = {
  'cuddly-dog': 'from-rose-100 to-pink-50',
  'cuddly-cat': 'from-purple-100 to-pink-50',
  'active-dog': 'from-orange-100 to-yellow-50',
  'active-cat': 'from-cyan-100 to-blue-50',
  'chill-dog': 'from-sage-100 to-green-50',
  'chill-cat': 'from-blue-100 to-indigo-50',
  'playful-dog': 'from-yellow-100 to-amber-50',
  'playful-cat': 'from-emerald-100 to-teal-50',
};

export default function QuizResultPage({ resultType, meta }: Props) {
  const [copied, setCopied] = useState(false);
  const traits = personalityTraits[resultType] || personalityTraits['cuddly-dog'];
  const bg = bgColors[resultType] || bgColors['cuddly-dog'];

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/quiz/result?type=${resultType}`
    : `https://pawnder.app/quiz/result?type=${resultType}`;

  const quizUrl = typeof window !== 'undefined'
    ? `${window.location.origin}`
    : 'https://pawnder.app';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${meta.emoji} I'm a ${meta.title}!`,
          text: `${meta.description} What pet matches YOUR vibe? Take the quiz!`,
          url: quizUrl,
        });
      } catch { /* cancelled */ }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${meta.emoji} I'm a ${meta.title}! ${meta.description}\n\nWhat pet matches YOUR vibe? Take the quiz: ${quizUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <div className={`flex min-h-screen flex-col items-center bg-gradient-to-b ${bg} px-6 py-10`}>
      <div className="w-full max-w-sm">
        {/* Result card — this is what gets shared */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
          {/* Top section */}
          <div className="px-8 pb-6 pt-10 text-center">
            <div className="text-7xl">{meta.emoji}</div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-sage-500">Your pet match is</p>
            <h1 className="mt-2 text-4xl font-black text-gray-900">{meta.title}</h1>
            <p className="mt-3 text-base leading-relaxed text-gray-500">{meta.description}</p>
          </div>

          {/* Traits */}
          <div className="border-t border-gray-100 px-8 py-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Your traits</p>
            <div className="flex flex-wrap gap-2">
              {traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full bg-sage-50 px-3 py-1 text-sm font-medium text-sage-700"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-gray-100 bg-sage-50 px-8 py-5 text-center">
            <p className="text-sm text-sage-600">🐾 Find real adoptable pets that match you</p>
            <Link
              href="/"
              className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-sage-500 py-3 font-semibold text-white transition hover:bg-sage-600"
            >
              Open Pawnder
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Share buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3.5 font-semibold text-gray-700 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
          >
            <Share2 className="h-4 w-4" />
            Share result
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white py-3.5 font-semibold text-gray-700 shadow-sm ring-1 ring-black/5 transition hover:shadow-md"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>

        {/* Take quiz CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">Not your result?</p>
          <Link href="/" className="mt-1 inline-block text-sm font-semibold text-sage-500 hover:text-sage-600">
            Take the quiz yourself →
          </Link>
        </div>
      </div>
    </div>
  );
}
