import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Star, BarChart2, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Promote Your Shelter on Pupular | Featured Partnerships',
  description: 'Explore featured shelter partnerships on Pupular, including launch support, spotlight placement, and collaborative promotion options.',
};

interface PartnershipTrack {
  name: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

const tracks: PartnershipTrack[] = [
  {
    name: 'Launch Support',
    description: 'Best for shelters getting listed for the first time',
    features: [
      'Hands-on onboarding conversation',
      'Profile and listing review',
      'Suggested launch copy for your audience',
    ],
    cta: 'Start the conversation',
    highlight: false,
  },
  {
    name: 'Spotlight Partner',
    description: 'For shelters that want coordinated visibility pushes',
    features: [
      'Featured shelter planning',
      'Co-marketing ideas for launches and adoption events',
      'Priority feedback on photos, bios, and shareability',
    ],
    cta: 'Apply for spotlight planning',
    highlight: true,
  },
  {
    name: 'Custom Campaign',
    description: 'For shelters, rescues, or cities planning a bigger moment',
    features: [
      'Custom promo concepting',
      'Event, giveaway, or campaign brainstorming',
      'Flexible pilot scope based on your goals',
    ],
    cta: 'Request a custom plan',
    highlight: false,
  },
];

export default function PromotePage() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link href="/for-shelters" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Promote Your Shelter</h1>
            <p className="text-sm text-gray-500">Featured listings on Pupular</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 p-6 ring-2 ring-amber-200 text-center">
          <div className="mb-2 text-4xl">⭐</div>
          <h2 className="text-xl font-bold text-gray-900">Featured shelter partnerships</h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;re building flexible launch and promotion packages for shelters that want more hands-on support, better visibility, and collaborative marketing ideas.
          </p>
          <div className="mt-4 rounded-xl bg-white/70 p-4 text-left text-sm text-gray-600">
            <p className="font-semibold text-gray-900">Good fit if you want help with:</p>
            <ul className="mt-2 space-y-1.5">
              <li>• Launching your shelter on Pupular with better first-week visibility</li>
              <li>• Running themed adoption pushes, spotlights, or event campaigns</li>
              <li>• Improving the shareability of pet photos, bios, and landing pages</li>
            </ul>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">What you get</h2>
          <div className="space-y-3">
            {[
              { icon: <Star className="h-5 w-5 text-amber-500" />, title: 'Featured placement', desc: 'Reserve space for partner shelter spotlights, launch moments, and higher-visibility placements.' },
              { icon: <TrendingUp className="h-5 w-5 text-sage-500" />, title: 'Launch strategy', desc: 'Get help shaping the first campaign, rollout message, and promotion ideas for your audience.' },
              { icon: <Heart className="h-5 w-5 text-rose-400" />, title: 'Storytelling support', desc: 'Pressure-test pet bios, photo choices, and event concepts so listings feel warmer and more shareable.' },
              { icon: <BarChart2 className="h-5 w-5 text-blue-500" />, title: 'Iteration feedback', desc: 'Work with us on what should be built next, from analytics to shelter tooling and campaign support.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl bg-white p-4 ring-1 ring-black/5">
                <div className="shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership tracks */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Partnership tracks</h2>
          <div className="space-y-4">
            {tracks.map((track) => (
              <div
                key={track.name}
                className={`relative overflow-hidden rounded-2xl p-5 ring-2 ${
                  track.highlight
                    ? 'bg-sage-500 ring-sage-600 text-white'
                    : 'bg-white ring-black/10'
                }`}
              >
                {track.highlight && (
                  <div className="absolute right-4 top-4 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Best for active launch partners
                  </div>
                )}
                <div className="mb-3">
                  <p className={`font-bold text-lg ${track.highlight ? 'text-white' : 'text-gray-900'}`}>{track.name}</p>
                  <p className={`text-sm mt-0.5 ${track.highlight ? 'text-sage-100' : 'text-gray-500'}`}>{track.description}</p>
                </div>
                <ul className="mb-4 space-y-1.5">
                  {track.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${track.highlight ? 'text-white' : 'text-gray-700'}`}>
                      <span className={`shrink-0 font-bold ${track.highlight ? 'text-sage-200' : 'text-green-500'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`mailto:shelters@pupular.app?subject=${encodeURIComponent(`Pupular ${track.name}`)}`}
                  className={`flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${
                    track.highlight
                      ? 'bg-white text-sage-700 hover:bg-sage-50'
                      : 'bg-sage-500 text-white hover:bg-sage-600'
                  }`}
                >
                  {track.cta}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-sage-500 p-6 text-center text-white">
          <h3 className="text-lg font-bold">Ready to get started?</h3>
          <p className="mt-1 text-sm text-sage-100">Email us with your goals, current workflow, and launch timeline. We&apos;ll reply with the best-fit next step.</p>
          <a
            href="mailto:shelters@pupular.app?subject=Featured Shelter Plan"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-sage-700 transition hover:bg-sage-50"
          >
            Contact Us →
          </a>
        </div>
      </div>
    </div>
  );
}
