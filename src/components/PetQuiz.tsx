'use client';

import { useState } from 'react';
import { ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { mockPets, Pet } from '@/data/pets';

interface Props {
  onComplete: (matches: Pet[]) => void;
  onSkip: () => void;
}

interface Answer {
  question: number;
  value: string;
}

const questions = [
  {
    id: 1,
    text: 'What kind of energy are you looking for?',
    emoji: '⚡',
    options: [
      { value: 'chill', label: 'Couch potato vibes', emoji: '🛋️', desc: 'Low energy, loves to relax' },
      { value: 'moderate', label: 'Go with the flow', emoji: '🌊', desc: 'Active but not hyper' },
      { value: 'active', label: 'Adventure buddy', emoji: '🏔️', desc: 'Needs daily exercise' },
      { value: 'chaos', label: 'Bring the chaos', emoji: '🌪️', desc: 'Puppy/kitten energy!' },
    ],
  },
  {
    id: 2,
    text: 'Who lives in your home?',
    emoji: '🏠',
    options: [
      { value: 'solo', label: 'Just me', emoji: '🧑', desc: 'Solo living' },
      { value: 'couple', label: 'Me + partner', emoji: '👫', desc: 'Two adults' },
      { value: 'family', label: 'Family with kids', emoji: '👨‍👩‍👧‍👦', desc: 'Little ones around' },
      { value: 'roommates', label: 'Roommates', emoji: '🏘️', desc: 'Multiple adults' },
    ],
  },
  {
    id: 3,
    text: 'Do you have other pets?',
    emoji: '🐾',
    options: [
      { value: 'none', label: 'No pets', emoji: '✨', desc: 'First-time pet parent or starting fresh' },
      { value: 'dog', label: 'I have a dog', emoji: '🐕', desc: 'Need cat/dog that\'s dog-friendly' },
      { value: 'cat', label: 'I have a cat', emoji: '🐈', desc: 'Need pet that\'s cat-friendly' },
      { value: 'both', label: 'Dogs and cats', emoji: '🐾', desc: 'Full house!' },
    ],
  },
  {
    id: 4,
    text: 'How much space do you have?',
    emoji: '📐',
    options: [
      { value: 'apartment', label: 'Apartment/studio', emoji: '🏢', desc: 'Smaller space, no yard' },
      { value: 'house-small', label: 'House, small yard', emoji: '🏡', desc: 'Some outdoor space' },
      { value: 'house-big', label: 'House, big yard', emoji: '🌳', desc: 'Plenty of room to run' },
      { value: 'ranch', label: 'Rural/acreage', emoji: '🏜️', desc: 'Wide open spaces' },
    ],
  },
  {
    id: 5,
    text: 'What\'s your personality match?',
    emoji: '💜',
    options: [
      { value: 'cuddly', label: 'Velcro pet', emoji: '🤗', desc: 'Follows me everywhere' },
      { value: 'independent', label: 'Independent spirit', emoji: '😎', desc: 'Does their own thing' },
      { value: 'playful', label: 'Class clown', emoji: '🤡', desc: 'Makes me laugh daily' },
      { value: 'gentle', label: 'Old soul', emoji: '🕊️', desc: 'Calm and wise' },
    ],
  },
];

function scorePet(pet: Pet, answers: Answer[]): number {
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

export default function PetQuiz({ onComplete, onSkip }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, { question: question.id, value }];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Score all pets and return top matches
      const scored = mockPets.map((pet) => ({
        pet,
        score: scorePet(pet, newAnswers),
      }));
      scored.sort((a, b) => b.score - a.score);
      onComplete(scored.slice(0, 5).map((s) => s.pet));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-sage-50 px-6 py-8">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          {currentQ > 0 ? (
            <button
              type="button"
              onClick={() => {
                setCurrentQ(currentQ - 1);
                setAnswers(answers.slice(0, -1));
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Skip quiz
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="h-2 overflow-hidden rounded-full bg-sage-200">
            <div
              className="h-full rounded-full bg-sage-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            Question {currentQ + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="mb-8 text-center">
          <span className="text-5xl">{question.emoji}</span>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">{question.text}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleAnswer(opt.value)}
              className="flex w-full items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-sage-400 hover:shadow-sm active:scale-[0.98]"
            >
              <span className="text-3xl">{opt.emoji}</span>
              <div>
                <p className="font-semibold text-gray-900">{opt.label}</p>
                <p className="text-sm text-gray-500">{opt.desc}</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
