'use client';

import { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';

interface Props {
  onLocationSet: (location: { lat: number; lng: number; label: string; zipCode?: string }) => void;
}

// Validate zip code: 5 digits, non-empty
function validateZip(zip: string): string | null {
  if (!zip.trim()) return 'Please enter a zip code';
  if (!/^\d{5}$/.test(zip)) return 'Please enter a valid 5-digit US zip code';
  // Basic sanity: zip codes 00001–99999
  const n = parseInt(zip);
  if (n < 1 || n > 99999) return 'Please enter a valid zip code';
  return null;
}

export default function LocationPrompt({ onLocationSet }: Props) {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
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
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError('No problem! Enter your zip code below to find pets near you.');
        } else {
          setError('Could not get your location. Please try entering a zip code.');
        }
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateZip(zipCode);
    if (validationError) {
      setError(validationError);
      return;
    }
    onLocationSet({
      lat: 0,
      lng: 0,
      label: `ZIP ${zipCode}`,
      zipCode,
    });
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize: only allow digits, max 5
    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(sanitized);
    if (error) setError('');
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
            aria-label={loading ? 'Finding your location…' : 'Use my current location'}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-sage-500 py-4 text-lg font-semibold text-white transition hover:bg-sage-600 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
            ) : (
              <Navigation className="h-5 w-5" aria-hidden="true" />
            )}
            {loading ? 'Finding you…' : 'Use My Location'}
          </button>

          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Zip code */}
          <form onSubmit={handleZipSubmit} className="flex gap-2" noValidate>
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="Enter zip code"
                value={zipCode}
                onChange={handleZipChange}
                aria-label="Zip code"
                aria-describedby={error ? 'zip-error' : undefined}
                aria-invalid={!!error}
                autoComplete="postal-code"
                className={`w-full rounded-2xl border-2 bg-white py-4 pl-12 pr-4 text-lg outline-none transition ${
                  error ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-sage-400'
                }`}
              />
            </div>
            <button
              type="submit"
              aria-label="Search by zip code"
              disabled={zipCode.length !== 5}
              className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-warm-100 text-warm-600 transition hover:bg-warm-200 disabled:opacity-40"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>

          {error && (
            <p id="zip-error" role="alert" className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        <p className="mt-8 text-xs text-gray-400">
          We show pets near you — no location data is sent to our servers.
          <br />Your location is stored locally on your device to remember your preference. It is never shared with third parties.
        </p>
      </div>
    </div>
  );
}
