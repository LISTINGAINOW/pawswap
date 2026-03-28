'use client';

import { useState, useCallback } from 'react';
import { Heart, RotateCcw, SlidersHorizontal, MapPin } from 'lucide-react';
import SwipeCard from '@/components/SwipeCard';
import PetDetail from '@/components/PetDetail';
import FavoritesList from '@/components/FavoritesList';
import FilterPanel from '@/components/FilterPanel';
import LocationPrompt from '@/components/LocationPrompt';
import OnboardingSlides from '@/components/OnboardingSlides';
import KeyboardHints from '@/components/KeyboardHints';
import MatchToast from '@/components/MatchToast';
import PetQuiz from '@/components/PetQuiz';
import QuizResults from '@/components/QuizResults';
import { mockPets, Pet } from '@/data/pets';

type View = 'onboarding' | 'location' | 'quiz' | 'quiz-results' | 'swipe' | 'favorites' | 'filters';
type AnimalFilter = 'all' | 'dog' | 'cat';
type SizeFilter = 'all' | 'Small' | 'Medium' | 'Large' | 'Extra Large';
type AgeFilter = 'all' | 'baby' | 'young' | 'adult' | 'senior';
type GenderFilter = 'all' | 'Male' | 'Female';

interface UserLocation {
  lat: number;
  lng: number;
  label: string;
}

export default function Home() {
  const [view, setView] = useState<View>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('pawswap-onboarded')) {
      return 'location';
    }
    return 'onboarding';
  });
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailPet, setDetailPet] = useState<Pet | null>(null);
  const [lastSaved, setLastSaved] = useState<Pet | null>(null);
  const [animalFilter, setAnimalFilter] = useState<AnimalFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [breedFilter, setBreedFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('all');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [quizMatches, setQuizMatches] = useState<Pet[]>([]);

  // Age matching helper
  const matchesAge = (petAge: string, filter: AgeFilter): boolean => {
    if (filter === 'all') return true;
    const lower = petAge.toLowerCase();
    const months = lower.includes('month');
    const years = parseInt(lower) || 0;
    switch (filter) {
      case 'baby': return months || years < 1;
      case 'young': return !months && years >= 1 && years <= 3;
      case 'adult': return !months && years > 3 && years <= 7;
      case 'senior': return !months && years > 7;
      default: return true;
    }
  };

  const filteredPets = mockPets.filter((pet) => {
    if (animalFilter !== 'all' && pet.type !== animalFilter) return false;
    if (sizeFilter !== 'all' && pet.size !== sizeFilter) return false;
    if (breedFilter !== 'all' && pet.breed !== breedFilter) return false;
    if (!matchesAge(pet.age, ageFilter)) return false;
    if (genderFilter !== 'all' && pet.gender !== genderFilter) return false;
    if (favorites.some((f) => f.id === pet.id)) return false;
    if (passed.includes(pet.id)) return false;
    return true;
  });

  const handleSwipeRight = useCallback(() => {
    const pet = filteredPets[0];
    if (pet) {
      setFavorites((prev) => [...prev, pet]);
      setLastSaved(pet);
      setCurrentIndex((i) => i + 1);
    }
  }, [filteredPets]);

  const handleSwipeLeft = useCallback(() => {
    const pet = filteredPets[0];
    if (pet) {
      setPassed((prev) => [...prev, pet.id]);
      setCurrentIndex((i) => i + 1);
    }
  }, [filteredPets]);

  const handleUndo = () => {
    if (passed.length > 0) {
      const lastPassedId = passed[passed.length - 1];
      setPassed((prev) => prev.slice(0, -1));
      setCurrentIndex((i) => Math.max(0, i - 1));
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const resetAll = () => {
    setPassed([]);
    setCurrentIndex(0);
  };

  const handleLocationSet = (loc: UserLocation) => {
    setLocation(loc);
    setView('quiz');
  };

  // Onboarding
  if (view === 'onboarding') {
    return (
      <OnboardingSlides
        onComplete={() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('pawswap-onboarded', 'true');
          }
          setView('location');
        }}
      />
    );
  }

  // Quiz
  if (view === 'quiz') {
    return (
      <PetQuiz
        onComplete={(matches) => {
          setQuizMatches(matches);
          setView('quiz-results');
        }}
        onSkip={() => setView('swipe')}
      />
    );
  }

  // Quiz results
  if (view === 'quiz-results') {
    return (
      <QuizResults
        matches={quizMatches}
        onStartSwiping={() => setView('swipe')}
        onRetakeQuiz={() => setView('quiz')}
        onSelectPet={(pet) => setDetailPet(pet)}
      />
    );
  }

  // Location prompt
  if (view === 'location') {
    return <LocationPrompt onLocationSet={handleLocationSet} />;
  }

  // Favorites
  if (view === 'favorites') {
    return (
      <FavoritesList
        favorites={favorites}
        onRemove={handleRemoveFavorite}
        onBack={() => setView('swipe')}
        onSelect={(pet) => setDetailPet(pet)}
      />
    );
  }

  // Filters
  if (view === 'filters') {
    return (
      <FilterPanel
        animalFilter={animalFilter}
        sizeFilter={sizeFilter}
        breedFilter={breedFilter}
        ageFilter={ageFilter}
        genderFilter={genderFilter}
        onAnimalChange={setAnimalFilter}
        onSizeChange={setSizeFilter}
        onBreedChange={setBreedFilter}
        onAgeChange={setAgeFilter}
        onGenderChange={setGenderFilter}
        onBack={() => setView('swipe')}
        onReset={() => {
          setAnimalFilter('all');
          setSizeFilter('all');
          setBreedFilter('all');
          setAgeFilter('all');
          setGenderFilter('all');
        }}
        resultCount={mockPets.filter((pet) => {
          if (animalFilter !== 'all' && pet.type !== animalFilter) return false;
          if (sizeFilter !== 'all' && pet.size !== sizeFilter) return false;
          if (breedFilter !== 'all' && pet.breed !== breedFilter) return false;
          if (!matchesAge(pet.age, ageFilter)) return false;
          if (genderFilter !== 'all' && pet.gender !== genderFilter) return false;
          return true;
        }).length}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-sage-50">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <button
          type="button"
          onClick={() => setView('filters')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
        >
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-700">🐾 PawSwap</h1>
          {location && (
            <button
              type="button"
              onClick={() => setView('location')}
              className="mt-0.5 flex items-center gap-1 text-xs text-gray-400 hover:text-sage-500"
            >
              <MapPin className="h-3 w-3" />
              {location.label}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setView('favorites')}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
        >
          <Heart className={`h-5 w-5 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          {favorites.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {favorites.length}
            </span>
          )}
        </button>
      </header>

      {/* Card stack */}
      <main className="flex flex-1 items-center justify-center px-4 py-4">
        <div className="relative h-[560px] w-full max-w-[380px]">
          {filteredPets.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
              <div className="text-6xl">🐾</div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">All caught up!</h2>
              <p className="mt-2 text-gray-500">
                {favorites.length > 0
                  ? `You've saved ${favorites.length} ${favorites.length === 1 ? 'pet' : 'pets'}. Check your favorites!`
                  : 'No more pets to show. Try changing your filters or check back later!'}
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={resetAll}
                  className="flex items-center gap-2 rounded-2xl bg-sage-100 px-6 py-3 font-semibold text-sage-700 hover:bg-sage-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  Start Over
                </button>
                {favorites.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setView('favorites')}
                    className="flex items-center gap-2 rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white hover:bg-sage-600"
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Background card */}
              {filteredPets[1] && (
                <div className="absolute inset-0 scale-[0.95] opacity-60">
                  <SwipeCard
                    pet={filteredPets[1]}
                    onSwipeLeft={() => {}}
                    onSwipeRight={() => {}}
                    onInfo={() => {}}
                    isTop={false}
                  />
                </div>
              )}
              {/* Top card */}
              <SwipeCard
                key={filteredPets[0].id}
                pet={filteredPets[0]}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                onInfo={() => setDetailPet(filteredPets[0])}
                isTop={true}
              />
            </>
          )}
        </div>
      </main>

      {/* Bottom bar */}
      <footer className="flex items-center justify-center gap-6 px-5 pb-6 pt-2">
        {passed.length > 0 && (
          <button
            type="button"
            onClick={handleUndo}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-gray-600"
          >
            <RotateCcw className="h-4 w-4" />
            Undo
          </button>
        )}
        <p className="text-sm text-gray-400">
          {filteredPets.length} {filteredPets.length === 1 ? 'pet' : 'pets'} nearby
        </p>
      </footer>

      {/* Detail modal */}
      {detailPet && (
        <PetDetail
          pet={detailPet}
          onClose={() => setDetailPet(null)}
          onFavorite={() => {
            if (favorites.some((f) => f.id === detailPet.id)) {
              handleRemoveFavorite(detailPet.id);
            } else {
              setFavorites((prev) => [...prev, detailPet]);
            }
          }}
          isFavorited={favorites.some((f) => f.id === detailPet.id)}
        />
      )}

      {/* Match toast */}
      <MatchToast pet={lastSaved} onDismiss={() => setLastSaved(null)} />

      {/* Keyboard shortcuts (desktop only) */}
      <KeyboardHints
        onLeft={handleSwipeLeft}
        onRight={handleSwipeRight}
        onInfo={() => filteredPets[0] && setDetailPet(filteredPets[0])}
        onUndo={handleUndo}
        enabled={view === 'swipe' && filteredPets.length > 0 && !detailPet}
      />
    </div>
  );
}
