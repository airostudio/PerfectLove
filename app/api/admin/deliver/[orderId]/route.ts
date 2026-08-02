import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";
import { processOrder } from "@/lib/deliver-order";

export const maxDuration = 120;

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;

  const { data: order, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await processOrder(order, resend);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delivery failed";
    console.error(`Admin deliver: order ${orderId} failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
