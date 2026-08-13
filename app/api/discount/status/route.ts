import { NextRequest, NextResponse } from "next/server";
import {
  FIRST_SEEN_COOKIE,
  FIRST_SEEN_COOKIE_MAX_AGE_SECONDS,
  getDiscountForFirstSeen,
} from "@/lib/new-user-discount";

// Establishes the first-visit anchor on the caller's very first hit (any
// page — the client fires this from the root layout) and reports back the
// current tier. httpOnly so client JS can't rewrite the anchor to keep
// resetting their own discount clock; /api/checkout re-derives the price
// from this same cookie server-side rather than trusting anything the
// client displays.
export async function GET(req: NextRequest) {
  const raw = req.cookies.get(FIRST_SEEN_COOKIE)?.value;
  const parsed = raw ? Number(raw) : NaN;
  const now = Date.now();
  const hasValidCookie = Number.isFinite(parsed) && parsed > 0 && parsed <= now;

  const firstSeenMs = hasValidCookie ? parsed : now;
  const discount = getDiscountForFirstSeen(firstSeenMs, now);

  const res = NextResponse.json(discount);

  if (!hasValidCookie) {
    res.cookies.set(FIRST_SEEN_COOKIE, String(firstSeenMs), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: FIRST_SEEN_COOKIE_MAX_AGE_SECONDS,
      path: "/",
    });
  }

  return res;
}
