import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseServer } from "@/lib/supabase-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateEnv } from "@/lib/env";
import { SUBSCRIPTION_PRICE_CENTS } from "@/lib/subscriptions";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`subscribe:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    validateEnv();

    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: "You must be signed in to subscribe." }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured" }, { status: 500 });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: SUBSCRIPTION_PRICE_CENTS,
            recurring: { interval: "month" },
            product_data: {
              name: "PerfectLove — Tarot & Astrology Monthly",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "tarot_astrology_sub",
        customer_email: user.email,
      },
      success_url: `${appUrl}/dashboard?subscription=success`,
      cancel_url: `${appUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Stripe.errors.StripeError
        ? `Stripe: ${err.message}`
        : err instanceof Error
        ? err.message
        : String(err);
    console.error("Subscribe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
