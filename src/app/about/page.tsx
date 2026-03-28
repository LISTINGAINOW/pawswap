import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8">
      <div className="mx-auto max-w-lg">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to swiping
        </Link>

        <div className="text-center">
          <div className="text-7xl">🐾</div>
          <h1 className="mt-4 text-4xl font-bold text-sage-700">Pupular</h1>
          <p className="mt-2 text-lg text-gray-500">Find your new best friend</p>
        </div>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900">How it works</h2>
            <div className="mt-4 space-y-4">
              <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">👉</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Swipe right</h3>
                  <p className="text-sm text-gray-500">to save a pet to your favorites</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-xl">👈</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Swipe left</h3>
                  <p className="text-sm text-gray-500">to skip (you can always undo)</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xl">ℹ️</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tap info</h3>
                  <p className="text-sm text-gray-500">to see full details, shelter info, and apply to adopt</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">Our mission</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              Every year, millions of pets in shelters wait for someone to choose them. Pupular makes finding your perfect match as easy as a swipe. We partner with shelters and rescue groups to bring you real, adoptable animals near you.
            </p>
            <p className="mt-3 leading-relaxed text-gray-600">
              <strong>Pupular is 100% free.</strong> No ads, no paywalls. Just pets who need homes and humans who need pets.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">For shelters</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              Want your adoptable pets on Pupular? We pull data from RescueGroups.org and Petfinder — if your shelter is listed there, your pets are already here. No extra work needed.
            </p>
          </section>

          <section className="rounded-2xl bg-sage-100 p-6 text-center">
            <Heart className="mx-auto h-8 w-8 text-red-500" />
            <p className="mt-3 font-medium text-sage-700">
              Built with love by the Pupular team
            </p>
            <p className="mt-1 text-sm text-sage-600">
              Every swipe brings an animal one step closer to home.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
