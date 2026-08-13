/**
 * Evergreen new-visitor discount: 50% off for the first 3 days since a
 * visitor's first-seen cookie was set, 35% for the next 3 days, 20% for the
 * 3 days after that, then full price. Applies to individual reading
 * purchases only — never the bundle or subscription (separate checkout
 * routes entirely), and never the Express delivery upsell.
 *
 * Pure logic only, importable from both server routes (real pricing) and
 * client components (display) — the server is always the source of truth
 * for what's actually charged.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const TIER_LENGTH_DAYS = 3;

const TIERS = [50, 35, 20] as const;

export const FIRST_SEEN_COOKIE = "plv_first_seen";
export const FIRST_SEEN_COOKIE_MAX_AGE_SECONDS = TIERS.length * TIER_LENGTH_DAYS * 24 * 60 * 60;

export interface DiscountInfo {
  percent: number; // 0 once every tier has elapsed
  tierEndsAt: number | null; // ms epoch; null once there's no more discount
}

export function getDiscountForFirstSeen(firstSeenMs: number, nowMs: number = Date.now()): DiscountInfo {
  const elapsedMs = nowMs - firstSeenMs;

  for (let i = 0; i < TIERS.length; i++) {
    const tierEndsAt = firstSeenMs + (i + 1) * TIER_LENGTH_DAYS * DAY_MS;
    if (elapsedMs < (i + 1) * TIER_LENGTH_DAYS * DAY_MS) {
      return { percent: TIERS[i], tierEndsAt };
    }
  }

  return { percent: 0, tierEndsAt: null };
}

export function applyDiscount(priceCents: number, percent: number): number {
  if (percent <= 0) return priceCents;
  return Math.round((priceCents * (100 - percent)) / 100);
}
