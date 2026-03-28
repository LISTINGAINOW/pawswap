'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RotateCcw, Search } from 'lucide-react';
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
  const [breedSearch, setBreedSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const breedInputRef = useRef<HTMLInputElement>(null);

  // Persist filter selections to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pupular-filters', JSON.stringify({
        animalFilter, sizeFilter, breedFilter, ageFilter, genderFilter,
      }));
    } catch { /* ignore */ }
  }, [animalFilter, sizeFilter, breedFilter, ageFilter, genderFilter]);

  // Show current breed in search input
  useEffect(() => {
    if (breedFilter !== 'all') setBreedSearch(breedFilter);
    else setBreedSearch('');
  }, [breedFilter]);

  const filteredBreeds = breedSearch.trim()
    ? breeds.filter(b => b.name.toLowerCase().includes(breedSearch.toLowerCase()))
    : breeds;

  const handleBreedSelect = (name: string) => {
    onBreedChange(name);
    setBreedSearch(name);
    setShowSuggestions(false);
  };

  const handleBreedClear = () => {
    onBreedChange('all');
    setBreedSearch('');
    setShowSuggestions(false);
    breedInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-32 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to swipe"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Filters</h1>
          <button
            type="button"
            onClick={() => {
              onReset();
              setBreedSearch('');
            }}
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
                aria-pressed={animalFilter === opt.value}
                onClick={() => {
                  onAnimalChange(opt.value);
                  onBreedChange('all');
                  setBreedSearch('');
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

        {/* Breed — text search with autocomplete */}
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Breed
            {breedFilter !== 'all' && (
              <span className="normal-case text-sage-500"> · {breedFilter}</span>
            )}
          </h2>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              ref={breedInputRef}
              type="text"
              placeholder="Search breeds..."
              value={breedSearch}
              aria-label="Search breeds"
              aria-autocomplete="list"
              aria-expanded={showSuggestions && filteredBreeds.length > 0}
              onChange={(e) => {
                setBreedSearch(e.target.value);
                setShowSuggestions(true);
                if (!e.target.value) onBreedChange('all');
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              className="w-full rounded-2xl border-2 border-gray-200 bg-white py-3 pl-10 pr-10 text-sm outline-none transition focus:border-sage-400"
            />
            {breedSearch && (
              <button
                type="button"
                onClick={handleBreedClear}
                aria-label="Clear breed filter"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}

            {/* Autocomplete dropdown */}
            {showSuggestions && filteredBreeds.length > 0 && (
              <div
                role="listbox"
                aria-label="Breed suggestions"
                className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg"
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={breedFilter === 'all'}
                  onMouseDown={() => handleBreedSelect('all')}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-sage-50 ${breedFilter === 'all' ? 'font-semibold text-sage-600' : 'text-gray-700'}`}
                >
                  All Breeds
                </button>
                {filteredBreeds.map((breed) => (
                  <button
                    key={breed.name}
                    type="button"
                    role="option"
                    aria-selected={breedFilter === breed.name}
                    onMouseDown={() => handleBreedSelect(breed.name)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition hover:bg-sage-50 ${breedFilter === breed.name ? 'font-semibold text-sage-600' : 'text-gray-700'}`}
                  >
                    <span>{breed.name}</span>
                    <span className="text-xs text-gray-400">{breed.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick breed chips (when no search) */}
          {!breedSearch && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={breedFilter === 'all'}
                onClick={() => onBreedChange('all')}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  breedFilter === 'all'
                    ? 'bg-sage-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-sage-100'
                }`}
              >
                All Breeds
              </button>
              {breeds.slice(0, 8).map((breed) => (
                <button
                  key={breed.name}
                  type="button"
                  aria-pressed={breedFilter === breed.name}
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
          )}
        </div>

        {/* Age */}
        <div className="mb-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Age</h2>
          <div className="grid grid-cols-2 gap-2">
            {ageOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={ageFilter === opt.value}
                onClick={() => onAgeChange(opt.value)}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                  ageFilter === opt.value
                    ? 'border-sage-500 bg-sage-100 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-sage-300'
                }`}
              >
                <span className="text-xl" aria-hidden="true">{opt.emoji}</span>
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
          <div className="flex gap-2" role="group" aria-label="Gender filter">
            {genderOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={genderFilter === opt.value}
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
                aria-pressed={sizeFilter === opt.value}
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
