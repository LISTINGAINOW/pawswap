import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Star, BarChart2, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Promote Your Shelter on Pupular | Featured Listings',
  description: 'Get 10x more visibility for your adoptable pets. Featured shelter plans from $49/month. Priority placement, analytics, and Pet of the Day rotation.',
};

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
}

const tiers: PricingTier[] = [
  {
    name: 'Basic',
    price: '$49',
    period: '/mo',
    description: 'Great for small shelters getting started',
    features: [
      '⭐ Featured badge on all your pets',
      'Appear in Featured section',
      'Email support',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$99',
    period: '/mo',
    description: 'Most popular — best value for growing shelters',
    features: [
      '⭐ Featured badge on all your pets',
      'Priority placement at top of swipe stack',
      'Monthly analytics report',
      'Priority email support',
    ],
    cta: 'Get Started',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '$199',
    period: '/mo',
    description: 'Maximum visibility for high-volume shelters',
    features: [
      '⭐ Featured badge on all your pets',
      'Priority placement at top of swipe stack',
      'Pet of the Day rotation',
      'Weekly analytics report',
      'Dedicated account support',
      'Custom shelter profile page',
    ],
    cta: 'Get Started',
    highlight: false,
  },
];

const testimonials = [
  { name: 'Paws & Hearts Rescue', location: 'Austin, TX', quote: "Our adoption inquiries tripled in the first month. The featured placement makes a huge difference." },
  { name: 'Second Chance Animal Shelter', location: 'Denver, CO', quote: "Finally a platform that feels modern. Our pets get seen by people who are actually ready to adopt." },
  { name: 'Happy Tails Humane Society', location: 'Portland, OR', quote: "The analytics helped us understand which pets needed more promotion. Worth every penny." },
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
          <h2 className="text-xl font-bold text-gray-900">Get 10x More Visibility</h2>
          <p className="mt-2 text-sm text-gray-600">
            Featured shelters appear first in the swipe stack and carry a gold badge that signals quality to potential adopters.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/70 p-3">
              <p className="text-xl font-black text-amber-600">10x</p>
              <p className="text-[11px] text-gray-500 mt-0.5">more visibility</p>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <p className="text-xl font-black text-amber-600">3x</p>
              <p className="text-[11px] text-gray-500 mt-0.5">more swipe rights</p>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <p className="text-xl font-black text-amber-600">2x</p>
              <p className="text-[11px] text-gray-500 mt-0.5">faster adoptions</p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">What you get</h2>
          <div className="space-y-3">
            {[
              { icon: <Star className="h-5 w-5 text-amber-500" />, title: 'Featured Badge', desc: 'Gold ⭐ badge on every pet card — stands out instantly in the swipe stack' },
              { icon: <TrendingUp className="h-5 w-5 text-sage-500" />, title: 'Priority Placement', desc: 'Your pets appear first before users see non-featured animals (Pro & Premium)' },
              { icon: <Heart className="h-5 w-5 text-rose-400" />, title: 'Pet of the Day', desc: 'One of your pets featured in the daily spotlight shown to all users (Premium)' },
              { icon: <BarChart2 className="h-5 w-5 text-blue-500" />, title: 'Analytics', desc: 'See impressions, swipe rights, and favorites for each of your pets (Pro & Premium)' },
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

        {/* Pricing */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Pricing</h2>
          <div className="space-y-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative overflow-hidden rounded-2xl p-5 ring-2 ${
                  tier.highlight
                    ? 'bg-sage-500 ring-sage-600 text-white'
                    : 'bg-white ring-black/10'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute right-4 top-4 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-3">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-black ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>{tier.price}</span>
                    <span className={`text-sm ${tier.highlight ? 'text-sage-100' : 'text-gray-400'}`}>{tier.period}</span>
                  </div>
                  <p className={`font-bold text-lg ${tier.highlight ? 'text-white' : 'text-gray-900'}`}>{tier.name}</p>
                  <p className={`text-sm mt-0.5 ${tier.highlight ? 'text-sage-100' : 'text-gray-500'}`}>{tier.description}</p>
                </div>
                <ul className="mb-4 space-y-1.5">
                  {tier.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${tier.highlight ? 'text-white' : 'text-gray-700'}`}>
                      <span className={`shrink-0 font-bold ${tier.highlight ? 'text-sage-200' : 'text-green-500'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:shelters@pupular.app?subject=Featured Shelter Plan"
                  className={`flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition ${
                    tier.highlight
                      ? 'bg-white text-sage-700 hover:bg-sage-50'
                      : 'bg-sage-500 text-white hover:bg-sage-600'
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">What shelters say</h2>
          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl bg-white p-4 ring-1 ring-black/5">
                <p className="text-sm italic text-gray-600">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-2 text-xs font-semibold text-gray-700">{t.name}</p>
                <p className="text-xs text-gray-400">{t.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-sage-500 p-6 text-center text-white">
          <h3 className="text-lg font-bold">Ready to get started?</h3>
          <p className="mt-1 text-sm text-sage-100">Email us and we&apos;ll have you live within 24 hours.</p>
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
