import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Heart, TrendingUp, Users, BarChart2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'List Your Shelter Pets on Pupular — Free | For Shelters',
  description: 'List shelter pets on Pupular for free. Reach mobile-first adopters, share your available animals, and start a shelter partnership conversation.',
};

const steps = [
  { step: '1', title: 'Sign Up Free', desc: 'Create your shelter account in minutes. No credit card required.' },
  { step: '2', title: 'Upload Your Pets', desc: 'Add photos, bios, and adoption details for each available animal.' },
  { step: '3', title: 'Get Matched with Adopters', desc: "Adopters swipe through pets and save their favorites. You'll get inquiries from people who already love your animals." },
];

const benefits = [
  {
    icon: <Users className="h-6 w-6 text-sage-500" />,
    title: 'Reach mobile-first adopters',
    desc: 'Pupular is designed for people who would rather swipe through pets on their phone than search a directory.',
  },
  {
    icon: <Heart className="h-6 w-6 text-rose-400" />,
    title: 'Give every animal a warmer first impression',
    desc: 'Photos, personality, and a swipe-friendly format help adopters connect before they ever click through to your shelter.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-amber-500" />,
    title: 'Start free, expand when it makes sense',
    desc: 'Free listings keep the barrier low. If featured programs become useful, we can scope them together.',
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
    title: 'Built for iterative rollout',
    desc: 'We are actively shaping shelter tooling with partners, including better analytics, featured placement, and easier onboarding.',
  },
];

const highlights = [
  { value: 'Free', label: 'basic listing conversations' },
  { value: 'Mobile-first', label: 'pet discovery experience' },
  { value: 'Human help', label: 'during onboarding and launch' },
];

export default function ForSheltersPage() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">For Shelters</h1>
            <p className="text-sm text-gray-500">Free listings, real adopters</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-sage-500 to-sage-600 p-7 text-white text-center">
          <div className="mb-3 text-4xl">🐾</div>
          <h2 className="text-2xl font-black">List Your Pets on Pupular — Free</h2>
          <p className="mt-2 text-sage-100 text-sm">
            Join shelters using Pupular to connect adoptable pets with the right families through swipe-based matching.
          </p>
          <a
            href="mailto:shelters@pupular.app?subject=I want to list my shelter"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-sage-700 transition hover:bg-sage-50"
          >
            Join Pupular Free →
          </a>
        </div>

        {/* Highlights */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {highlights.map((s) => (
            <div key={s.label} className="rounded-xl bg-white p-4 text-center ring-1 ring-black/5">
              <p className="text-xl font-black text-sage-600">{s.value}</p>
              <p className="mt-0.5 text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">How It Works</h2>
          <div className="space-y-3">
            {steps.map((s) => (
              <div key={s.step} className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-black/5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-500 font-bold text-white text-sm">
                  {s.step}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{s.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Why Pupular</h2>
          <div className="space-y-3">
            {benefits.map((b) => (
              <div key={b.title} className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-black/5">
                <div className="shrink-0 mt-0.5">{b.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{b.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mb-6 rounded-2xl bg-white p-6 ring-1 ring-black/5 text-center">
          <h3 className="text-lg font-bold text-gray-900">Ready to find your pets their forever homes?</h3>
          <p className="mt-1 text-sm text-gray-500">
            Email us to get your shelter listed and tell us how you currently manage pet data. We&apos;ll help you figure out the cleanest rollout path.
          </p>
          <a
            href="mailto:shelters@pupular.app?subject=I want to list my shelter"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sage-500 py-3.5 text-sm font-bold text-white transition hover:bg-sage-600"
          >
            Join Pupular Free →
          </a>
        </div>

        {/* Upsell to featured */}
        <div className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200 text-center">
          <p className="text-sm font-semibold text-amber-800">Want more visibility?</p>
          <p className="mt-1 text-sm text-amber-700">
            Explore featured shelter partnerships, launch support, and future visibility options.
          </p>
          <Link
            href="/shelters/promote"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-amber-500"
          >
            ⭐ See Featured Plans →
          </Link>
        </div>
      </div>
    </div>
  );
}
