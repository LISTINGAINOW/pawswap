'use client';

import { useState, useCallback } from 'react';
import { Heart, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import SwipeCard from '@/components/SwipeCard';
import PetDetail from '@/components/PetDetail';
import FavoritesList from '@/components/FavoritesList';
import FilterPanel from '@/components/FilterPanel';
import { mockPets, Pet } from '@/data/pets';

type View = 'swipe' | 'favorites' | 'filters';
type AnimalFilter = 'all' | 'dog' | 'cat';
type SizeFilter = 'all' | 'Small' | 'Medium' | 'Large' | 'Extra Large';

export default function Home() {
  const [view, setView] = useState<View>('swipe');
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailPet, setDetailPet] = useState<Pet | null>(null);
  const [animalFilter, setAnimalFilter] = useState<AnimalFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');

  const filteredPets = mockPets.filter((pet) => {
    if (animalFilter !== 'all' && pet.type !== animalFilter) return false;
    if (sizeFilter !== 'all' && pet.size !== sizeFilter) return false;
    if (favorites.some((f) => f.id === pet.id)) return false;
    if (passed.includes(pet.id)) return false;
    return true;
  });

  const handleSwipeRight = useCallback(() => {
    const pet = filteredPets[0];
    if (pet) {
      setFavorites((prev) => [...prev, pet]);
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

  if (view === 'filters') {
    return (
      <FilterPanel
        animalFilter={animalFilter}
        sizeFilter={sizeFilter}
        onAnimalChange={setAnimalFilter}
        onSizeChange={setSizeFilter}
        onBack={() => setView('swipe')}
        onReset={() => {
          setAnimalFilter('all');
          setSizeFilter('all');
        }}
        resultCount={mockPets.filter((pet) => {
          if (animalFilter !== 'all' && pet.type !== animalFilter) return false;
          if (sizeFilter !== 'all' && pet.size !== sizeFilter) return false;
          return true;
        }).length}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-sage-50">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pb-2 pt-4 safe-bottom">
        <button
          type="button"
          onClick={() => setView('filters')}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-700">
            🐾 PawSwap
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setView('favorites')}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
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
    </div>
  );
}
