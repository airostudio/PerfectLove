import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getReading } from "@/lib/readings";

const EXPRESS_PRICE_CENTS = 1499; // $14.99 — express 30-min delivery

export async function POST(req: NextRequest) {
  try {
    const { answers, deliveryType } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const readingId = answers.reading_id || "unknown";
    const isExpress = deliveryType === "express";

    const reading = getReading(readingId);
    const basePrice = reading?.price ?? 699;
    const price = isExpress ? EXPRESS_PRICE_CENTS : basePrice;

    const readingName = readingId
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());

    const productName = isExpress
      ? `PerfectLove — ${readingName} (Express 30-min Delivery)`
      : `PerfectLove — ${readingName}`;

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
        answers: JSON.stringify(answers),
        reading_id: readingId,
        delivery_type: isExpress ? "express" : "standard",
      },
      success_url: `${appUrl}/reading/success?session_id={CHECKOUT_SESSION_ID}&reading=${readingId}`,
      cancel_url: `${appUrl}/reading/${readingId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
