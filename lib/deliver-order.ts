import { Resend } from "resend";
import { getSupabase } from "@/lib/supabase";
import { generateSoulmateSketch } from "@/lib/ai-generate";
import { generateReadingContent } from "@/lib/ai-reading";
import { getTarotCardImageUrl } from "@/lib/tarot-images";

// ── Email HTML building blocks ──────────────────────────────────────────────
// Inline styles only, no flexbox/grid — kept compatible with Outlook's
// Word rendering engine. Gradient dividers declare a solid background-color
// first so clients that ignore the gradient still show a plain gold line.

const GOLD = "#d4af37";

const divider = (width = 72) =>
  `<div style="height:1px; width:${width}px; margin:24px auto; background-color:${GOLD}; background-image:linear-gradient(90deg, transparent, ${GOLD} 50%, transparent);"></div>`;

function header(): string {
  return `
    <div style="text-align:center; margin:0 0 8px;">
      <p style="font-size:13px; letter-spacing:0.45em; text-transform:uppercase; color:#ede4d8; margin:0;">✦ PerfectLove ✦</p>
    </div>
    ${divider(64)}`;
}

function heroTitle(title: string): string {
  return `<h1 style="font-size:28px; font-weight:normal; text-align:center; color:#ede4d8; margin:8px 0 16px; line-height:1.3;">${title}</h1>`;
}

function metaBar(sign: string, element: string, isExpress: boolean): string {
  const pill = (text: string) =>
    `<span style="display:inline-block; background:#1a0f2e; border:1px solid #2d1f45; border-radius:999px; padding:6px 16px; font-size:11px; letter-spacing:0.06em; color:#c084fc; margin:0 3px;">${text}</span>`;
  return `<div style="text-align:center; margin:0 0 32px;">${pill(sign)}${pill(element)}${isExpress ? pill("⚡ Express") : ""}</div>`;
}

function heroImage(url: string, caption: string, subcaption: string): string {
  // Explicit width/height (not just CSS max-width) so clients that block
  // remote images by default (common for any newly-verified sending domain)
  // render a properly-sized placeholder with the alt text visible, instead
  // of a near-invisible sliver that looks like a broken link.
  return `<div style="text-align:center; margin:0 0 36px;">
    <p style="font-size:10px; letter-spacing:0.35em; text-transform:uppercase; color:#7a6d8a; margin:0 0 16px;">${caption}</p>
    <img src="${url}" alt="${caption}" width="480" height="480" style="width:100%; max-width:480px; height:auto; border-radius:14px; border:1px solid #2d1f45;" />
    <p style="font-size:11px; color:#7a6d8a; margin:14px 0 0; font-style:italic;">${subcaption}</p>
  </div>`;
}

function paragraph(text: string): string {
  return `<p style="font-size:15px; line-height:1.8; color:#b8a9c4; margin:0 0 18px;">${text}</p>`;
}

function section(heading: string, content: string, cardImageUrl?: string | null, cardName?: string): string {
  const cardBlock = cardImageUrl
    ? `<div style="text-align:center; margin:12px 0 18px;">
         <img src="${cardImageUrl}" alt="${cardName ?? heading}" width="170" height="255" style="width:170px; max-width:55%; height:auto; border-radius:12px; border:1px solid ${GOLD};" />
         ${cardName ? `<p style="font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:${GOLD}; margin:10px 0 0;">${cardName}</p>` : ""}
       </div>`
    : "";
  return `<div style="margin:0 0 30px; padding:2px 0 2px 18px; border-left:2px solid #2d1f45;">
    <h2 style="font-size:14px; font-weight:normal; letter-spacing:0.08em; text-transform:uppercase; color:#f0c050; margin:0 0 14px;">${heading}</h2>
    ${cardBlock}
    <p style="font-size:15px; line-height:1.8; color:#b8a9c4; margin:0;">${content}</p>
  </div>`;
}

function closingQuote(text: string): string {
  return `<div style="background:#110820; border:1px solid #2d1f45; border-left:3px solid ${GOLD}; border-radius:10px; padding:22px 26px; margin:30px 0 0;">
    <p style="font-size:13px; font-style:italic; color:#c084fc; margin:0; line-height:1.8;">${text}</p>
  </div>`;
}

function footer(viewOnlineUrl?: string): string {
  const link = viewOnlineUrl
    ? `<p style="text-align:center; margin:0 0 18px;"><a href="${viewOnlineUrl}" style="color:#c084fc; font-size:12px; text-decoration:none; letter-spacing:0.02em;">View this reading in your dashboard →</a></p>`
    : "";
  return `${divider(40)}${link}<p style="font-size:12px; color:#7a6d8a; text-align:center; margin:0;">With love, The PerfectLove Team ✦</p>`;
}

function wrap(inner: string): string {
  return `<div style="font-family:Georgia,serif; max-width:600px; margin:0 auto; background:#0a0510; color:#ede4d8; padding:44px 36px; border-radius:16px; border:1px solid #2d1f45;">
    ${header()}
    ${inner}
  </div>`;
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
  order_id?: string;
}

const SKETCH_READING_IDS = new Set(["soulmate-sketch", "future-baby-sketch"]);

const sketchCaption: Record<string, string> = {
  "soulmate-sketch": "Your Portrait — Channelled from Your Cosmic Profile",
  "future-baby-sketch": "Their Portrait — Channelled from Your Combined Energy",
};

export async function buildEmail(
  order: EmailOrder
): Promise<{ subject: string; html: string }> {
  const { reading_id, answers, delivery_type, image_url, order_id } = order;
  const sign = answers.sun_sign || "your sign";
  const element = answers.element || "your element";
  const isExpress = delivery_type === "express";
  const meta = readingMeta[reading_id];
  const title = meta?.title ?? reading_id.replace(/-/g, " ");
  const subject = meta?.subject(isExpress) ?? `✨ Your PerfectLove Reading is Ready`;
  const isSketchReading = SKETCH_READING_IDS.has(reading_id);

  if (isSketchReading && !image_url) {
    throw new Error(`Sketch image is missing for ${reading_id} — refusing to send an email without it`);
  }

  const ai = await generateReadingContent(reading_id, answers);
  if (!ai) {
    throw new Error(`AI reading content generation failed for ${reading_id}`);
  }

  // Resolve any drawn tarot cards to images in parallel — best-effort, a
  // missing image just means that section renders without one.
  const cardNames = ai.sections.map((s) => s.card).filter((c): c is string => Boolean(c));
  const cardImageEntries = await Promise.all(
    cardNames.map(async (name) => [name, await getTarotCardImageUrl(name)] as const)
  );
  const cardImages = new Map(cardImageEntries);

  let body = heroTitle(title);
  body += metaBar(sign, element, isExpress);

  if (isSketchReading && image_url) {
    body += heroImage(
      image_url,
      sketchCaption[reading_id],
      `Charcoal & graphite — rendered from your ${sign} energy and ${element} resonance`
    );
  }

  body += paragraph(ai.intro);
  for (const s of ai.sections) {
    body += section(s.heading, s.content, s.card ? cardImages.get(s.card) : null, s.card);
  }
  body += closingQuote(ai.closing);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const viewOnlineUrl = order_id && appUrl ? `${appUrl}/reading/view/${order_id}` : undefined;
  body += footer(viewOnlineUrl);

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
  if (SKETCH_READING_IDS.has(readingId)) {
    image_url = await generateSoulmateSketch(order.answers as Record<string, string>, readingId);
  }

  const { subject, html } = await buildEmail({
    reading_id: readingId,
    answers: order.answers as Record<string, string>,
    delivery_type: order.delivery_type as string,
    image_url,
    order_id: orderId,
  });

  const recipientEmail = order.email as string;
  const testEmailOverride = process.env.RESEND_TEST_EMAIL;
  const toEmail = testEmailOverride ?? recipientEmail;
  if (testEmailOverride) {
    console.log(`[deliver-order] RESEND_TEST_EMAIL override: sending to ${testEmailOverride} instead of ${recipientEmail}`);
  }

  const { error: emailError } = await resend.emails.send({
    from: "PerfectLove <readings@perfectlove.site>",
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
