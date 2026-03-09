import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const stripe = getStripe();

    // Create the recurring $16.99/mo price
    const price = await stripe.prices.create({
      currency: "usd",
      unit_amount: 1699, // $16.99
      recurring: { interval: "month" },
      product_data: {
        name: "PerfectLove — Cosmic Readings",
      },
    });

    // Create a coupon for 92% off the first month ($1.29 instead of $16.99)
    const coupon = await stripe.coupons.create({
      amount_off: 1570, // $16.99 - $1.29 = $15.70 off
      currency: "usd",
      duration: "once",
      name: "First Month — 92% Off",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: price.id, quantity: 1 }],
      discounts: [{ coupon: coupon.id }],
      metadata: {
        answers: JSON.stringify(answers),
      },
      subscription_data: {
        metadata: {
          answers: JSON.stringify(answers),
        },
      },
      success_url: `${appUrl}/quiz/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/quiz`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
