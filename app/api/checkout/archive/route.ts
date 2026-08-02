import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { orderId } = body as Record<string, unknown>;
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const { data: order } = await getSupabase()
      .from("orders")
      .select("id, email, reading_id, reading_html, content_expires_at")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 400 });
    }

    if (!order.reading_html) {
      return NextResponse.json({ error: "No reading content available for this order" }, { status: 400 });
    }

    // Only allow archive retrieval if content is expired (or never set)
    const isExpired =
      order.content_expires_at === null ||
      new Date(order.content_expires_at) < new Date();

    if (!isExpired) {
      return NextResponse.json({ error: "Content has not expired yet" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured" }, { status: 500 });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 199, // $1.99
            product_data: { name: "PerfectLove — Reading Archive Retrieval" },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "archive_retrieval",
        order_id: orderId,
      },
      success_url: `${appUrl}/reading/view/${orderId}?retrieved=true`,
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
    console.error("Archive checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
