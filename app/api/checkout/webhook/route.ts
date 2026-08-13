import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { validateEnv } from "@/lib/env";
import { normalizeEmail } from "@/lib/email";
import { computeDeliveryAt } from "@/lib/delivery-timing";
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
        return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
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

    // Handle express delivery upgrade on an existing order
    if (metadata.type === "express_upgrade") {
      const orderId = metadata.order_id;
      if (!orderId) {
        console.error("Webhook: express_upgrade missing order_id in metadata");
        return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
      }

      const { error: upgradeError } = await getSupabase()
        .from("orders")
        .update({ delivery_type: "express", delivery_at: computeDeliveryAt("express") })
        .eq("id", orderId)
        .eq("status", "processing"); // no-op if it already delivered before the upgrade landed

      if (upgradeError) {
        console.error(`Webhook: failed to upgrade order ${orderId} to express:`, upgradeError.message);
        return NextResponse.json({ error: "Failed to upgrade delivery" }, { status: 500 });
      }

      return NextResponse.json({ received: true });
    }

    // Handle bundle purchase
    if (metadata.type === "bundle") {
      const rawEmail = metadata.customer_email || session.customer_details?.email;
      if (!rawEmail || !isValidEmail(rawEmail)) {
        console.error("Webhook: bundle missing email");
        return NextResponse.json({ error: "Missing or invalid email" }, { status: 400 });
      }
      const customerEmail = normalizeEmail(rawEmail);
      // Idempotency: skip if already processed
      const { data: existingBundle } = await getSupabase()
        .from("orders")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();
      if (existingBundle) return NextResponse.json({ received: true });

      // Record bundle as a special order row
      const now = new Date().toISOString();
      const { error: bundleInsertError } = await getSupabase()
        .from("orders")
        .insert({
          email: customerEmail,
          reading_id: "complete-bundle",
          answers: {},
          stripe_session_id: session.id,
          amount_paid: session.amount_total ?? 2499,
          status: "delivered",
          delivery_type: "standard",
          delivery_at: now,
        });

      if (bundleInsertError) {
        console.error(`Webhook: failed to insert bundle order for session ${session.id}:`, bundleInsertError.message);
        return NextResponse.json({ error: "Failed to record bundle purchase" }, { status: 500 });
      }
      return NextResponse.json({ received: true });
    }

    // Handle Tarot & Astrology monthly subscription signup
    if (metadata.type === "tarot_astrology_sub") {
      const rawEmail = metadata.customer_email || session.customer_details?.email;
      const subscriptionId = session.subscription;
      const customerId = session.customer;
      if (
        !rawEmail ||
        !isValidEmail(rawEmail) ||
        typeof subscriptionId !== "string" ||
        typeof customerId !== "string"
      ) {
        console.error("Webhook: tarot_astrology_sub missing email or subscription/customer id");
        return NextResponse.json({ error: "Missing email or subscription/customer id" }, { status: 400 });
      }
      const customerEmail = normalizeEmail(rawEmail);

      let currentPeriodEnd: string | null = null;
      try {
        const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
        currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
      } catch (err) {
        console.error(`Webhook: failed to retrieve subscription ${subscriptionId}:`, err instanceof Error ? err.message : err);
      }

      const { error: subUpsertError } = await getSupabase()
        .from("subscriptions")
        .upsert(
          {
            email: customerEmail,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            status: "active",
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "stripe_subscription_id" }
        );

      if (subUpsertError) {
        console.error(`Webhook: failed to upsert subscription ${subscriptionId}:`, subUpsertError.message);
        return NextResponse.json({ error: "Failed to record subscription" }, { status: 500 });
      }
      return NextResponse.json({ received: true });
    }

    // Answers are staged in pending_checkout_answers (see schema.sql section 6)
    // since a richer quiz's JSON routinely exceeds Stripe's 500-char metadata cap.
    let answers: Record<string, unknown> = {};
    if (metadata.pending_answers_id) {
      const { data: pending, error: pendingFetchError } = await getSupabase()
        .from("pending_checkout_answers")
        .select("answers")
        .eq("id", metadata.pending_answers_id)
        .maybeSingle();

      if (pendingFetchError) {
        console.error("Webhook: failed to fetch pending answers:", pendingFetchError.message);
      } else if (pending) {
        answers = pending.answers as Record<string, unknown>;
      }
    }

    const readingId = metadata.reading_id || "unknown";
    const rawEmail = session.customer_details?.email;

    if (!rawEmail || !isValidEmail(rawEmail)) {
      // Was previously swallowed as {received:true} (200) — Stripe took that
      // as "handled successfully" and never retried, so a genuinely failed
      // order left zero trace anywhere except this log line. Returning an
      // error surfaces it as a failed delivery in the Stripe dashboard.
      console.error(`Webhook: invalid or missing email for session ${session.id} (reading_id=${readingId}, customer_details=${JSON.stringify(session.customer_details)})`);
      return NextResponse.json({ error: "Missing or invalid customer email" }, { status: 400 });
    }
    const email = normalizeEmail(rawEmail);

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
    const deliveryAt = computeDeliveryAt(deliveryType);

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

    if (metadata.pending_answers_id) {
      // Best-effort cleanup — the staged row has already served its purpose.
      const { error: cleanupError } = await getSupabase()
        .from("pending_checkout_answers")
        .delete()
        .eq("id", metadata.pending_answers_id);
      if (cleanupError) {
        console.error("Webhook: failed to clean up pending answers:", cleanupError.message);
      }
    }
  }

  // Keep subscription status in sync with Stripe (renewals, failed payments, cancellations)
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const status: "active" | "past_due" | "canceled" =
      subscription.status === "active" || subscription.status === "trialing"
        ? "active"
        : subscription.status === "past_due"
        ? "past_due"
        : "canceled";

    const { error: subUpdateError } = await getSupabase()
      .from("subscriptions")
      .update({
        status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id);

    if (subUpdateError) {
      console.error(`Webhook: failed to update subscription ${subscription.id}:`, subUpdateError.message);
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
