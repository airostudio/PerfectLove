import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";
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

// ── Reading titles and email subjects ─────────────────────────────────────────

export const readingMeta: Record<string, { title: string; subject: (express: boolean) => string }> = {
  "soulmate-sketch":           { title: "Your Soulmate Sketch",                 subject: (e) => e ? "⚡ Your Soulmate Sketch — Express Delivery" : "✨ Your Soulmate Sketch is Ready" },
  "soulmate-name-initials":    { title: "Name Initials of Your Soulmate",       subject: () => "✨ The Initials of Your Soulmate — Revealed" },
  "soulmate-zodiac":           { title: "Zodiac Sign of Your Soulmate",         subject: () => "✨ The Zodiac Sign of Your Soulmate — Revealed" },
  "soulmate-aura":             { title: "Aura of Your Soulmate",                subject: () => "✨ The Aura of Your Soulmate — Revealed" },
  "soulmate-personality":      { title: "Personality Traits of Your Soulmate",  subject: () => "✨ The Personality of Your Soulmate — Revealed" },
  "soulmate-spiritual":        { title: "Spiritual Alignment of Your Soulmate", subject: () => "✨ The Spiritual Alignment of Your Soulmate — Revealed" },
  "soulmate-spirit-animal":    { title: "Spirit Animal of Your Soulmate",       subject: () => "✨ The Spirit Animal of Your Soulmate — Revealed" },
  "soulmate-career":           { title: "Job & Career of Your Soulmate",        subject: () => "✨ The Career of Your Soulmate — Revealed" },
  "soulmate-impact":           { title: "Impact & Mission of Your Soulmate",    subject: () => "✨ The Mission of Your Soulmate — Revealed" },
  "soulmate-when-where":       { title: "When & Where You'll Meet",             subject: () => "✨ When & Where You'll Meet Your Soulmate" },
  "soulmate-meeting-details":  { title: "Small Details of Your Meeting",        subject: () => "✨ The Details of Your First Meeting — Revealed" },
  "soulmate-past-life":        { title: "Past Life Connection",                 subject: () => "✨ Your Past Life Connection — Revealed" },
  "future-baby-sketch":        { title: "Your Future Baby Sketch Reading",      subject: () => "✨ Your Future Baby Sketch is Ready" },
  "natal-chart":               { title: "Your Natal Chart Report",              subject: () => "✨ Your Natal Chart Reading is Ready" },
  "astrocartography":          { title: "Your Astrocartography Report",         subject: () => "✨ Your Astrocartography Map is Ready" },
  "numerology":                { title: "Your Numerology Report",               subject: () => "✨ Your Numerology Reading is Ready" },
  "compatibility":             { title: "Your Compatibility Reading",           subject: () => "✨ Your Compatibility Reading is Ready" },
  "complete-astrology-guide":  { title: "Your Complete Astrology Guide",        subject: () => "✨ Your Personalised Astrology Guide is Ready" },
  "2026-forecast":             { title: "Your 2026 Astrological Forecast",      subject: () => "✨ Your 2026 Forecast is Ready" },
  "palmistry":                 { title: "Your Palmistry Reading",               subject: () => "✨ Your Palmistry Reading is Ready" },
  "yes-no-tarot":              { title: "Yes or No Tarot",                      subject: () => "✨ Your Yes or No Answer is Ready" },
  "past-present-future-tarot": { title: "Past Present Future Tarot",            subject: () => "✨ Your Three-Card Reading is Ready" },
  "past-love-clarity-tarot":   { title: "Past Love Clarity Reading",            subject: () => "✨ Your Past Love Clarity Reading is Ready" },
  "love-triangle-tarot":       { title: "Love Triangle Tarot Reading",          subject: () => "✨ Your Love Triangle Reading is Ready" },
  "true-compatibility-tarot":  { title: "True Compatibility Tarot",             subject: () => "✨ Your Compatibility Tarot Reading is Ready" },
  "heartbreak-healing-tarot":  { title: "Heartbreak Healing Tarot",             subject: () => "✨ Your Heartbreak Healing Reading is Ready" },
};

// ── Build email from AI-generated content ─────────────────────────────────────

export interface EmailOrder {
  reading_id: string;
  answers: Record<string, string>;
  delivery_type: string;
  image_url?: string | null;
}

export async function buildEmail(
  order: EmailOrder
): Promise<{ subject: string; html: string }> {
  const { reading_id, answers, delivery_type, image_url } = order;
  const sign = answers.sun_sign || "your sign";
  const element = answers.element || "your element";
  const isExpress = delivery_type === "express";
  const meta = readingMeta[reading_id];
  const title = meta?.title ?? reading_id.replace(/-/g, " ");
  const subject = meta?.subject(isExpress) ?? `✨ Your PerfectLove Reading is Ready`;
  const bar = metaBar(sign, element, isExpress);

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

  const ai = await generateReadingContent(reading_id, answers);
  let body = h1(title) + bar;

  if (ai) {
    body += p(ai.intro);
    for (const s of ai.sections) body += h2(s.heading) + p(s.content);
    body += `<p style="font-size:14px; font-style:italic; color:#c084fc; margin:24px 0 0;">${ai.closing}</p>`;
  } else {
    body += p(`Your personalized ${title.toLowerCase()} has been crafted from your ${sign} energy and ${element} resonance.`);
    body += p("The reading is deeply specific to your cosmic profile. Read slowly, and trust what resonates most strongly.");
  }

  return { subject, html: wrap(body) };
}

// ── Process a single order ────────────────────────────────────────────────────

export async function processOrder(
  order: Record<string, unknown>,
  resend: Resend
): Promise<void> {
  const orderId = order.id as string;
  const readingId = order.reading_id as string;

  let image_url: string | null = null;
  if (readingId === "soulmate-sketch" || readingId === "future-baby-sketch") {
    image_url = await generateSoulmateSketch(order.answers as Record<string, string>, readingId);
  }

  const { subject, html } = await buildEmail({
    reading_id: readingId,
    answers: order.answers as Record<string, string>,
    delivery_type: order.delivery_type as string,
    image_url,
  });

  const recipientEmail = order.email as string;
  const testEmailOverride = process.env.RESEND_TEST_EMAIL;
  const toEmail = testEmailOverride ?? recipientEmail;
  if (testEmailOverride) {
    console.log(`[deliver-order] RESEND_TEST_EMAIL override: sending to ${testEmailOverride} instead of ${recipientEmail}`);
  }

  const { error: emailError } = await resend.emails.send({
    from: "PerfectLove <readings@perfectlove.app>",
    to: toEmail,
    subject,
    html,
  });

  if (emailError) {
    throw new Error(`Email send failed: ${emailError.message}`);
  }

  const contentExpiresAt = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();

  const { error: updateError } = await getSupabase()
    .from("orders")
    .update({ status: "delivered", image_url, reading_html: html, content_expires_at: contentExpiresAt })
    .eq("id", orderId);

  if (updateError) {
    throw new Error(`DB update failed: ${updateError.message}`);
  }
}
