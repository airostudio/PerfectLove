import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { validateEnv } from "@/lib/env";
import Stripe from "stripe";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try { validateEnv(); } catch (err) {
    console.error("Webhook: env validation failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    // Handle archive retrieval payment
    if (metadata.type === "archive_retrieval") {
      const orderId = metadata.order_id;
      if (!orderId) {
        console.error("Webhook: archive_retrieval missing order_id in metadata");
        return NextResponse.json({ received: true });
      }

      const newExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
      const { error: archiveUpdateError } = await getSupabase()
        .from("orders")
        .update({ content_expires_at: newExpiresAt, archive_stripe_session_id: session.id })
        .eq("id", orderId);

      if (archiveUpdateError) {
        console.error(`Webhook: failed to update archive expiry for order ${orderId}:`, archiveUpdateError.message);
        return NextResponse.json({ error: "Failed to update archive" }, { status: 500 });
      }

      return NextResponse.json({ received: true });
    }

    // Safe JSON parse of answers
    let answers: Record<string, unknown> = {};
    try {
      answers = JSON.parse(metadata.answers || "{}");
    } catch (err) {
      console.error("Failed to parse answers metadata:", err instanceof Error ? err.message : err);
      // Continue — we'll store an empty answers object rather than fail the webhook
    }

    const readingId = metadata.reading_id || "unknown";
    const email = session.customer_details?.email;

    if (!email || !isValidEmail(email)) {
      console.error(`Webhook: invalid or missing email for session ${session.id}`);
      return NextResponse.json({ received: true });
    }

    // Idempotency: skip if this session was already processed
    const { data: existing } = await getSupabase()
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ received: true });
    }

    const rawDeliveryType = metadata.delivery_type;
    const deliveryType: "standard" | "express" =
      rawDeliveryType === "express" ? "express" : "standard";
    const delayMs =
      deliveryType === "express"
        ? 30 * 60 * 1000          // 30 minutes
        : 24 * 60 * 60 * 1000;   // 24 hours

    const deliveryAt = new Date(Date.now() + delayMs).toISOString();

    const { error: insertError } = await getSupabase()
      .from("orders")
      .insert({
        email,
        reading_id: readingId,
        answers,
        stripe_session_id: session.id,
        amount_paid: session.amount_total,
        status: "processing",
        delivery_type: deliveryType,
        delivery_at: deliveryAt,
      });

    if (insertError) {
      console.error(`Webhook: failed to insert order for session ${session.id}:`, insertError.message);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
