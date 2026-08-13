import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// Gated entirely by middleware.ts's isAdminAuthenticated check on
// /api/admin/:path* — no auth logic needed here.
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await context.params;

  const { error } = await getSupabase().from("orders").delete().eq("id", orderId);

  if (error) {
    console.error(`Admin delete: order ${orderId} failed: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
