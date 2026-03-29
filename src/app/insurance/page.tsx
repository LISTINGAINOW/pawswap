import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Pet Insurance for New Adopters 2026 | Pupular',
  description: 'Compare top pet insurance plans for your newly adopted dog or cat. Get coverage from $10/month with Lemonade, Trupanion, and Healthy Paws.',
};

interface Provider {
  name: string;
  tagline: string;
  price: string;
  logo: string;
  features: string[];
  cta: string;
  url: string;
  accent: string;
}

const providers: Provider[] = [
  {
    name: 'Lemonade',
    tagline: 'Instant claims, AI-powered',
    price: 'From $10/mo',
    logo: '🍋',
    features: [
      'Sign up in 90 seconds',
      'Instant claim reimbursement',
      'Covers accidents & illness',
    ],
    cta: 'Get a Free Quote',
    url: 'https://www.lemonade.com/pet?utm_source=pupular',
    accent: 'bg-pink-50 border-pink-200',
  },
  {
    name: 'Trupanion',
    tagline: '90% coverage, no payout caps',
    price: 'From $25/mo',
    logo: '🐾',
    features: [
      '90% of eligible costs covered',
      'Pays vet directly — no upfront cost',
      'Covers hereditary conditions',
    ],
    cta: 'Get a Free Quote',
    url: 'https://trupanion.com/?utm_source=pupular',
    accent: 'bg-blue-50 border-blue-200',
  },
  {
    name: 'Healthy Paws',
    tagline: 'No annual or lifetime caps',
    price: 'From $15/mo',
    logo: '🌿',
    features: [
      'Unlimited lifetime benefits',
      'Fast 2-day claim processing',
      'Covers cancer, hereditary & more',
    ],
    cta: 'Get a Free Quote',
    url: 'https://www.healthypawspetinsurance.com/?utm_source=pupular',
    accent: 'bg-green-50 border-green-200',
  },
];

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pet Insurance</h1>
            <p className="text-sm text-gray-500">Compare plans for new adopters</p>
          </div>
        </div>

        {/* Hero */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-sage-100 to-sage-50 p-6 text-center ring-1 ring-sage-200">
          <div className="mb-3 flex justify-center">
            <Shield className="h-10 w-10 text-sage-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Protect Your New Best Friend 🛡️</h2>
          <p className="mt-2 text-sm text-gray-600">
            Unexpected vet bills average $800–$1,500. Pet insurance keeps those costs manageable so you can always say yes to your pet&apos;s care.
          </p>
          <p className="mt-3 text-sm font-semibold text-sage-700">Best time to enroll: before the first vet visit</p>
        </div>

        {/* Providers */}
        <div className="space-y-4">
          {providers.map((p) => (
            <div key={p.name} className={`rounded-2xl border bg-white p-5 shadow-sm ${p.accent}`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{p.logo}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.tagline}</p>
                  </div>
                </div>
                <span className="rounded-full bg-sage-100 px-3 py-1 text-sm font-bold text-sage-700">
                  {p.price}
                </span>
              </div>
              <ul className="mb-4 space-y-1.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 text-green-500 font-bold shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-500 py-3 text-sm font-semibold text-white transition hover:bg-sage-600"
              >
                {p.cta}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Checklist CTA */}
        <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-black/5 text-center">
          <p className="text-sm font-semibold text-gray-700">Ready for the next step?</p>
          <p className="mt-1 text-sm text-gray-500">Check off insurance on your adoption prep list</p>
          <Link
            href="/checklist"
            className="mt-3 inline-flex items-center gap-2 rounded-xl bg-sage-100 px-5 py-2.5 text-sm font-semibold text-sage-700 transition hover:bg-sage-200"
          >
            ✅ Back to Adoption Checklist
          </Link>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-[11px] text-gray-400">
          Pupular may earn a commission from partner links at no extra cost to you. Prices shown are estimates and may vary based on your pet&apos;s age, breed, and location.
        </p>
      </div>
    </div>
  );
}
