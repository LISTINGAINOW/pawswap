import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Heart, MapPin, Phone, Mail, Shield, ClipboardList } from 'lucide-react';
import { getPetById, mockPets } from '@/data/pets';
import { getPetPath, getPetUrl } from '@/lib/pet-links';
import SupplyChecklist from '@/components/SupplyChecklist';
import PetLandingClient from './PetLandingClient';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ ref?: string }>;
}

function getApplyHref(pet: NonNullable<ReturnType<typeof getPetById>>) {
  if (pet.adoptionUrl && pet.adoptionUrl !== '#') return pet.adoptionUrl;
  if (pet.shelterEmail) {
    const subject = encodeURIComponent(`Interested in adopting ${pet.name}`);
    return `mailto:${pet.shelterEmail}?subject=${subject}`;
  }
  return `tel:${pet.shelterPhone}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pet = getPetById(id);

  if (!pet) {
    return {
      title: 'Pet not found | Pupular',
      description: 'This Pupular pet page could not be found.',
    };
  }

  const title = `Meet ${pet.name} on Pupular`;
  const description = `${pet.name} is a ${pet.age} ${pet.breed} at ${pet.shelter}. View photos, adoption details, and helpful next steps for adopters.`;
  const url = getPetUrl(pet.id);
  const image = pet.photos[0] || pet.photo;

  return {
    title,
    description,
    alternates: {
      canonical: getPetPath(pet.id),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Pupular',
      type: 'website',
      images: [
        {
          url: image,
          alt: `${pet.name} on Pupular`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function generateStaticParams() {
  return mockPets.map((pet) => ({ id: pet.id }));
}

export default async function AnimalPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const pet = getPetById(id);

  if (!pet) notFound();

  const applyHref = getApplyHref(pet);
  const isExternalApply = applyHref.startsWith('http');

  return (
    <div className="min-h-screen bg-sage-50 px-4 pb-24 pt-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sage-600">Pupular pet profile</p>
            <h1 className="text-2xl font-bold text-gray-900">Meet {pet.name}</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="relative aspect-[4/5] w-full bg-sage-100">
              <Image
                src={pet.photos[0] || pet.photo}
                alt={`${pet.name} — ${pet.breed}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-sage-700 shadow-sm">
                {pet.type === 'dog' ? '🐕 Dog' : '🐈 Cat'}
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-gray-900">{pet.name}</h2>
                  <p className="mt-2 text-base text-gray-600">{pet.breed} · {pet.age} · {pet.gender} · {pet.size}</p>
                </div>
                <div className="rounded-2xl bg-sage-50 px-4 py-3 text-right ring-1 ring-sage-100">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sage-700">Adoption fee</p>
                  <p className="mt-1 text-lg font-bold text-gray-900">{pet.adoptionFee}</p>
                </div>
              </div>

              <p className="mt-5 text-base leading-7 text-gray-700">{pet.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {pet.traits.map((trait) => (
                  <span key={trait} className="rounded-full bg-sage-50 px-3 py-1.5 text-sm font-medium text-sage-700 ring-1 ring-sage-100">
                    {trait}
                  </span>
                ))}
              </div>

              {pet.goodWith.length > 0 && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Good with</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {pet.goodWith.map((item) => (
                      <span key={item} className="rounded-full bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700 ring-1 ring-sky-100">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="space-y-5">
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="text-lg font-bold text-gray-900">Take the next step</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Pupular helps you discover pets and share them easily. When you&apos;re ready, continue to the shelter to ask questions or start the adoption process.
              </p>
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={applyHref}
                  target={isExternalApply ? '_blank' : undefined}
                  rel={isExternalApply ? 'noopener noreferrer' : undefined}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-500 px-5 py-3 font-semibold text-white transition hover:bg-sage-600"
                >
                  <ExternalLink className="h-4 w-4" />
                  {isExternalApply ? 'View adoption page' : 'Contact the shelter'}
                </a>
                <Link
                  href="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sage-200 bg-white px-5 py-3 font-semibold text-sage-700 transition hover:bg-sage-50"
                >
                  <Heart className="h-4 w-4" />
                  Keep swiping on Pupular
                </Link>
              </div>
              <div className="mt-5">
                <PetLandingClient pet={pet} refCode={resolvedSearchParams?.ref} />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="text-lg font-bold text-gray-900">Shelter details</h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                  <span>{pet.shelterAddress}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                  <a href={`tel:${pet.shelterPhone}`} className="hover:underline">{pet.shelterPhone}</a>
                </div>
                {pet.shelterEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                    <a href={`mailto:${pet.shelterEmail}`} className="hover:underline">{pet.shelterEmail}</a>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h3 className="text-lg font-bold text-gray-900">Get ready for {pet.name}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Helpful first-week essentials and new-adopter resources, with clear disclosure when a link may earn Pupular a commission.
              </p>
              <div className="mt-4">
                <SupplyChecklist pet={pet} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link href="/insurance" className="rounded-2xl bg-sage-50 px-4 py-3 text-sm font-semibold text-sage-700 ring-1 ring-sage-100 transition hover:bg-sage-100">
                  <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Pet insurance options</span>
                </Link>
                <Link href="/checklist" className="rounded-2xl bg-sage-50 px-4 py-3 text-sm font-semibold text-sage-700 ring-1 ring-sage-100 transition hover:bg-sage-100">
                  <span className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Adoption prep checklist</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
