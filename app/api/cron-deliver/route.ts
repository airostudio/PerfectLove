import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Resend } from "resend";

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Find orders ready for delivery
  const { data: orders, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("status", "processing")
    .lte("delivery_at", new Date().toISOString());

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let delivered = 0;

  for (const order of orders ?? []) {
    try {
      await resend.emails.send({
        from: "PerfectLove <readings@perfectlove.app>",
        to: order.email,
        subject: "Your Soulmate Sketch is Ready",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="color: #6c3ce0;">Your Soulmate Sketch</h1>
            <p>Based on your cosmic profile, we've crafted a unique portrait of your perfect match.</p>
            <p style="color: #888; font-size: 14px;">
              Sun Sign: ${order.answers.sun_sign} ·
              Energy: ${order.answers.personality} ·
              Element: ${order.answers.element} ·
              Soul Window: ${order.answers.soul_window}
            </p>
            <p style="margin-top: 32px; color: #666; font-size: 12px;">
              With love, The PerfectLove Team
            </p>
          </div>
        `,
      });

      await getSupabase()
        .from("orders")
        .update({ status: "delivered" })
        .eq("id", order.id);

      delivered++;
    } catch {
      // Continue processing other orders if one fails
    }
  }

  return NextResponse.json({ delivered });
}
