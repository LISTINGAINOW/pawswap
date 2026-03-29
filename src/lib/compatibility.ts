import type { Pet } from '@/data/pets';

export interface Answer {
  question: number;
  value: string;
}

// Max possible score across all 5 questions
const MAX_QUIZ_SCORE = 16;

export function scorePet(pet: Pet, answers: Answer[]): number {
  let score = 0;
  for (const answer of answers) {
    switch (answer.question) {
      case 1: // Energy
        if (answer.value === 'chill' && pet.traits.some(t => /calm|quiet|nap|low energy|couch/i.test(t))) score += 3;
        if (answer.value === 'moderate' && pet.traits.some(t => /gentle|house-trained|playful/i.test(t))) score += 3;
        if (answer.value === 'active' && pet.traits.some(t => /energetic|exercise|agility|trained/i.test(t))) score += 3;
        if (answer.value === 'chaos' && pet.age.includes('month')) score += 3;
        break;
      case 2: // Household
        if (answer.value === 'family' && pet.goodWith.some(g => /kid/i.test(g))) score += 3;
        if (answer.value === 'solo' && pet.goodWith.some(g => /adult/i.test(g))) score += 2;
        if (answer.value === 'couple' && pet.goodWith.length > 0) score += 2;
        break;
      case 3: // Other pets
        if (answer.value === 'dog' && pet.goodWith.some(g => /dog/i.test(g))) score += 3;
        if (answer.value === 'cat' && pet.goodWith.some(g => /cat/i.test(g))) score += 3;
        if (answer.value === 'both' && pet.goodWith.some(g => /dog/i.test(g)) && pet.goodWith.some(g => /cat/i.test(g))) score += 4;
        if (answer.value === 'none') score += 1;
        break;
      case 4: // Space
        if (answer.value === 'apartment' && (pet.size === 'Small' || pet.size === 'Medium' || pet.type === 'cat')) score += 3;
        if (answer.value === 'house-small' && pet.size !== 'Extra Large') score += 2;
        if (answer.value === 'house-big') score += 2;
        if (answer.value === 'ranch' && (pet.size === 'Large' || pet.size === 'Extra Large')) score += 3;
        break;
      case 5: // Personality
        if (answer.value === 'cuddly' && pet.traits.some(t => /cuddly|velcro|follows|affectionate|snugg/i.test(t))) score += 3;
        if (answer.value === 'independent' && pet.traits.some(t => /independent|quiet/i.test(t))) score += 3;
        if (answer.value === 'playful' && pet.traits.some(t => /playful|energetic|chaotic|brain cell/i.test(t))) score += 3;
        if (answer.value === 'gentle' && pet.traits.some(t => /gentle|calm|quiet|low-maintenance/i.test(t))) score += 3;
        break;
    }
  }
  return score;
}

export function getCompatibilityPct(pet: Pet, answers: Answer[]): number {
  if (answers.length === 0) return 0;
  const score = scorePet(pet, answers);
  return Math.round((score / MAX_QUIZ_SCORE) * 100);
}
