import type { Pet } from '@/data/pets';

export const PUPULAR_SITE_URL = 'https://www.pupular.app';

export function getPetPath(id: string): string {
  return `/animal/${encodeURIComponent(id)}`;
}

export function getPetUrl(id: string, refCode?: string | null): string {
  const base = `${PUPULAR_SITE_URL}${getPetPath(id)}`;
  if (!refCode) return base;
  return `${base}?ref=${encodeURIComponent(refCode)}`;
}

export function getInviteUrl(refCode?: string | null): string {
  if (!refCode) return PUPULAR_SITE_URL;
  return `${PUPULAR_SITE_URL}/?ref=${encodeURIComponent(refCode)}`;
}

export function getPetShareText(pet: Pet, options?: { context?: 'default' | 'wingman' | 'pet-of-the-day' }) {
  const typeEmoji = pet.type === 'dog' ? '🐕' : '🐈';

  if (options?.context === 'wingman') {
    return `I'm thinking about adopting ${pet.name} ${typeEmoji} — a ${pet.age} ${pet.breed}. Can you help me decide?`;
  }

  if (options?.context === 'pet-of-the-day') {
    return `⭐ Today's Pet of the Day on Pupular: Meet ${pet.name} ${typeEmoji}! ${pet.age} ${pet.breed} looking for a forever home.`;
  }

  return `Meet ${pet.name} ${typeEmoji} — ${pet.age} ${pet.breed} looking for a forever home! Check them out on Pupular 🐾`;
}
