import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateEnv } from "@/lib/env";

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`bundle:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    validateEnv();

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { email } = body as Record<string, unknown>;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured" }, { status: 500 });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 2499,
            product_data: {
              name: "PerfectLove — Complete Reading Collection (All 26 Readings)",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "bundle",
        customer_email: email,
      },
      success_url: `${appUrl}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent("/dashboard?bundle=success")}`,
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
    console.error("Bundle checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
