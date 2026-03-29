/**
 * Pupular Feature Flags
 *
 * All flags are currently hardcoded to `true` (full rollout).
 * Future: swap FLAG values for remote config or percentage-based rollout.
 *
 * Flagged features:
 *   - wrapped       Pupular Wrapped year-in-review stats card
 *   - stories       Adoption success stories page (/stories)
 *   - digestSignup  Weekly email digest signup prompt
 *   - weeklyDigest  Weekly digest email delivery
 */

export type FeatureFlag =
  | 'wrapped'
  | 'stories'
  | 'digestSignup'
  | 'weeklyDigest'
  | 'referral'
  | 'achievements'
  | 'compare'
  | 'shelterMap';

const FLAGS: Record<FeatureFlag, boolean> = {
  wrapped: true,
  stories: true,
  digestSignup: true,
  weeklyDigest: true,
  referral: true,
  achievements: true,
  compare: true,
  shelterMap: true,
};

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  return FLAGS[flag] ?? false;
}
