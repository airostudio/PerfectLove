import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { validateEnv } from "@/lib/env";
import { Resend } from "resend";
import { processOrder } from "@/lib/deliver-order";

// This route had no explicit duration limit at all — it processes every
// order due for delivery in a single invocation (Promise.allSettled over
// the whole batch), each involving one or two OpenAI calls, so a busy
// 5-minute window could realistically run long. Match the admin route's
// ceiling rather than leaving it on Vercel's default.
export const maxDuration = 120;

export async function GET(req: NextRequest) {
  try { validateEnv(); } catch (err) {
    console.error("Cron: env validation failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("CRON_SECRET is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${cronSecret}`);
  const actual = Buffer.from(authHeader);

  const isAuthorized =
    actual.length === expected.length &&
    timingSafeEqual(actual, expected);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: orders, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("status", "processing")
    .lte("delivery_at", new Date().toISOString());

  if (error) {
    console.error("Cron: failed to fetch orders:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const batch = orders ?? [];

  const results = await Promise.allSettled(
    batch.map((order) => processOrder(order, resend))
  );

  let delivered = 0;
  const failures: string[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      delivered++;
    } else {
      const orderId = batch[i]?.id ?? "unknown";
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.error(`Cron: order ${orderId} failed: ${reason}`);
      failures.push(orderId);
    }
  });

  return NextResponse.json({
    delivered,
    failed: failures.length,
    ...(failures.length > 0 && { failedIds: failures }),
  });
}
