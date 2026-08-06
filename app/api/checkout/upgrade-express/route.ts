import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { getSupabaseServer } from "@/lib/supabase-server";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateEnv } from "@/lib/env";
import { normalizeEmail } from "@/lib/email";
import { EXPRESS_PRICE_CENTS } from "@/lib/delivery-timing";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`upgrade-express:${ip}`);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    validateEnv();

    const body = await req.json().catch(() => null);
    const orderId = body?.orderId;
    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
    }
    const email = normalizeEmail(user.email);

    const admin = getSupabase();
    const { data: order } = await admin
      .from("orders")
      .select("id, email, status, delivery_type, reading_id")
      .eq("id", orderId)
      .maybeSingle();

    if (!order || order.email !== email) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (order.status !== "processing") {
      return NextResponse.json({ error: "This reading has already been delivered." }, { status: 400 });
    }
    if (order.delivery_type === "express") {
      return NextResponse.json({ error: "This reading is already on express delivery." }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured" }, { status: 500 });
    }

    const readingName = order.reading_id
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: EXPRESS_PRICE_CENTS,
            product_data: { name: `PerfectLove — ${readingName} (Express Upgrade)` },
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "express_upgrade",
        order_id: orderId,
      },
      success_url: `${appUrl}/api/checkout/complete?session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent("/dashboard?upgrade=success")}`,
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
    console.error("Express upgrade checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
