import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { generatePartnerCode } from "@/lib/partner-codes";
import { normalizeEmail } from "@/lib/email";

const MAX_BATCH = 200;

// Gated by middleware.ts's isAdminAuthenticated check on /api/admin/:path*.
export async function GET() {
  const { data, error } = await getSupabase()
    .from("partner_redemption_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ codes: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const partner = typeof body?.partner === "string" ? body.partner.trim() || null : null;
  const assignedEmailRaw = typeof body?.assignedEmail === "string" ? body.assignedEmail.trim() : "";
  const assignedEmail = assignedEmailRaw ? normalizeEmail(assignedEmailRaw) : null;
  const countRaw = typeof body?.count === "number" ? body.count : 1;
  const count = Math.min(Math.max(Math.floor(countRaw) || 1, 1), MAX_BATCH);

  // A pre-assigned email only makes sense tied to exactly one code.
  if (assignedEmail && count > 1) {
    return NextResponse.json(
      { error: "assignedEmail can only be used when generating a single code" },
      { status: 400 }
    );
  }

  const admin = getSupabase();
  const generated: string[] = [];

  for (let i = 0; i < count; i++) {
    let inserted = false;
    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      const code = generatePartnerCode();
      const { error } = await admin.from("partner_redemption_codes").insert({
        code,
        partner,
        assigned_email: assignedEmail,
      });
      if (!error) {
        generated.push(code);
        inserted = true;
      } else if (error.code !== "23505") {
        // Not a code collision — a real failure, stop here.
        console.error("Admin partner-codes: insert failed:", error.message);
        return NextResponse.json(
          { error: error.message, generated },
          { status: 500 }
        );
      }
      // 23505 (unique violation) — extremely unlikely code collision, retry.
    }
    if (!inserted) {
      return NextResponse.json(
        { error: "Failed to generate a unique code after several attempts", generated },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ codes: generated });
}
