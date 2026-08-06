import { getSupabase } from "@/lib/supabase";
import { normalizeEmail } from "@/lib/email";
import type { ReadingCategory } from "@/lib/readings";

export const SUBSCRIPTION_PRICE_CENTS = 199; // $1.99/mo

const GATED_CATEGORIES: ReadingCategory[] = ["tarot", "astrology"];

export function isSubscriptionGatedCategory(category: ReadingCategory): boolean {
  return GATED_CATEGORIES.includes(category);
}

export async function hasActiveSubscription(email: string): Promise<boolean> {
  const { data } = await getSupabase()
    .from("subscriptions")
    .select("id")
    .eq("email", normalizeEmail(email))
    .eq("status", "active")
    .maybeSingle();

  return data != null;
}
