'use client';

import { Phone, MapPin, Clock } from 'lucide-react';
import type { Pet } from '@/data/pets';

interface ShelterGroup {
  name: string;
  phone: string;
  address: string;
  hours: string;
  pets: Pet[];
}

interface Props {
  favorites: Pet[];
}

export default function ShelterMap({ favorites }: Props) {
  if (favorites.length === 0) return null;

  // Group favorites by shelter
  const shelterMap = new Map<string, ShelterGroup>();
  for (const pet of favorites) {
    if (!shelterMap.has(pet.shelter)) {
      shelterMap.set(pet.shelter, {
        name: pet.shelter,
        phone: pet.shelterPhone,
        address: pet.shelterAddress,
        hours: pet.shelterHours,
        pets: [],
      });
    }
    shelterMap.get(pet.shelter)!.pets.push(pet);
  }

  const shelters = Array.from(shelterMap.values()).sort(
    (a, b) => b.pets.length - a.pets.length
  );

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
          Shelters to Visit
        </h2>
        <span className="text-xs text-gray-400">{shelters.length} {shelters.length === 1 ? 'shelter' : 'shelters'}</span>
      </div>
      <div className="space-y-3">
        {shelters.map((shelter) => (
          <div key={shelter.name} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            {/* Shelter name + pet count */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-gray-900">{shelter.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-sage-600">
                  {shelter.pets.length} saved {shelter.pets.length === 1 ? 'pet' : 'pets'}:&nbsp;
                  {shelter.pets.map((p) => p.name).join(', ')}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-sage-100 px-2.5 py-1 text-xs font-bold text-sage-700">
                {shelter.pets.length} {shelter.pets.length === 1 ? 'pet' : 'pets'}
              </span>
            </div>

            {/* Contact info */}
            <div className="mt-3 space-y-2">
              {shelter.phone && (
                <a
                  href={`tel:${shelter.phone}`}
                  className="flex items-center gap-2 text-sm text-sage-600 transition hover:text-sage-700"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{shelter.phone}</span>
                </a>
              )}
              {shelter.address && (
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(shelter.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-sky-600 transition hover:text-sky-700"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{shelter.address}</span>
                </a>
              )}
              {shelter.hours && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>{shelter.hours}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
