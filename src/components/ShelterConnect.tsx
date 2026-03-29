'use client';

import { useState } from 'react';
import { Calendar, Phone, Clock, MapPin, Send, AlertTriangle } from 'lucide-react';
import type { Pet } from '@/data/pets';
import { trackEvent } from '@/lib/analytics';
import { safeSet } from '@/utils/storage';
import { hapticSuccess } from '@/lib/haptics';

function seededDaysAvailable(petId: string): number {
  let hash = 0;
  for (let i = 0; i < petId.length; i++) {
    hash = (hash << 5) - hash + petId.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 56) + 5; // 5–60 days
}

interface Props {
  pet: Pet;
}

export default function ShelterConnect({ pet }: Props) {
  const [inquirySent, setInquirySent] = useState(false);
  const daysAvailable = seededDaysAvailable(pet.id);
  const isUrgent = daysAvailable < 14;

  const subject = encodeURIComponent(`Interested in adopting ${pet.name}`);
  const body = encodeURIComponent(
    `Hi,\n\nI found ${pet.name} on Pupular and I would love to schedule a visit!\n\n` +
      `${pet.name} is a ${pet.age} ${pet.breed} (${pet.gender}, ${pet.size}).\n\n` +
      `Could you tell me more about the adoption process and available visit times?\n\nThank you!`
  );
  const mailtoUrl = `mailto:${pet.shelterEmail}?subject=${subject}&body=${body}`;

  const handleInquiry = () => {
    hapticSuccess();
    setInquirySent(true);
    safeSet('pupular-inquiry-sent', 'true');
    trackEvent('inquiry_sent', { petId: pet.id, petName: pet.name, shelter: pet.shelter });
    window.location.href = mailtoUrl;
  };

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border-2 border-sage-300 bg-gradient-to-br from-sage-50 to-green-50">
      <div className="flex items-center gap-2 border-b border-sage-200 px-4 py-3">
        <Calendar className="h-5 w-5 text-sage-600" aria-hidden="true" />
        <h3 className="font-bold text-gray-900">Schedule a Visit 📅</h3>
      </div>

      <div className="space-y-2.5 px-4 py-3">
        {isUrgent && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="font-medium">
              Available for about {daysAvailable} more days 💛
            </span>
          </div>
        )}

        <div className="flex items-start gap-3 text-sm text-gray-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-500" aria-hidden="true" />
          <div>
            <p className="font-semibold text-gray-800">{pet.shelter}</p>
            <p>{pet.shelterAddress}</p>
          </div>
        </div>

        {pet.shelterHours && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="h-4 w-4 shrink-0 text-sage-500" aria-hidden="true" />
            {pet.shelterHours}
          </div>
        )}

        <a
          href={`tel:${pet.shelterPhone}`}
          className="flex items-center gap-3 text-sm text-sage-600 hover:underline"
          onClick={() => trackEvent('shelter_clicked', { petId: pet.id, petName: pet.name, type: 'phone' })}
        >
          <Phone className="h-4 w-4 shrink-0 text-sage-500" aria-hidden="true" />
          {pet.shelterPhone}
        </a>
      </div>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleInquiry}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition-all ${
            inquirySent
              ? 'bg-green-100 text-green-700 ring-2 ring-green-200'
              : 'bg-sage-500 text-white hover:bg-sage-600'
          }`}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {inquirySent ? '✅ Inquiry Sent!' : `Send Inquiry to ${pet.shelter}`}
        </button>
      </div>
    </div>
  );
}
