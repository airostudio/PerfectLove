import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { Resend } from "resend";
import { generateSoulmateSketch } from "@/lib/ai-generate";
import { generateReadingContent } from "@/lib/ai-reading";

// ── Email HTML builder ────────────────────────────────────────────────────────

const wrap = (inner: string) => `
  <div style="font-family:Georgia,serif; max-width:600px; margin:0 auto; background:#0a0510; color:#ede4d8; padding:40px 32px; border-radius:12px;">
    <p style="font-size:11px; letter-spacing:0.4em; text-transform:uppercase; color:#c084fc; margin:0 0 20px;">PerfectLove</p>
    ${inner}
    <hr style="border:none; border-top:1px solid #2d1f45; margin:36px 0 20px;" />
    <p style="font-size:12px; color:#7a6d8a; text-align:center;">With love, The PerfectLove Team ✦</p>
  </div>`;

const p = (t: string) =>
  `<p style="font-size:15px; line-height:1.75; color:#b8a9c4; margin:0 0 16px;">${t}</p>`;
const h1 = (t: string) =>
  `<h1 style="font-size:26px; font-weight:normal; color:#ede4d8; margin:0 0 8px;">${t}</h1>`;
const h2 = (t: string) =>
  `<h2 style="font-size:17px; font-weight:normal; color:#f0c050; margin:28px 0 10px;">${t}</h2>`;

function metaBar(sign: string, element: string, isExpress: boolean): string {
  return `<p style="font-size:11px; color:#7a6d8a; margin:0 0 28px;">${sign} · ${element}${isExpress ? " · Express" : ""}</p>
  <hr style="border:none; border-top:1px solid #2d1f45; margin:0 0 28px;" />`;
}

// ── Reading titles and subjects ───────────────────────────────────────────────

const readingMeta: Record<string, { title: string; subject: (express: boolean) => string }> = {
  "soulmate-sketch":         { title: "Your Soulmate Sketch",                 subject: (e) => e ? "⚡ Your Soulmate Sketch — Express Delivery" : "✨ Your Soulmate Sketch is Ready" },
  "soulmate-name-initials":  { title: "Name Initials of Your Soulmate",       subject: () => "✨ The Initials of Your Soulmate — Revealed" },
  "soulmate-zodiac":         { title: "Zodiac Sign of Your Soulmate",         subject: () => "✨ The Zodiac Sign of Your Soulmate — Revealed" },
  "soulmate-aura":           { title: "Aura of Your Soulmate",                subject: () => "✨ The Aura of Your Soulmate — Revealed" },
  "soulmate-personality":    { title: "Personality Traits of Your Soulmate",  subject: () => "✨ The Personality of Your Soulmate — Revealed" },
  "soulmate-spiritual":      { title: "Spiritual Alignment of Your Soulmate", subject: () => "✨ The Spiritual Alignment of Your Soulmate — Revealed" },
  "soulmate-spirit-animal":  { title: "Spirit Animal of Your Soulmate",       subject: () => "✨ The Spirit Animal of Your Soulmate — Revealed" },
  "soulmate-career":         { title: "Job & Career of Your Soulmate",        subject: () => "✨ The Career of Your Soulmate — Revealed" },
  "soulmate-impact":         { title: "Impact & Mission of Your Soulmate",    subject: () => "✨ The Mission of Your Soulmate — Revealed" },
  "soulmate-when-where":     { title: "When & Where You'll Meet",             subject: () => "✨ When & Where You'll Meet Your Soulmate" },
  "soulmate-meeting-details":{ title: "Small Details of Your Meeting",        subject: () => "✨ The Details of Your First Meeting — Revealed" },
  "soulmate-past-life":      { title: "Past Life Connection",                 subject: () => "✨ Your Past Life Connection — Revealed" },
};

// ── Build email from AI-generated content ─────────────────────────────────────

async function buildEmail(order: {
  reading_id: string;
  answers: Record<string, string>;
  delivery_type: string;
  image_url?: string | null;
}): Promise<{ subject: string; html: string }> {
  const { reading_id, answers, delivery_type, image_url } = order;
  const sign = answers.sun_sign || "your sign";
  const element = answers.element || "your element";
  const isExpress = delivery_type === "express";
  const meta = readingMeta[reading_id];
  const title = meta?.title ?? reading_id.replace(/-/g, " ");
  const subject = meta?.subject(isExpress) ?? `✨ Your PerfectLove Reading is Ready`;
  const bar = metaBar(sign, element, isExpress);

  // ── Soulmate Sketch: image + AI description ────────────────────────────────
  if (reading_id === "soulmate-sketch") {
    const ai = await generateReadingContent("soulmate-sketch", answers);
    const imageBlock = image_url
      ? `<div style="text-align:center; margin-bottom:28px;">
           <img src="${image_url}" alt="Your Soulmate Sketch" style="max-width:100%; border-radius:10px; border:1px solid #2d1f45;" />
         </div>`
      : "";

    let body = h1(title) + bar + imageBlock;
    if (ai) {
      body += p(ai.intro);
      for (const s of ai.sections) body += h2(s.heading) + p(s.content);
      body += `<p style="font-size:14px; font-style:italic; color:#c084fc; margin:24px 0 0;">${ai.closing}</p>`;
    } else {
      body += p(`Based on your <strong>${sign}</strong> energy and <strong>${element}</strong> resonance, this portrait channels the soul drawn to yours.`);
      body += p("They carry a quiet strength — the kind that makes you feel seen without needing to explain yourself. Keep this image close. You'll recognize them when the moment comes.");
    }
    return { subject, html: wrap(body) };
  }

  // ── All other readings: full AI generation ─────────────────────────────────
  const ai = await generateReadingContent(reading_id, answers);

  let body = h1(title) + bar;

  if (ai) {
    body += p(ai.intro);
    for (const s of ai.sections) body += h2(s.heading) + p(s.content);
    body += `<p style="font-size:14px; font-style:italic; color:#c084fc; margin:24px 0 0;">${ai.closing}</p>`;
  } else {
    // Minimal fallback — only if AI fails
    body += p(`Your personalized ${title.toLowerCase()} has been crafted from your ${sign} energy and ${element} resonance.`);
    body += p("The reading is deeply specific to your cosmic profile. Read slowly, and trust what resonates most strongly.");
  }

  return { subject, html: wrap(body) };
}

// ── Process a single order ────────────────────────────────────────────────────

async function processOrder(
  order: Record<string, unknown>,
  resend: Resend
): Promise<void> {
  const orderId = order.id as string;
  const readingId = order.reading_id as string;

  let image_url: string | null = null;
  if (readingId === "soulmate-sketch") {
    image_url = await generateSoulmateSketch(order.answers as Record<string, string>);
  }

  const { subject, html } = await buildEmail({
    ...order as Parameters<typeof buildEmail>[0],
    image_url,
  });

  const { error: emailError } = await resend.emails.send({
    from: "PerfectLove <readings@perfectlove.app>",
    to: order.email as string,
    subject,
    html,
  });

  if (emailError) {
    throw new Error(`Email send failed: ${emailError.message}`);
  }

  const { error: updateError } = await getSupabase()
    .from("orders")
    .update({ status: "delivered", image_url })
    .eq("id", orderId);

  if (updateError) {
    throw new Error(`DB update failed: ${updateError.message}`);
  }
}

// ── Cron handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("CRON_SECRET is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const expected = Buffer.from(`Bearer ${cronSecret}`);
  const actual = Buffer.from(authHeader);

  const isAuthorized =
    actual.length === expected.length &&
    timingSafeEqual(actual, expected);

  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data: orders, error } = await getSupabase()
    .from("orders")
    .select("*")
    .eq("status", "processing")
    .lte("delivery_at", new Date().toISOString());

  if (error) {
    console.error("Cron: failed to fetch orders:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const batch = orders ?? [];

  // Process all orders in parallel; log failures individually without stopping others
  const results = await Promise.allSettled(
    batch.map((order) => processOrder(order, resend))
  );

  let delivered = 0;
  const failures: string[] = [];

  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      delivered++;
    } else {
      const orderId = batch[i]?.id ?? "unknown";
      const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.error(`Cron: order ${orderId} failed: ${reason}`);
      failures.push(orderId);
    }
  });

  return NextResponse.json({
    delivered,
    failed: failures.length,
    ...(failures.length > 0 && { failedIds: failures }),
  });
}
