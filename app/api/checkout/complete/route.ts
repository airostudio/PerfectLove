import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { establishSessionForEmail } from "@/lib/auth-session";

// Every Stripe success_url routes through here first so the purchaser's
// browser is signed in (or re-signed in) *before* it ever loads the
// destination page — this must happen server-side, ahead of any
// downstream page's own auth check, since a client-side sign-in call
// would run too late if that check already redirected away.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const sessionId = searchParams.get("session_id");
  const next = searchParams.get("next") ?? "/dashboard";

  // Only allow same-origin relative redirects (reject protocol-relative "//" or "/\" targets)
  const safeNext = /^\/(?!\/|\\)/.test(next) ? next : "/dashboard";

  if (!sessionId) {
    return NextResponse.redirect(`${origin}${safeNext}`);
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.status === "complete") {
      // Prefer metadata.customer_email — it's the exact email the order/subscription
      // was recorded under in the webhook (the signed-in identity that started
      // checkout). Falls back to what Stripe collected only when metadata wasn't set
      // (anonymous individual reading purchases).
      const rawEmail = session.metadata?.customer_email || session.customer_details?.email;
      if (rawEmail) {
        const { error } = await establishSessionForEmail(rawEmail);
        if (error) {
          console.error("checkout/complete: failed to establish session:", error);
        }
      }
    }
  } catch (err) {
    console.error("checkout/complete: failed to retrieve session:", err instanceof Error ? err.message : err);
  }

  // Best-effort — always land the purchaser on their destination page,
  // even if sign-in couldn't be established (the purchase itself already succeeded).
  return NextResponse.redirect(`${origin}${safeNext}`);
}
