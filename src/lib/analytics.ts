/**
 * Pupular Analytics — client-side event tracking
 *
 * ─────────────────────────────────────────────────────────────────
 * SUCCESS METRICS & CONVERSION FUNNEL
 * ─────────────────────────────────────────────────────────────────
 *
 * CONVERSION FUNNEL (top → bottom):
 *   1. Landing visit           → quiz_started           target: >60%
 *   2. quiz_started            → quiz_completed         target: >70%
 *   3. quiz_completed          → first pet_swiped_right target: >80%
 *   4. pet_swiped_right        → pet_favorited          target: >40%
 *   5. pet_favorited           → shelter_clicked        target: >25%
 *
 * ENGAGEMENT (per session):
 *   - Favorites per session            target: >3
 *   - Quiz completion %                target: >70%
 *   - Story page engagement            (stories_viewed / sessions)    target: >15%
 *   - Wrapped view rate                (wrapped_viewed / sessions)    target: >30%
 *   - Digest signup rate               (digest_signup / sessions)     target: >5%
 *
 * VIRAL / GROWTH:
 *   - Share rate                       (share_favorites / sessions)   target: >10%
 *   - Referral send rate               (referral_sent / sessions)
 *   - Referral conversion              (referral_received / sessions)
 *   - k-factor                         referral_sent × referral conversion rate
 *
 * RETENTION:
 *   - D1 / D7 / D30 return rate        (tracked via streak data)
 *   - Streak distribution              % users with 3+ / 7+ / 14+ day streaks
 * ─────────────────────────────────────────────────────────────────
 */

import { safeGetJSON, safeSetJSON, safeGet } from '@/utils/storage';

export type EventName =
  | 'quiz_started'
  | 'quiz_completed'
  | 'pet_swiped_left'
  | 'pet_swiped_right'
  | 'pet_favorited'
  | 'pet_detail_opened'
  | 'shelter_clicked'
  | 'stories_viewed'
  | 'wrapped_viewed'
  | 'digest_signup'
  | 'share_favorites'
  | 'share_pet'
  | 'referral_sent'
  | 'referral_received';

export interface AnalyticsEvent {
  name: EventName;
  /** ISO 8601 timestamp */
  timestamp: string;
  /** Cohort label, e.g. "mar-28-early-adopters" */
  cohort?: string;
  /** Summarized quiz result slug, e.g. "high-active-yes-apartment-calm" */
  quizResult?: string;
  properties?: Record<string, string | number | boolean>;
}

const EVENTS_KEY = 'pupular-analytics-events';
const MAX_EVENTS = 100;

function getQuizResult(): string | undefined {
  try {
    const raw = safeGet('pupular-quiz-answers');
    if (!raw) return undefined;
    const answers = JSON.parse(raw) as Array<{ value?: string }>;
    if (!Array.isArray(answers) || answers.length === 0) return undefined;
    return answers
      .map(a => String(a?.value ?? '').toLowerCase().replace(/\s+/g, '-'))
      .join('_')
      .slice(0, 60);
  } catch {
    return undefined;
  }
}

export function trackEvent(
  name: EventName,
  properties?: Record<string, string | number | boolean>,
): void {
  try {
    const event: AnalyticsEvent = {
      name,
      timestamp: new Date().toISOString(),
      cohort: safeGet('pupular-cohort') ?? undefined,
      quizResult: getQuizResult(),
      ...(properties ? { properties } : {}),
    };

    const existing = safeGetJSON<AnalyticsEvent[]>(EVENTS_KEY) ?? [];
    // Rotating queue — keep only the most recent MAX_EVENTS entries
    const updated = [...existing, event].slice(-MAX_EVENTS);
    safeSetJSON(EVENTS_KEY, updated);
  } catch {
    // Never interrupt user flow for analytics
  }
}

/** Read the full event queue (for future admin/metrics tooling). */
export function getEvents(): AnalyticsEvent[] {
  return safeGetJSON<AnalyticsEvent[]>(EVENTS_KEY) ?? [];
}
