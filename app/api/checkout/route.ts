import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { answers } = await req.json();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 129, // $1.29
          product_data: {
            name: "Soulmate Sketch — Cosmic Reading",
            description:
              "A hand-sketched portrait of your soulmate based on your cosmic profile.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      answers: JSON.stringify(answers),
    },
    success_url: `${appUrl}/quiz/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/quiz`,
  });

  return NextResponse.json({ url: session.url });
}
