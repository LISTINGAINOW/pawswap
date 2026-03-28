'use client';

import { ArrowLeft, RotateCcw } from 'lucide-react';
import { mockPets } from '@/data/pets';

interface Props {
  animalFilter: 'all' | 'dog' | 'cat';
  sizeFilter: 'all' | 'Small' | 'Medium' | 'Large' | 'Extra Large';
  breedFilter: string;
  ageFilter: 'all' | 'baby' | 'young' | 'adult' | 'senior';
  genderFilter: 'all' | 'Male' | 'Female';
  onAnimalChange: (v: 'all' | 'dog' | 'cat') => void;
  onSizeChange: (v: 'all' | 'Small' | 'Medium' | 'Large' | 'Extra Large') => void;
  onBreedChange: (v: string) => void;
  onAgeChange: (v: 'all' | 'baby' | 'young' | 'adult' | 'senior') => void;
  onGenderChange: (v: 'all' | 'Male' | 'Female') => void;
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
  { value: 'Extra Large' as const, label: 'XL' },
];

const ageOptions = [
  { value: 'all' as const, label: 'Any Age', emoji: '🐾' },
  { value: 'baby' as const, label: 'Baby', emoji: '🍼', desc: 'Under 1 year' },
  { value: 'young' as const, label: 'Young', emoji: '⚡', desc: '1-3 years' },
  { value: 'adult' as const, label: 'Adult', emoji: '🏠', desc: '3-7 years' },
  { value: 'senior' as const, label: 'Senior', emoji: '🤍', desc: '7+ years' },
];

const genderOptions = [
  { value: 'all' as const, label: 'Any' },
  { value: 'Male' as const, label: 'Male ♂' },
  { value: 'Female' as const, label: 'Female ♀' },
];

// Get unique breeds with counts based on selected animal type
function getBreeds(animalFilter: 'all' | 'dog' | 'cat'): { name: string; count: number }[] {
  const pets = animalFilter === 'all'
    ? mockPets
    : mockPets.filter((p) => p.type === animalFilter);
  const counts: Record<string, number> = {};
  pets.forEach(p => { counts[p.breed] = (counts[p.breed] || 0) + 1; });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default function FilterPanel({
  animalFilter,
  sizeFilter,
  breedFilter,
  ageFilter,
  genderFilter,
  onAnimalChange,
  onSizeChange,
  onBreedChange,
  onAgeChange,
  onGenderChange,
  onBack,
  onReset,
  resultCount,
}: Props) {
  const breeds = getBreeds(animalFilter);

  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-32 pt-6">
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
            Reset all
          </button>
        </div>

        {/* Animal type */}
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">I&apos;m looking for</h2>
          <div className="grid grid-cols-3 gap-3">
            {animalOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onAnimalChange(opt.value);
                  onBreedChange('all'); // Reset breed when animal changes
                }}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
                  animalFilter === opt.value
                    ? 'border-sage-500 bg-sage-100 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-sage-300'
                }`}
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-sm font-medium text-gray-700">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Breed */}
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Breed {breedFilter !== 'all' && <span className="normal-case text-sage-500">· {breedFilter}</span>}
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onBreedChange('all')}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                breedFilter === 'all'
                  ? 'bg-sage-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-sage-100'
              }`}
            >
              All Breeds
            </button>
            {breeds.map((breed) => (
              <button
                key={breed.name}
                type="button"
                onClick={() => onBreedChange(breed.name)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  breedFilter === breed.name
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-sage-100'
                }`}
              >
                {breed.name}
                <span className={`text-xs ${breedFilter === breed.name ? 'text-white/70' : 'text-gray-400'}`}>
                  {breed.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Age</h2>
          <div className="grid grid-cols-2 gap-2">
            {ageOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onAgeChange(opt.value)}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                  ageFilter === opt.value
                    ? 'border-sage-500 bg-sage-100 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-sage-300'
                }`}
              >
                <span className="text-xl">{opt.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">{opt.label}</p>
                  {'desc' in opt && <p className="text-xs text-gray-400">{opt.desc}</p>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gender */}
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Gender</h2>
          <div className="flex gap-2">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onGenderChange(opt.value)}
                className={`flex-1 rounded-full py-2.5 text-center text-sm font-medium transition-all ${
                  genderFilter === opt.value
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-sage-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Size</h2>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSizeChange(opt.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  sizeFilter === opt.value
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-sage-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Apply bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-sm safe-bottom">
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-sage-600"
          >
            Show {resultCount} {resultCount === 1 ? 'pet' : 'pets'}
          </button>
        </div>
      </div>
    </div>
  );
}
