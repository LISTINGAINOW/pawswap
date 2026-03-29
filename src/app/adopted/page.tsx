import Link from 'next/link';
import { mockPets } from '@/data/pets';

// Static social proof page showing adoption stories
export default function AdoptedPage() {
  // Show a handful of pets as "recently adopted" social proof
  const adoptedPets = mockPets.slice(0, 6);

  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">🐾 Happy Adoptions</h1>
          <p className="mt-2 text-gray-500">
            Every adoption changes two lives — the pet&apos;s and yours.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {adoptedPets.map((pet, i) => {
            const daysAgo = [2, 5, 7, 12, 14, 21][i % 6];
            return (
              <div
                key={pet.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pet.photos[0] || pet.photo}
                  alt={`${pet.name} — adopted`}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pet.type === 'dog' ? '🐕' : '🐈'}</span>
                    <p className="font-bold text-gray-900">{pet.name}</p>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {pet.breed} · {pet.age}
                  </p>
                  <div className="mt-2 rounded-lg bg-rose-50 px-2 py-1 text-center">
                    <p className="text-xs font-semibold text-rose-600">
                      🎉 Adopted {daysAgo} days ago
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-2xl">🐾</p>
          <p className="mt-2 font-bold text-gray-900">Your story could be next</p>
          <p className="mt-1 text-sm text-gray-400">
            Find your perfect companion on Pupular
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-sage-500 px-6 py-3 font-semibold text-white hover:bg-sage-600"
          >
            Find My Match
          </Link>
        </div>
      </div>
    </div>
  );
}
