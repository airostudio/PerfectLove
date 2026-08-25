import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { normalizeEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { timingSafeEqual } from "@/lib/timing-safe-equal";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Reason = "not_found" | "already_redeemed" | "email_mismatch";

function invalid(reason: Reason) {
  return NextResponse.json({ valid: false, reason });
}

// Public integration endpoint for partner sites (e.g. EvalOtter) to redeem a
// PerfectLove-issued code on behalf of one of their users, granting that
// email free access to the Complete Reading Collection — the same
// entitlement a $24.99 bundle purchase grants, via the same free-unlock
// check /api/checkout already does for bundle owners. No PerfectLove
// account/sign-in is required on the redeemer's end for this call itself.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`partner-redeem:${ip}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const secret = process.env.PARTNER_REDEEM_SECRET;
  if (!secret) {
    console.error("PARTNER_REDEEM_SECRET is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 503 });
  }

  const providedSecret = req.headers.get("x-perfect-love-secret") ?? "";
  if (!providedSecret || !timingSafeEqual(providedSecret, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { code: rawCode, email: rawEmail } = body as Record<string, unknown>;
  if (typeof rawCode !== "string" || !rawCode.trim()) {
    return NextResponse.json({ error: "code is required" }, { status: 400 });
  }
  if (typeof rawEmail !== "string" || !isValidEmail(rawEmail)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
  }

  const code = rawCode.trim().toUpperCase();
  const email = normalizeEmail(rawEmail);
  const admin = getSupabase();

  const { data: codeRow, error: lookupError } = await admin
    .from("partner_redemption_codes")
    .select("code, assigned_email, redeemed_at")
    .eq("code", code)
    .maybeSingle();

  if (lookupError) {
    console.error("Partner redeem: lookup failed:", lookupError.message);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }

  if (!codeRow) {
    return invalid("not_found");
  }
  if (codeRow.redeemed_at) {
    return invalid("already_redeemed");
  }
  if (codeRow.assigned_email && normalizeEmail(codeRow.assigned_email) !== email) {
    return invalid("email_mismatch");
  }

  // Grant first, using the code as a stable idempotency key on the unique
  // stripe_session_id column — this is what actually makes a redemption
  // race-safe: two concurrent requests for the same code can't both insert,
  // so whichever loses treats that as "someone already redeemed this."
  // Ordering it before the code UPDATE also means a transient failure here
  // leaves the code unclaimed and safely retryable, rather than marking it
  // redeemed with nothing actually granted.
  const { error: grantError } = await admin.from("orders").insert({
    email,
    reading_id: "complete-bundle",
    answers: {},
    stripe_session_id: `partner_${code}`,
    amount_paid: 0,
    status: "delivered",
    delivery_type: "standard",
    delivery_at: new Date().toISOString(),
  });

  if (grantError) {
    if (grantError.code === "23505") {
      // Unique violation on stripe_session_id — this exact code was already
      // (or is concurrently being) redeemed.
      return invalid("already_redeemed");
    }
    console.error(`Partner redeem: failed to grant bundle for code ${code}:`, grantError.message);
    return NextResponse.json({ error: "Failed to grant access" }, { status: 500 });
  }

  const { error: claimError } = await admin
    .from("partner_redemption_codes")
    .update({ redeemed_at: new Date().toISOString(), redeemed_email: email })
    .eq("code", code)
    .is("redeemed_at", null);

  if (claimError) {
    // The grant above already succeeded — the user has their bundle either
    // way — so this is logged but not treated as a failure response.
    console.error(`Partner redeem: granted bundle but failed to mark code ${code} redeemed:`, claimError.message);
  }

  return NextResponse.json({ valid: true });
}
