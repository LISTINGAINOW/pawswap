'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import { safeGet, safeGetJSON, safeSetJSON } from '@/utils/storage';
import { trackEvent } from '@/lib/analytics';
import { hapticSuccess } from '@/lib/haptics';
import type { Pet } from '@/data/pets';

interface JourneyStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  reward: string;
  autoCheck?: boolean;
  autoCheckFn?: () => boolean;
}

const STEPS: JourneyStep[] = [
  {
    id: 'download',
    label: 'Download Pupular',
    description: "You joined the Pupular community 🎉",
    icon: '📱',
    reward: 'Fun fact: Dogs can recognize about 250 words and gestures!',
    autoCheck: true,
  },
  {
    id: 'quiz',
    label: 'Take the Quiz',
    description: 'Complete your personality quiz to find your perfect match',
    icon: '🧠',
    reward: 'Tip: Personality-matched pets are 3× more likely to be a lifelong companion!',
    autoCheckFn: () => safeGet('pupular-quiz-done') === 'true',
  },
  {
    id: 'save5',
    label: 'Save 5 Pets',
    description: 'Save at least 5 pets to your favorites',
    icon: '❤️',
    reward: 'Tip: Comparing pets side-by-side helps you feel confident in your choice!',
    autoCheckFn: () => {
      const favs = safeGetJSON<unknown[]>('pupular-favorites');
      return Array.isArray(favs) && favs.length >= 5;
    },
  },
  {
    id: 'wingman',
    label: 'Ask a Friend',
    description: 'Share a pet with someone you trust for their opinion',
    icon: '👥',
    reward: 'Did you know? Social support increases pet adoption success rates!',
    autoCheckFn: () => safeGet('pupular-wingman-used') === 'true',
  },
  {
    id: 'inquiry',
    label: 'Contact a Shelter',
    description: 'Send an inquiry to a shelter about a pet you love',
    icon: '📬',
    reward: 'Tip: Shelters recommend visiting on weekday mornings for a calmer experience.',
    autoCheckFn: () => safeGet('pupular-inquiry-sent') === 'true',
  },
  {
    id: 'visit',
    label: 'Visit a Shelter',
    description: 'Check this off after meeting a pet in person!',
    icon: '🏠',
    reward: "Amazing! Most adopters meet 2–3 pets before deciding. You're almost there!",
  },
  {
    id: 'adopt',
    label: 'Adopt!',
    description: 'Check this off when you bring your new companion home 🎊',
    icon: '🎉',
    reward: 'CONGRATULATIONS! You changed a life forever. Welcome to the Pupular family! 🐾❤️',
  },
];

interface Props {
  onBack: () => void;
  onAdopt?: (pet?: Pet) => void;
  favorites?: Pet[];
}

export default function AdoptionJourney({ onBack, onAdopt, favorites = [] }: Props) {
  const [manualChecks, setManualChecks] = useState<Record<string, boolean>>({});
  const [shownRewards, setShownRewards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = safeGetJSON<Record<string, boolean>>('pupular-journey-manual') ?? {};
    setManualChecks(saved);
  }, []);

  const isComplete = (step: JourneyStep): boolean => {
    if (step.autoCheck) return true;
    if (step.autoCheckFn) return step.autoCheckFn();
    return manualChecks[step.id] ?? false;
  };

  const completedCount = STEPS.filter(isComplete).length;
  const currentStepIndex = STEPS.findIndex(s => !isComplete(s));

  const toggleManual = (step: JourneyStep) => {
    if (step.autoCheck || step.autoCheckFn) return;
    const newVal = !manualChecks[step.id];
    const updated = { ...manualChecks, [step.id]: newVal };
    setManualChecks(updated);
    safeSetJSON('pupular-journey-manual', updated);

    if (newVal) {
      hapticSuccess();
      setShownRewards(prev => new Set(prev).add(step.id));
      trackEvent('journey_step_complete', { step: step.id });

      if (step.id === 'adopt') {
        onAdopt?.(favorites[0]);
      }
    }
  };

  const stepStatus = (step: JourneyStep, index: number): 'done' | 'current' | 'future' => {
    if (isComplete(step)) return 'done';
    if (index === currentStepIndex) return 'current';
    return 'future';
  };

  return (
    <div className="min-h-screen bg-sage-50">
      <header className="flex items-center gap-3 bg-white px-5 pb-3 pt-4 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full p-2 hover:bg-gray-100"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Adoption Journey 🗺️</h1>
          <p className="text-sm text-gray-400">
            {completedCount} of {STEPS.length} steps complete
          </p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-5 pt-4">
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sage-400 to-green-500 transition-all duration-700"
            style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={STEPS.length}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {Math.round((completedCount / STEPS.length) * 100)}% complete
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3 px-4 py-4">
        {STEPS.map((step, index) => {
          const status = stepStatus(step, index);
          const canToggle = !step.autoCheck && !step.autoCheckFn;
          const isManualDone = canToggle && manualChecks[step.id];

          return (
            <div key={step.id}>
              <button
                type="button"
                onClick={() => canToggle && status !== 'future' && toggleManual(step)}
                disabled={!canToggle || status === 'future'}
                aria-label={`${step.label} — ${status === 'done' ? 'complete' : status}`}
                className={`w-full rounded-2xl p-4 text-left transition-all ${
                  status === 'done'
                    ? 'border-2 border-green-200 bg-green-50'
                    : status === 'current'
                    ? 'border-2 border-amber-300 bg-amber-50 shadow-sm'
                    : 'border-2 border-gray-100 bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{step.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`font-semibold truncate ${
                          status === 'done'
                            ? 'text-green-700'
                            : status === 'current'
                            ? 'text-amber-700'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      {status === 'current' && (
                        <span className="shrink-0 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-white">
                          NOW
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">{step.description}</p>
                  </div>
                  {status === 'done' ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" aria-hidden="true" />
                  ) : (
                    <Circle
                      className={`h-6 w-6 shrink-0 ${
                        status === 'current' ? 'text-amber-400' : 'text-gray-200'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </button>

              {/* Reward message on completion */}
              {(shownRewards.has(step.id) || (isManualDone && shownRewards.has(step.id))) && (
                <div className="mt-1 rounded-xl border border-green-100 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                  🎁 {step.reward}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
