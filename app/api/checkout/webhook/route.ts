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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const answers = JSON.parse(session.metadata?.answers || "{}");
    const email = session.customer_details?.email;

    if (email) {
      const deliveryAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString();

      await getSupabase().from("orders").insert({
        email,
        answers,
        stripe_session_id: session.id,
        status: "processing",
        delivery_at: deliveryAt,
      });
    }
  }

  return NextResponse.json({ received: true });
}
