'use client';

import { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';

interface Props {
  onLocationSet: (location: { lat: number; lng: number; label: string }) => void;
}

export default function LocationPrompt({ onLocationSet }: Props) {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSet({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: 'Near you',
        });
        setLoading(false);
      },
      () => {
        setError('Could not get your location. Try entering a zip code instead.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.match(/^\d{5}$/)) {
      setError('Please enter a valid 5-digit zip code');
      return;
    }
    // For now, use approximate coordinates. With real API, we'd geocode the zip.
    onLocationSet({
      lat: 0,
      lng: 0,
      label: `ZIP ${zipCode}`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sage-50 px-6">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="mb-2 text-6xl">🐾</div>
        <h1 className="text-4xl font-bold text-sage-700">Pupular</h1>
        <p className="mt-2 text-lg text-gray-500">Find your new best friend</p>

        <div className="mt-10 space-y-4">
          {/* Use my location */}
          <button
            type="button"
            onClick={handleGeolocation}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white transition hover:bg-sage-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Navigation className="h-5 w-5" />
            )}
            {loading ? 'Finding you...' : 'Use My Location'}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Zip code */}
          <form onSubmit={handleZipSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{5}"
                maxLength={5}
                placeholder="Enter zip code"
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                className="w-full rounded-2xl border-2 border-gray-200 bg-white py-4 pl-12 pr-4 text-lg outline-none transition focus:border-sage-400"
              />
            </div>
            <button
              type="submit"
              className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-warm-100 text-warm-600 transition hover:bg-warm-200"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        <p className="mt-8 text-xs text-gray-400">
          We use your location to find adoptable pets nearby.
          <br />Your location is never stored or shared.
        </p>
      </div>
    </div>
  );
}
