import { safeGetJSON, safeSetJSON } from '@/utils/storage';

export type RevenueEventType =
  | 'affiliate_click'
  | 'featured_impression'
  | 'insurance_referral'
  | 'shelter_signup';

export interface RevenueEvent {
  type: RevenueEventType;
  timestamp: string;
  amount?: number;
  metadata?: Record<string, string | number | boolean>;
}

// Estimated commissions per click (conservative)
const AVG_CONVERSION: Record<RevenueEventType, number> = {
  affiliate_click:     0.03,  // 3% conversion
  featured_impression: 0,     // tracked separately as subscription
  insurance_referral:  0.08,  // 8% conversion
  shelter_signup:      1,     // direct lead value
};

const AVG_COMMISSION: Record<RevenueEventType, number> = {
  affiliate_click:     8.50,  // avg Chewy commission per sale
  featured_impression: 0,
  insurance_referral:  25.00, // avg insurance referral payout
  shelter_signup:      0,     // future
};

const STORAGE_KEY = 'pupular-revenue-events';
const MAX_EVENTS = 500;

export function trackRevenue(
  type: RevenueEventType,
  amount?: number,
  metadata?: Record<string, string | number | boolean>,
): void {
  try {
    const events = safeGetJSON<RevenueEvent[]>(STORAGE_KEY) ?? [];
    events.push({ type, timestamp: new Date().toISOString(), amount, metadata });
    // Keep rolling window
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
    safeSetJSON(STORAGE_KEY, events);
  } catch {
    // ignore storage errors
  }
}

export interface WeeklySummary {
  totalClicks: number;
  byType: Record<RevenueEventType, number>;
  estimatedRevenue: number;
  windowDays: number;
}

export function getWeeklySummary(): WeeklySummary {
  const events = safeGetJSON<RevenueEvent[]>(STORAGE_KEY) ?? [];
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = events.filter((e) => new Date(e.timestamp).getTime() >= cutoff);

  const byType: Record<RevenueEventType, number> = {
    affiliate_click: 0,
    featured_impression: 0,
    insurance_referral: 0,
    shelter_signup: 0,
  };

  let estimatedRevenue = 0;
  for (const e of recent) {
    byType[e.type] = (byType[e.type] ?? 0) + 1;
    estimatedRevenue += AVG_CONVERSION[e.type] * AVG_COMMISSION[e.type];
  }

  return {
    totalClicks: recent.length,
    byType,
    estimatedRevenue: Math.round(estimatedRevenue * 100) / 100,
    windowDays: 7,
  };
}
