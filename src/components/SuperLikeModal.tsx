'use client';

import { useState } from 'react';
import { X, Star, Send, Heart, Phone } from 'lucide-react';
import Image from 'next/image';
import type { Pet } from '@/data/pets';

interface Props {
  pet: Pet;
  onClose: () => void;
  onSend: () => void;
}

export default function SuperLikeModal({ pet, onClose, onSend }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    `Hi! I found ${pet.name} on Pupular and I'm very interested in adopting. I'd love to schedule a visit to meet ${pet.gender === 'Male' ? 'him' : 'her'}. When would be a good time?`
  );
  const [sent, setSent] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      onSend();
    }, 2500);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative z-10 mx-4 w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Heart className="h-10 w-10 fill-green-500 text-green-500" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-gray-900">Inquiry Sent! 🎉</h2>
          <p className="mt-2 text-gray-500">
            {pet.shelter} will get your message about {pet.name}. They usually respond within 24-48 hours.
          </p>
          <p className="mt-4 text-sm text-sage-600">
            We also saved {pet.name} to your favorites ❤️
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white sm:rounded-3xl">
        {/* Header with pet preview */}
        <div className="relative flex items-center gap-4 border-b border-gray-100 p-5">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl">
            <Image src={imgError ? '/placeholder-pet.png' : pet.photo} alt={pet.name} fill className="object-cover" onError={() => setImgError(true)} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <h2 className="text-lg font-bold text-gray-900">Super Like {pet.name}!</h2>
            </div>
            <p className="text-sm text-gray-500">Send an adoption inquiry to {pet.shelter}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full bg-gray-100 p-2">
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gray-400">Your name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-sage-400 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gray-400">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-sage-400 focus:bg-white"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gray-400">Phone (optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(310) 555-0000"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-sage-400 focus:bg-white"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-gray-400">Message to shelter *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-sage-400 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sage-500 to-sage-600 py-4 text-lg font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            <Send className="h-5 w-5" />
            Send Inquiry
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            The shelter will receive your info and message. You can also call them directly at{' '}
            <a href={`tel:${pet.shelterPhone}`} className="text-sage-500 hover:underline">
              {pet.shelterPhone}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
