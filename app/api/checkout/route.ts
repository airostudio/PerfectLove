import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getReading } from "@/lib/readings";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateEnv } from "@/lib/env";
import { getSupabase } from "@/lib/supabase";
import { getSupabaseServer } from "@/lib/supabase-server";
import { hasActiveSubscription, isSubscriptionGatedCategory } from "@/lib/subscriptions";
import { normalizeEmail } from "@/lib/email";
import { computeDeliveryAt, EXPRESS_PRICE_CENTS } from "@/lib/delivery-timing";

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`checkout:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    validateEnv();

    const body = await req.json().catch(() => null);

    // Validate request body
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { answers, deliveryType } = body as Record<string, unknown>;

    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return NextResponse.json({ error: "answers must be an object" }, { status: 400 });
    }

    const answersObj = answers as Record<string, unknown>;
    if (typeof answersObj.reading_id !== "string" || !answersObj.reading_id) {
      return NextResponse.json({ error: "answers.reading_id is required" }, { status: 400 });
    }

    if (deliveryType !== undefined && deliveryType !== "standard" && deliveryType !== "express") {
      return NextResponse.json(
        { error: "deliveryType must be 'standard' or 'express'" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured" }, { status: 500 });
    }
    const readingId = answersObj.reading_id as string;
    const isExpress = deliveryType === "express";

    const reading = getReading(readingId);
    if (!reading) {
      return NextResponse.json({ error: "Invalid reading_id" }, { status: 400 });
    }

    // Free unlock for logged-in bundle owners / active Tarot & Astrology subscribers
    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (user?.email) {
      const email = normalizeEmail(user.email);
      const admin = getSupabase();
      const { data: bundleOrder } = await admin
        .from("orders")
        .select("id")
        .eq("email", email)
        .eq("reading_id", "complete-bundle")
        .eq("status", "delivered")
        .maybeSingle();

      const eligibleFree =
        bundleOrder != null ||
        (isSubscriptionGatedCategory(reading.category) && (await hasActiveSubscription(email)));

      if (eligibleFree) {
        // Free unlocks always queue on the standard 24h timer, same as every paid
        // reading — express (30-min) delivery is a paid upsell, not something a
        // free unlock grants for free, so it's ignored here regardless of what
        // the client sent.
        const { data: insertedOrder, error: freeInsertError } = await admin
          .from("orders")
          .insert({
            email,
            reading_id: readingId,
            answers: answersObj,
            stripe_session_id: `free_${randomUUID()}`,
            amount_paid: 0,
            status: "processing",
            delivery_type: "standard",
            delivery_at: computeDeliveryAt("standard"),
          })
          .select()
          .single();

        if (freeInsertError || !insertedOrder) {
          console.error("Free unlock: failed to insert order:", freeInsertError?.message);
          return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
        }

        return NextResponse.json({ orderId: insertedOrder.id });
      }
    }

    const price = isExpress ? EXPRESS_PRICE_CENTS : reading.price;

    const readingName = readingId
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    const productName = isExpress
      ? `PerfectLove — ${readingName} (Express 30-min Delivery)`
      : `PerfectLove — ${readingName}`;

    const answersJson = JSON.stringify(answers);
    if (answersJson.length > 490) {
      // Stripe metadata values are capped at 500 characters
      return NextResponse.json({ error: "Quiz answers too large to process. Please try again." }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: { name: productName },
          },
          quantity: 1,
        },
      ],
      metadata: {
        answers: answersJson,
        reading_id: readingId,
        delivery_type: isExpress ? "express" : "standard",
      },
      success_url: `${appUrl}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent(`/reading/success?reading=${readingId}`)}`,
      cancel_url: `${appUrl}/reading/${readingId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Stripe.errors.StripeError
      ? `Stripe: ${err.message}`
      : err instanceof Error ? err.message : String(err);
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
