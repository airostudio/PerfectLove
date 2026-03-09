import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { answers } = await req.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const readingId = answers.reading_id || "unknown";

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: 699, // $6.99
            product_data: {
              name: `PerfectLove — ${readingId.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        answers: JSON.stringify(answers),
        reading_id: readingId,
      },
      success_url: `${appUrl}/quiz/success?session_id={CHECKOUT_SESSION_ID}&reading=${readingId}`,
      cancel_url: `${appUrl}/quiz/${readingId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
