'use client';

import { useState, useEffect, useCallback } from 'react';
import { Pet, mockPets } from '@/data/pets';

interface UsePetsOptions {
  zipCode?: string;
  type?: 'dog' | 'cat' | 'all';
  size?: string;
  age?: string;
  breed?: string;
  gender?: string;
}

interface UsePetsReturn {
  pets: Pet[];
  loading: boolean;
  error: string | null;
  source: 'live' | 'mock';
  totalAvailable: number;
  loadMore: () => void;
  refresh: () => void;
}

export function usePets(options: UsePetsOptions): UsePetsReturn {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'mock'>('mock');
  const [page, setPage] = useState(1);

  const fetchPets = useCallback(async (pageNum: number, append: boolean) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options.zipCode) params.set('zip', options.zipCode);
      if (options.type && options.type !== 'all') params.set('type', options.type);
      if (options.size && options.size !== 'all') params.set('size', options.size);
      params.set('limit', '20');
      params.set('page', String(pageNum));

      const res = await fetch(`/api/pets?${params}`);
      if (!res.ok) throw new Error('Failed to fetch pets');

      const data = await res.json();

      if (append) {
        setPets(prev => [...prev, ...data.pets]);
      } else {
        setPets(data.pets);
      }
      setSource(data.source);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Could not load pets. Showing demo data.');
      setPets(mockPets);
      setSource('mock');
    } finally {
      setLoading(false);
    }
  }, [options.zipCode, options.type, options.size]);

  useEffect(() => {
    setPage(1);
    fetchPets(1, false);
  }, [fetchPets]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPets(nextPage, true);
  }, [page, fetchPets]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchPets(1, false);
  }, [fetchPets]);

  // Client-side filtering for breed/age/gender (API may not support all filters)
  const filteredPets = pets.filter(pet => {
    if (options.breed && options.breed !== 'all' && pet.breed !== options.breed) return false;
    if (options.gender && options.gender !== 'all' && pet.gender !== options.gender) return false;
    if (options.age && options.age !== 'all') {
      const lower = pet.age.toLowerCase();
      const months = lower.includes('month');
      const years = parseInt(lower) || 0;
      switch (options.age) {
        case 'baby': if (!(months || years < 1)) return false; break;
        case 'young': if (!(!months && years >= 1 && years <= 3)) return false; break;
        case 'adult': if (!(!months && years > 3 && years <= 7)) return false; break;
        case 'senior': if (!(!months && years > 7)) return false; break;
      }
    }
    return true;
  });

  return {
    pets: filteredPets,
    loading,
    error,
    source,
    totalAvailable: filteredPets.length,
    loadMore,
    refresh,
  };
}
