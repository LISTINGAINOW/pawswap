import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metrics | Pupular',
  description: 'Growth analytics and success metrics for Pupular. Internal admin view.',
  robots: { index: false, follow: false },
};

/**
 * /metrics — placeholder for future admin analytics dashboard.
 *
 * TRACKED EVENTS (via lib/analytics.ts → localStorage):
 *   quiz_started, quiz_completed, pet_swiped_left, pet_swiped_right,
 *   pet_favorited, pet_detail_opened, shelter_clicked, stories_viewed,
 *   wrapped_viewed, digest_signup, share_favorites, share_pet,
 *   referral_sent, referral_received
 *
 * KEY METRICS TO SURFACE HERE:
 *   - Conversion funnel: quiz_started → quiz_completed → pet_favorited → shelter_clicked
 *   - Quiz completion %
 *   - Favorites per session
 *   - Story engagement rate (stories_viewed / sessions)
 *   - Wrapped view rate
 *   - Digest signup rate
 *   - Share rate (share_favorites / sessions)
 *   - Referral k-factor (referral_sent × conversion rate)
 *   - Cohort breakdown (pupular-cohort values)
 *   - D1 / D7 / D30 retention (via streak data)
 *
 * STORAGE KEYS:
 *   pupular-analytics-events   — AnalyticsEvent[] (max 100, rotating queue)
 *   pupular-cohort             — string (e.g. "mar-28-early-adopters")
 *   pupular-ref-code           — string (user's outbound referral code)
 *   pupular-referrer           — string (inbound ref= param)
 */
export default function MetricsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-sage-50 px-4 text-center">
      <div className="text-6xl">📊</div>
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Metrics</h1>
      <p className="mt-3 max-w-sm text-gray-500">
        Admin analytics dashboard — coming soon.
      </p>
    </div>
  );
}
