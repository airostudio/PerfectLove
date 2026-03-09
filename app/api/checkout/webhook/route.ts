import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabase();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const answers = JSON.parse(session.metadata?.answers || "{}");
    const email = session.customer_details?.email;

    if (email) {
      const deliveryAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();

      await supabase.from("orders").insert({
        email,
        answers,
        stripe_session_id: session.id,
        stripe_subscription_id: session.subscription as string,
        stripe_customer_id: session.customer as string,
        status: "processing",
        delivery_at: deliveryAt,
      });
    }
  }

  // Handle subscription cancellation
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("stripe_subscription_id", subscription.id);
  }

  return NextResponse.json({ received: true });
}
