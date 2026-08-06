import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getReading } from "@/lib/readings";
import { hasActiveSubscription, isSubscriptionGatedCategory } from "@/lib/subscriptions";

export async function GET(req: NextRequest) {
  const readingId = req.nextUrl.searchParams.get("reading_id");
  if (!readingId) {
    return NextResponse.json({ error: "reading_id is required" }, { status: 400 });
  }

  const reading = getReading(readingId);
  if (!reading) {
    return NextResponse.json({ error: "Invalid reading_id" }, { status: 400 });
  }

  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ eligible: false });
  }

  const { data: bundleOrder } = await getSupabase()
    .from("orders")
    .select("id")
    .eq("email", user.email)
    .eq("reading_id", "complete-bundle")
    .eq("status", "delivered")
    .maybeSingle();

  if (bundleOrder) {
    return NextResponse.json({ eligible: true, reason: "bundle" });
  }

  if (isSubscriptionGatedCategory(reading.category)) {
    const subscribed = await hasActiveSubscription(user.email);
    if (subscribed) {
      return NextResponse.json({ eligible: true, reason: "subscription" });
    }
  }

  return NextResponse.json({ eligible: false });
}
