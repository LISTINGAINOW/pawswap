import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Handshake, Megaphone, HeartHandshake, Sparkles, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Partner with Pupular | Creators, Affiliates, Shelters & Pet Brands',
  description: 'Apply to partner with Pupular through creator campaigns, affiliate and value-add offers, shelter spotlights, and pet-care brand collaborations.',
};

const partnerTracks = [
  {
    icon: <Megaphone className="h-6 w-6 text-coral-500" />,
    title: 'Creators & ambassadors',
    description:
      'For pet creators, rescue advocates, foster accounts, and local community voices who want co-branded campaigns, giveaway ideas, or custom referral links.',
    bullets: [
      'Creator-friendly referral links for app installs or landing pages',
      'Co-branded story ideas, reels hooks, and shelter spotlight concepts',
      'Flexible pilot conversations instead of a one-size-fits-all package',
    ],
    email: 'partners@pupular.app?subject=Creator%20partnership%20with%20Pupular',
    cta: 'Apply as a creator',
  },
  {
    icon: <HeartHandshake className="h-6 w-6 text-sage-600" />,
    title: 'Shelters, rescues & community orgs',
    description:
      'For shelters, rescue groups, student orgs, or local adoption events that want launch help, featured placements, or collaborative awareness pushes.',
    bullets: [
      'Launch support for new shelter pages and event promotion',
      'Shared campaign concepts for adoption weekends or themed spotlights',
      'A simple contact path for rollout planning and future tooling feedback',
    ],
    email: 'shelters@pupular.app?subject=Community%20partnership%20with%20Pupular',
    cta: 'Talk shelter partnerships',
  },
  {
    icon: <Sparkles className="h-6 w-6 text-amber-500" />,
    title: 'Pet-care & value-add partners',
    description:
      'For insurance, food, toy, training, vet, and new-pet-checklist brands that can add real value to adopters without turning the experience into a billboard.',
    bullets: [
      'Editorial partner pages and resource guides for adopters',
      'Affiliate or revenue-share conversations where the offer genuinely helps users',
      'Clear disclosure expectations on commercial links and sponsored placements',
    ],
    email: 'partners@pupular.app?subject=Pet-care%20brand%20partnership%20with%20Pupular',
    cta: 'Pitch a value-add offer',
  },
];

const ideas = [
  'Referral links for creators, rescues, and event partners',
  'Shelter launch kits with suggested social copy and share assets',
  'Useful partner pages like insurance, checklists, and new-adopter tools',
  'Co-marketed adoption weekends, giveaways, or local city launches',
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Partner with Pupular</h1>
            <p className="text-sm text-gray-500">Creators, shelters, affiliates, and pet-care brands</p>
          </div>
        </div>

        <div className="mb-8 rounded-3xl bg-gradient-to-br from-sage-600 to-sage-700 p-7 text-white shadow-sm">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Handshake className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Let&apos;s grow Pupular the useful way</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-sage-100">
            We want partnerships that help more pets get discovered and give adopters something genuinely valuable — not random ad clutter. If you can help with reach, trust, or new-adopter support, let&apos;s talk.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="mailto:partners@pupular.app?subject=Partnership%20idea%20for%20Pupular"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-sage-700 transition hover:bg-sage-50"
            >
              Pitch a partnership →
            </a>
            <Link
              href="/insurance"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              See a live value-add page
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <h3 className="text-lg font-bold text-gray-900">What we&apos;re actively open to</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {ideas.map((idea) => (
              <li key={idea} className="rounded-2xl bg-sage-50 px-4 py-3 text-sm text-gray-700 ring-1 ring-sage-100">
                {idea}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {partnerTracks.map((track) => (
            <section key={track.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-50">
                {track.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{track.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{track.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {track.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="mt-1 text-sage-600">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
              <a
                href={`mailto:${track.email}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-sage-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sage-600"
              >
                {track.cta}
              </a>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-200">
          <h3 className="text-lg font-bold text-gray-900">Affiliate/value-add rule</h3>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            If a link is commercial, it should still be useful on its own. That means real relevance for new adopters, clear disclosure, and no junk offers that make the app feel spammy.
          </p>
        </div>
      </div>
    </div>
  );
}
