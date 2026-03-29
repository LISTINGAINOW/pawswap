'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Heart, RotateCcw, SlidersHorizontal, MapPin, RefreshCw, Loader2, WifiOff } from 'lucide-react';
import Link from 'next/link';
import OnboardingSlides from '@/components/OnboardingSlides';
import LocationPrompt from '@/components/LocationPrompt';
import { Pet, mockPets } from '@/data/pets';
import { useStreak } from '@/components/DailyStreak';
import { useAchievements, AchievementBadge, TrophyCase, UserStats } from '@/components/Achievements';
import { hapticLight } from '@/lib/haptics';
import { safeGet, safeSet, safeSetJSON, safeGetJSON, pruneStorageIfNeeded } from '@/utils/storage';
import type { Answer } from '@/lib/compatibility';

// Lazy load heavy components
const SwipeCard = dynamic(() => import('@/components/SwipeCard'), { ssr: false });
const PetDetail = dynamic(() => import('@/components/PetDetail'), { ssr: false });
const FavoritesList = dynamic(() => import('@/components/FavoritesList'), { ssr: false });
const FilterPanel = dynamic(() => import('@/components/FilterPanel'), { ssr: false });
const KeyboardHints = dynamic(() => import('@/components/KeyboardHints'), { ssr: false });
const MatchToast = dynamic(() => import('@/components/MatchToast'), { ssr: false });
const PetQuiz = dynamic(() => import('@/components/PetQuiz'), { ssr: false });
// TrendingBar removed from main swipe view (clutters card UX on small screens)
const AdoptionTips = dynamic(() => import('@/components/AdoptionTips'), { ssr: false });
const PetOfTheDay = dynamic(() => import('@/components/PetOfTheDay'), { ssr: false });
const QuizResults = dynamic(() => import('@/components/QuizResults'), { ssr: false });
const DemoBanner = dynamic(() => import('@/components/DemoBanner'), { ssr: false });
const Confetti = dynamic(() => import('@/components/Confetti'), { ssr: false });
// SuccessStories removed from main swipe view (clutters card UX on small screens)
const DailyStreak = dynamic(() => import('@/components/DailyStreak'), { ssr: false });
const PetCompare = dynamic(() => import('@/components/PetCompare'), { ssr: false });
const SwipeStats = dynamic(() => import('@/components/SwipeStats'), { ssr: false });
const QuickReactions = dynamic(() => import('@/components/QuickReactions'), { ssr: false });
const NotificationPrompt = dynamic(() => import('@/components/NotificationPrompt'), { ssr: false });
const BackToTop = dynamic(() => import('@/components/BackToTop'), { ssr: false });
const WelcomeBack = dynamic(() => import('@/components/WelcomeBack'), { ssr: false });

type View = 'onboarding' | 'location' | 'quiz' | 'quiz-results' | 'swipe' | 'favorites' | 'filters';
type AnimalFilter = 'all' | 'dog' | 'cat';
type SizeFilter = 'all' | 'Small' | 'Medium' | 'Large' | 'Extra Large';
type AgeFilter = 'all' | 'baby' | 'young' | 'adult' | 'senior';
type GenderFilter = 'all' | 'Male' | 'Female';

interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  zipCode?: string;
}

export default function Home() {
  const [view, setView] = useState<View>('onboarding');
  const [mounted, setMounted] = useState(false);

  // Data states
  const [allPets, setAllPets] = useState<Pet[]>(mockPets);
  const [dataSource, setDataSource] = useState<'live' | 'mock'>('mock');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [passed, setPassed] = useState<string[]>([]);
  const [detailPet, setDetailPet] = useState<Pet | null>(null);
  const [lastSaved, setLastSaved] = useState<Pet | null>(null);
  const [animalFilter, setAnimalFilter] = useState<AnimalFilter>('all');
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>('all');
  const [breedFilter, setBreedFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('all');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [quizMatches, setQuizMatches] = useState<Pet[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Answer[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [comparePets, setComparePets] = useState<[Pet, Pet] | null>(null);
  const [showTrophyCase, setShowTrophyCase] = useState(false);
  const [totalSwiped, setTotalSwiped] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [heartPulse, setHeartPulse] = useState(false);
  const { streak, recordView } = useStreak();
  const lastSwipeRef = useRef<number>(0);

  // Achievement tracking
  const userStats: UserStats = {
    totalSwiped,
    totalFavorited: favorites.length,
    dogsLoved: favorites.filter(p => p.type === 'dog').length,
    catsLoved: favorites.filter(p => p.type === 'cat').length,
    streakDays: streak.currentStreak,
    quizCompleted: quizDone,
    shareCount,
  };
  const { newAchievement, dismissAchievement, unlockedIds, allAchievements } = useAchievements(userStats);

  // Mount check + restore from localStorage
  useEffect(() => {
    setMounted(true);
    pruneStorageIfNeeded();

    if (safeGet('pupular-onboarded')) setView('location');

    const savedFavs = safeGetJSON<Pet[]>('pupular-favorites');
    if (savedFavs) setFavorites(savedFavs);

    const savedLoc = safeGetJSON<UserLocation>('pupular-location');
    if (savedLoc) {
      setLocation(savedLoc);
      if (safeGet('pupular-onboarded')) setView('swipe');
    }

    const savedPassed = safeGetJSON<string[]>('pupular-passed');
    if (savedPassed) setPassed(savedPassed);

    if (safeGet('pupular-dark') === 'true') setDarkMode(true);

    const savedSwiped = safeGet('pupular-total-swiped');
    if (savedSwiped) setTotalSwiped(parseInt(savedSwiped));
    const savedShares = safeGet('pupular-share-count');
    if (savedShares) setShareCount(parseInt(savedShares));
    if (safeGet('pupular-quiz-done')) setQuizDone(true);
    const savedAnswers = safeGetJSON<Answer[]>('pupular-quiz-answers');
    if (savedAnswers) setQuizAnswers(savedAnswers);

    const savedFilters = safeGetJSON<{
      animalFilter?: AnimalFilter;
      sizeFilter?: SizeFilter;
      breedFilter?: string;
      ageFilter?: AgeFilter;
      genderFilter?: GenderFilter;
    }>('pupular-filters');
    if (savedFilters) {
      if (savedFilters.animalFilter) setAnimalFilter(savedFilters.animalFilter);
      if (savedFilters.sizeFilter) setSizeFilter(savedFilters.sizeFilter);
      if (savedFilters.breedFilter) setBreedFilter(savedFilters.breedFilter);
      if (savedFilters.ageFilter) setAgeFilter(savedFilters.ageFilter);
      if (savedFilters.genderFilter) setGenderFilter(savedFilters.genderFilter);
    }
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    if (mounted) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, mounted]);

  // Persist favorites
  useEffect(() => {
    if (mounted) safeSetJSON('pupular-favorites', favorites);
  }, [favorites, mounted]);

  // Persist swipe progress
  useEffect(() => {
    if (mounted) safeSetJSON('pupular-passed', passed);
  }, [passed, mounted]);

  // Persist dark mode
  useEffect(() => {
    if (mounted) safeSet('pupular-dark', String(darkMode));
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode, mounted]);

  // Persist stats
  useEffect(() => {
    if (mounted) safeSet('pupular-total-swiped', String(totalSwiped));
  }, [totalSwiped, mounted]);
  useEffect(() => {
    if (mounted) safeSet('pupular-share-count', String(shareCount));
  }, [shareCount, mounted]);

  // Fetch pets with exponential backoff (1s → 2s → 4s, max 3 retries)
  const fetchPets = useCallback(async (loc: UserLocation) => {
    setLoading(true);
    setApiError(false);
    setOfflineMode(false);

    const retryDelays = [1000, 2000, 4000];

    for (let attempt = 0; attempt <= retryDelays.length; attempt++) {
      if (attempt > 0) {
        await new Promise<void>((resolve) => setTimeout(resolve, retryDelays[attempt - 1]));
      }
      try {
        const params = new URLSearchParams();
        if (loc.zipCode) params.set('zip', loc.zipCode);
        params.set('limit', '40');
        params.set('page', '1');

        const res = await fetch(`/api/pets?${params}`);
        if (!res.ok) throw new Error(`API ${res.status}`);

        const data = await res.json();
        const pets: Pet[] = data.pets?.length > 0 ? data.pets : mockPets;
        setAllPets(pets);
        setDataSource(data.source || 'mock');
        safeSetJSON('pupular-cached-pets', pets.slice(0, 20));
        setLoading(false);
        return;
      } catch {
        // continue retrying
      }
    }

    // All retries exhausted — try offline cache first
    const cached = safeGetJSON<Pet[]>('pupular-cached-pets');
    if (cached && cached.length > 0) {
      setAllPets(cached);
      setDataSource('mock');
      setOfflineMode(true);
    } else {
      setAllPets(mockPets);
      setDataSource('mock');
      setApiError(true);
    }
    setLoading(false);
  }, []);

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

  const filteredPets = allPets.filter((pet) => {
    if (animalFilter !== 'all' && pet.type !== animalFilter) return false;
    if (sizeFilter !== 'all' && pet.size !== sizeFilter) return false;
    if (breedFilter !== 'all' && pet.breed !== breedFilter) return false;
    if (!matchesAge(pet.age, ageFilter)) return false;
    if (genderFilter !== 'all' && pet.gender !== genderFilter) return false;
    if (favorites.some((f) => f.id === pet.id)) return false;
    if (passed.includes(pet.id)) return false;
    return true;
  });

  // Preload first 2 pet images for smoother transitions
  useEffect(() => {
    filteredPets.slice(0, 2).forEach((pet) => {
      const src = pet.photos[0] || pet.photo;
      if (src) {
        const img = new window.Image();
        img.src = src;
      }
    });
  }, [filteredPets]);

  const handleSwipeRight = useCallback(() => {
    // Throttle: max 1 swipe per 400ms to prevent spam
    const now = Date.now();
    if (now - lastSwipeRef.current < 400) return;
    lastSwipeRef.current = now;

    const pet = filteredPets[0];
    if (pet) {
      setFavorites((prev) => [...prev, pet]);
      setLastSaved(pet);
      setShowConfetti(true);
      setTotalSwiped(n => n + 1);
      recordView();
      setAnnouncement(`Saved ${pet.name} to favorites`);
      setHeartPulse(true);
      setTimeout(() => setHeartPulse(false), 600);
    }
  }, [filteredPets, recordView]);

  const handleSwipeLeft = useCallback(() => {
    // Throttle: max 1 swipe per 400ms to prevent spam
    const now = Date.now();
    if (now - lastSwipeRef.current < 400) return;
    lastSwipeRef.current = now;

    const pet = filteredPets[0];
    if (pet) {
      setPassed((prev) => [...prev, pet.id]);
      setTotalSwiped(n => n + 1);
      recordView();
      setAnnouncement(`Passed on ${pet.name}`);
    }
  }, [filteredPets, recordView]);

  const handleUndo = () => {
    if (passed.length > 0) {
      setPassed((prev) => prev.slice(0, -1));
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const resetAll = () => {
    setPassed([]);
    if (location) fetchPets(location);
  };

  const handleLocationSet = (loc: UserLocation) => {
    setLocation(loc);
    safeSetJSON('pupular-location', loc);
    fetchPets(loc);
    setView('quiz');
  };

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sage-50">
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl animate-bounce">🐾</div>
          <p className="text-lg font-semibold text-sage-600">Loading Pupular...</p>
        </div>
      </div>
    );
  }

  // Onboarding
  if (view === 'onboarding') {
    return (
      <OnboardingSlides
        onComplete={() => {
          safeSet('pupular-onboarded', 'true');
          setView('location');
        }}
      />
    );
  }

  // Quiz
  if (view === 'quiz') {
    return (
      <PetQuiz
        onComplete={(matches, answers) => {
          setQuizMatches(matches);
          setQuizAnswers(answers);
          setQuizDone(true);
          safeSet('pupular-quiz-done', 'true');
          safeSetJSON('pupular-quiz-answers', answers);
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
        onCompare={(pets) => { setComparePets(pets); setView('swipe'); }}
        quizAnswers={quizAnswers}
        quizDone={quizDone}
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
        resultCount={allPets.filter((pet) => {
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
    <div className={`flex min-h-screen flex-col ${darkMode ? 'bg-gray-900' : 'bg-sage-50'}`}>
      {/* Screen reader live announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* Header */}
      <header className={`flex items-center justify-between px-5 pb-2 pt-4 ${darkMode ? 'bg-gray-900' : ''}`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setView('filters')}
            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition hover:shadow-md ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'}`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => { setDarkMode(!darkMode); hapticLight(); }}
            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition hover:shadow-md text-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            onClick={() => { setShowTrophyCase(true); hapticLight(); }}
            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition hover:shadow-md text-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            🏆
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-700">🐾 Pupular</h1>
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
          aria-label={`Favorites${favorites.length > 0 ? `, ${favorites.length} saved` : ''}`}
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:shadow-md"
        >
          <Heart className={`h-5 w-5 transition-all ${favorites.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-600'} ${heartPulse ? 'animate-heart-pulse' : ''}`} />
          {favorites.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {favorites.length}
            </span>
          )}
        </button>
      </header>

      {/* Demo mode banner */}
      <DemoBanner source={dataSource} />

      {/* Welcome back message */}
      <WelcomeBack favoriteCount={favorites.length} />

      {/* Daily streak (#10) */}
      <DailyStreak streak={streak} />

      {/* Pet of the Day */}
      <PetOfTheDay onSelect={(pet) => setDetailPet(pet)} />

      {/* Adoption tip */}
      <AdoptionTips />

      {/* Card stack */}
      <main id="main-content" className="flex flex-1 min-h-0 items-center justify-center px-4 py-2">
        <div className="relative w-full max-w-[380px]" style={{ height: 'clamp(300px, calc(100svh - 370px), 560px)' }}>
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
              <Loader2 className="h-12 w-12 animate-spin text-sage-400" />
              <h2 className="mt-4 text-xl font-bold text-gray-700">Finding pets near you...</h2>
              <p className="mt-2 text-sm text-gray-400">Searching shelters in your area</p>
            </div>
          ) : apiError ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
              <div className="text-6xl">😿</div>
              <h2 className="mt-4 text-2xl font-bold text-gray-800">Couldn't reach the shelter network</h2>
              <p className="mt-2 text-gray-500">Check your connection and try again.</p>
              <button
                type="button"
                onClick={() => location && fetchPets(location)}
                className="mt-6 flex items-center gap-2 rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white hover:bg-sage-600"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : offlineMode ? (
            <div className="absolute -top-8 left-0 right-0 flex items-center justify-center gap-2 rounded-2xl bg-amber-50 px-4 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              <WifiOff className="h-3.5 w-3.5" />
              Offline — showing cached pets
            </div>
          ) : null}
          {!loading && !apiError && filteredPets.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm">
              {/* Differentiate: filters active vs all swiped */}
              {(animalFilter !== 'all' || sizeFilter !== 'all' || breedFilter !== 'all' || ageFilter !== 'all' || genderFilter !== 'all') ? (
                <>
                  <div className="text-6xl">🔍</div>
                  <h2 className="mt-4 text-2xl font-bold text-gray-800">No matches found</h2>
                  <p className="mt-2 text-gray-500">
                    Try broadening your filters — there are lots of amazing pets waiting!
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setAnimalFilter('all');
                        setSizeFilter('all');
                        setBreedFilter('all');
                        setAgeFilter('all');
                        setGenderFilter('all');
                      }}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white hover:bg-sage-600"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Clear All Filters
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('filters')}
                      className="flex items-center justify-center gap-2 rounded-2xl border-2 border-sage-200 px-6 py-3 font-semibold text-sage-600 hover:bg-sage-50"
                    >
                      🎛️ Adjust Filters
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-6xl">🎉</div>
                  <h2 className="mt-4 text-2xl font-bold text-gray-800">You&apos;re all caught up!</h2>
                  <p className="mt-2 text-gray-500">
                    {favorites.length > 0
                      ? `Amazing — you saved ${favorites.length} ${favorites.length === 1 ? 'pet' : 'pets'}! Time to reach out to a shelter.`
                      : "You've seen all the pets nearby. Start over to find more!"}
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={resetAll}
                        className="flex items-center gap-2 rounded-2xl bg-sage-100 px-6 py-3 font-semibold text-sage-700 hover:bg-sage-200"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Start Over
                      </button>
                      {favorites.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setView('favorites')}
                          className="flex items-center gap-2 rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white hover:bg-sage-600"
                        >
                          <Heart className="h-4 w-4" />
                          My Favorites
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setView('quiz')}
                      className="flex items-center justify-center gap-2 rounded-2xl border-2 border-sage-200 px-6 py-3 font-semibold text-sage-600 hover:bg-sage-50"
                    >
                      {quizDone ? '🧠 Retake Quiz' : '🧠 Take the Quiz'}
                    </button>
                  </div>
                </>
              )}
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
                onTakeQuiz={() => setView('quiz')}
                isTop={true}
                quizAnswers={quizAnswers}
                quizDone={quizDone}
              />
            </>
          )}
        </div>
      </main>

      {/* Quick reactions */}
      {filteredPets.length > 0 && (
        <QuickReactions petName={filteredPets[0]?.name || ''} />
      )}

      {/* Swipe stats + milestones */}
      <SwipeStats totalSwiped={totalSwiped} favorites={favorites.length} currentPet={filteredPets[0] || null} />

      {/* Bottom bar */}
      <footer className="flex flex-col items-center gap-1 px-5 pb-4 pt-1">
        <div className="flex items-center justify-center gap-6">
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
        </div>
        <div className="flex items-center gap-3">
          <Link href="/about" className="text-[11px] text-gray-300 hover:text-gray-500 transition">About</Link>
          <span className="text-[11px] text-gray-200">·</span>
          <Link href="/privacy" className="text-[11px] text-gray-300 hover:text-gray-500 transition">Privacy</Link>
          <span className="text-[11px] text-gray-200">·</span>
          <Link href="/terms" className="text-[11px] text-gray-300 hover:text-gray-500 transition">Terms</Link>
        </div>
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

      {/* Confetti on match (#3) */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Pet compare modal (#7) */}
      {comparePets && <PetCompare pets={comparePets} onClose={() => setComparePets(null)} />}

      {/* Achievement badge popup */}
      <AchievementBadge achievement={newAchievement} onDismiss={dismissAchievement} />

      {/* Trophy case modal */}
      {showTrophyCase && <TrophyCase unlockedIds={unlockedIds} onClose={() => setShowTrophyCase(false)} />}

      {/* Notification prompt after 3rd save */}
      <NotificationPrompt favoriteCount={favorites.length} />

      {/* Floating back to top */}
      <BackToTop />

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
