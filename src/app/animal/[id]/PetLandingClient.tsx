'use client';

import { useEffect } from 'react';
import { Share2, UserPlus } from 'lucide-react';
import type { Pet } from '@/data/pets';
import { trackEvent } from '@/lib/analytics';
import { getInviteUrl, getPetShareText, getPetUrl } from '@/lib/pet-links';
import { getOrCreateRefCode, getStoredReferrer, storeReferrer } from '@/lib/referrals';

interface Props {
  pet: Pet;
  refCode?: string;
}

export default function PetLandingClient({ pet, refCode }: Props) {
  useEffect(() => {
    trackEvent('pet_detail_opened', { petId: pet.id, petName: pet.name, context: 'shared_landing' });

    if (!refCode) return;
    const existing = getStoredReferrer();
    if (existing === refCode) return;

    storeReferrer(refCode);
    trackEvent('referral_received', { ref: refCode, petId: pet.id, petName: pet.name });
  }, [pet.id, pet.name, refCode]);

  const handleSharePet = async () => {
    const outboundRef = getOrCreateRefCode();
    const url = getPetUrl(pet.id, outboundRef);
    const text = getPetShareText(pet);

    trackEvent('share_pet', { petId: pet.id, petName: pet.name, context: 'animal_landing' });

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Meet ${pet.name} on Pupular`,
          text,
          url,
        });
        return;
      } catch {
        // fall through to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  const handleInvite = async () => {
    const outboundRef = getOrCreateRefCode();
    const url = getInviteUrl(outboundRef);
    const text = `I found ${pet.name} on Pupular and thought of you. If you're into rescue pets, come swipe with me 🐾`;

    trackEvent('referral_sent', { refCode: outboundRef, petId: pet.id, context: 'animal_landing' });

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Pupular 🐾',
          text,
          url,
        });
        return;
      } catch {
        // fall through to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    }
  };

  return (
    <div className="space-y-3">
      {refCode && (
        <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          Shared with you by a friend of Pupular.
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleSharePet}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-500 px-5 py-3 font-semibold text-white transition hover:bg-sage-600"
        >
          <Share2 className="h-4 w-4" />
          Share this pet
        </button>
        <button
          type="button"
          onClick={handleInvite}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-sage-200 bg-white px-5 py-3 font-semibold text-sage-700 transition hover:bg-sage-50"
        >
          <UserPlus className="h-4 w-4" />
          Invite a friend to Pupular
        </button>
      </div>
    </div>
  )
}
