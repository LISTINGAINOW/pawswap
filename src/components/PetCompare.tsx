'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import type { Pet } from '@/data/pets';

interface Props {
  pets: [Pet, Pet];
  onClose: () => void;
}

function CompareRow({ label, left, right }: { label: string; left: string; right: string }) {
  return (
    <div className="flex items-center border-b border-gray-50 py-2.5">
      <span className="w-24 shrink-0 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="flex-1 text-center text-sm text-gray-700">{left}</span>
      <span className="flex-1 text-center text-sm text-gray-700">{right}</span>
    </div>
  );
}

export default function PetCompare({ pets, onClose }: Props) {
  const [a, b] = pets;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-5">
          <h2 className="text-lg font-bold text-gray-900">Compare Pets</h2>
          <button type="button" onClick={onClose} className="rounded-full bg-gray-100 p-2">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Photos */}
        <div className="flex gap-3 p-5">
          {pets.map((pet) => (
            <div key={pet.id} className="flex-1 text-center">
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-2xl">
                <Image src={pet.photo} alt={pet.name} fill className="object-cover" />
              </div>
              <h3 className="mt-2 text-lg font-bold text-gray-900">{pet.name}</h3>
              <p className="text-xs text-gray-500">{pet.type === 'dog' ? '🐕' : '🐈'} {pet.breed}</p>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        <div className="px-5 pb-5">
          <CompareRow label="Age" left={a.age} right={b.age} />
          <CompareRow label="Gender" left={a.gender} right={b.gender} />
          <CompareRow label="Size" left={a.size} right={b.size} />
          <CompareRow label="Distance" left={a.distance} right={b.distance} />
          <CompareRow label="Shelter" left={a.shelter} right={b.shelter} />
          <CompareRow label="Traits" left={a.traits.slice(0, 2).join(', ') || '—'} right={b.traits.slice(0, 2).join(', ') || '—'} />
          <CompareRow label="Good with" left={a.goodWith.join(', ') || '—'} right={b.goodWith.join(', ') || '—'} />
          <CompareRow label="Fee" left={a.adoptionFee || 'Ask shelter'} right={b.adoptionFee || 'Ask shelter'} />
        </div>
      </div>
    </div>
  );
}
