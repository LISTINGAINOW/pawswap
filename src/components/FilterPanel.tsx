'use client';

import { ArrowLeft, RotateCcw } from 'lucide-react';

interface Props {
  animalFilter: 'all' | 'dog' | 'cat';
  sizeFilter: 'all' | 'Small' | 'Medium' | 'Large' | 'Extra Large';
  onAnimalChange: (v: 'all' | 'dog' | 'cat') => void;
  onSizeChange: (v: 'all' | 'Small' | 'Medium' | 'Large' | 'Extra Large') => void;
  onBack: () => void;
  onReset: () => void;
  resultCount: number;
}

const animalOptions = [
  { value: 'all' as const, label: 'All Pets', emoji: '🐾' },
  { value: 'dog' as const, label: 'Dogs', emoji: '🐕' },
  { value: 'cat' as const, label: 'Cats', emoji: '🐈' },
];

const sizeOptions = [
  { value: 'all' as const, label: 'Any Size' },
  { value: 'Small' as const, label: 'Small' },
  { value: 'Medium' as const, label: 'Medium' },
  { value: 'Large' as const, label: 'Large' },
  { value: 'Extra Large' as const, label: 'Extra Large' },
];

export default function FilterPanel({
  animalFilter,
  sizeFilter,
  onAnimalChange,
  onSizeChange,
  onBack,
  onReset,
  resultCount,
}: Props) {
  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Filters</h1>
          <button
            type="button"
            onClick={onReset}
            className="ml-auto flex items-center gap-1.5 text-sm font-medium text-sage-600 hover:text-sage-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* Animal type */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">I&apos;m looking for</h2>
          <div className="grid grid-cols-3 gap-3">
            {animalOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onAnimalChange(opt.value)}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                  animalFilter === opt.value
                    ? 'border-sage-500 bg-sage-100'
                    : 'border-gray-200 bg-white hover:border-sage-300'
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Size</h2>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSizeChange(opt.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  sizeFilter === opt.value
                    ? 'bg-sage-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-sage-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count + apply */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/90 p-4 backdrop-blur-sm safe-bottom">
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white transition hover:bg-sage-600"
          >
            Show {resultCount} {resultCount === 1 ? 'pet' : 'pets'}
          </button>
        </div>
      </div>
    </div>
  );
}
