import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { analyzePalmImage } from "@/lib/palm-vision";

const MAX_DATA_URI_LENGTH = 8_000_000; // ~6MB of actual image data once base64-decoded

// The image in the request body is used for exactly one OpenAI call below and
// is never referenced again after this function returns — no DB write, no
// storage upload, no disk write, and it must never appear in a log line.
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = checkRateLimit(`palm-analysis:${ip}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again in a moment." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const image = body?.image;

  if (typeof image !== "string" || !image.startsWith("data:image/")) {
    return NextResponse.json({ error: "A valid image is required" }, { status: 400 });
  }
  if (image.length > MAX_DATA_URI_LENGTH) {
    return NextResponse.json({ error: "Image is too large" }, { status: 413 });
  }

  const analysis = await analyzePalmImage(image);

  if (!analysis) {
    return NextResponse.json(
      { error: "Couldn't analyze that photo. Please try again." },
      { status: 502 }
    );
  }

  if (!analysis.palmDetected) {
    return NextResponse.json(
      { error: "We couldn't clearly see a palm in that photo — try again with your hand open, flat, and well-lit." },
      { status: 422 }
    );
  }

  return NextResponse.json({ analysis });
}
