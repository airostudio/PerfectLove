import OpenAI from "openai";
import { persistBase64ImageToStorage } from "@/lib/image-storage";

const SKETCH_BUCKET = "sketches";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _client;
}

function buildSketchPrompt(answers: Record<string, string>): string {
  // sign/element are computed from the customer's real birth date (lib/zodiac-facts.ts)
  // and describe the CUSTOMER's chart, which shapes the mood of the portrait.
  // soulmate_gender/soulmate_traits describe who is actually depicted: their soulmate.
  const sign = answers.sun_sign || "Cancer";
  const element = answers.element || "Water";
  const soulmateGender = answers.soulmate_gender || "Female";
  const soulmateTraits = (answers.soulmate_traits || "").split(", ").filter(Boolean);

  const genderTerm: Record<string, string> = {
    Male: "man",
    Female: "woman",
    "Non-Binary": "non-binary person",
    Other: "person",
  };
  const subject = genderTerm[soulmateGender] || "person";
  const primaryTrait = soulmateTraits[0]
    ? soulmateTraits[0].charAt(0).toLowerCase() + soulmateTraits[0].slice(1)
    : "a quiet magnetism";

  const zodiacHint: Record<string, string> = {
    Aries: "a bold, direct energy in their bearing",
    Taurus: "an unhurried, sensual calm",
    Gemini: "a quick, alert brightness in their expression",
    Cancer: "a tender, protective softness",
    Leo: "a warm, magnetic confidence",
    Virgo: "a thoughtful, precise attentiveness",
    Libra: "an easy, harmonious grace",
    Scorpio: "a magnetic, unreadable intensity",
    Sagittarius: "an open, adventurous spark",
    Capricorn: "a quiet, steady resolve",
    Aquarius: "a distant, dreaming originality",
    Pisces: "a soft, otherworldly dreaminess",
  };

  const elementMood: Record<string, string> = {
    Earth: "a calm, grounded stillness — as though rooted deeply in the earth",
    Air: "a light, restless energy — as though always about to say something surprising",
    Fire: "an intense, magnetic pull — a presence that fills the room without trying",
    Water: "a quiet, fathomless depth — the kind of stillness that holds oceans",
  };

  // Fire/Air are the traditional "yang" (outward-facing) polarity signs,
  // Earth/Water the "yin" (inward-facing) ones — used here to vary pose and
  // expression in place of a self-reported personality answer.
  const isYang = element === "Fire" || element === "Air";
  const featureHint = isYang
    ? "a warm, unmistakable smile, soft at the corners of the mouth"
    : "clear, expressive eyes with real focus and depth";
  const presenceHint = isYang
    ? "facing the viewer directly, open and present, chin slightly lifted"
    : "facing three-quarters toward the viewer, calm and composed, gaze settled just past camera";

  return (
    `A loose, hand-drawn charcoal and pencil portrait sketch of a ${subject}, strictly monochrome, no colour whatsoever. ` +
    `A recognizable likeness with clear facial structure and features, but rendered with a light, quick sketch touch — visible individual strokes, some edges left open or only suggested, the way a real sketch artist works. Not a smoothed-over, fully polished rendering. ` +
    `${presenceHint}. ` +
    `Their most striking feature: ${featureHint}. ` +
    `They carry ${primaryTrait}, and ${zodiacHint[sign] || "a quiet magnetism"} layered with ${elementMood[element] || "a quiet, otherworldly presence"}. ` +
    `Background: simple and uncluttered, soft graduated shading fading to white. ` +
    `Atmosphere: intimate, warm, timeless — a portrait someone would want to frame and keep. ` +
    `No text, no labels, no watermarks, no colour. Monochrome pencil sketch portrait only.`
  );
}

function buildFutureBabyPrompt(answers: Record<string, string>): string {
  const sign = answers.sun_sign || "Cancer";
  const partnerSign = answers.partner_sign || "Pisces";
  const element = answers.element || "Water";
  const babyTrait = answers.baby_trait || "Kindness and warmth";

  const traitDetail: Record<string, string> = {
    "Courage and fire": "bold, bright eyes full of fierce curiosity and courage",
    "Kindness and warmth": "soft, warm eyes and a gentle, open smile full of tenderness",
    "Curiosity and wonder": "wide, sparkling eyes brimming with wonder and delight",
    "Calm and wisdom": "serene, knowing eyes — an old soul in a tiny face",
  };

  return (
    `A tender, dreamy hand-drawn sketch portrait of a baby or young child. ` +
    `This child carries the combined energy of ${sign} and ${partnerSign} parents, with ${element} resonance. ` +
    `They have ${traitDetail[babyTrait] || "bright, innocent eyes full of wonder"}. ` +
    `Style: soft pencil sketch with gentle watercolor washes, warm golden light, ` +
    `delicate celestial details — tiny stars and moons in the background. ` +
    `The portrait feels sacred, intimate, and full of love. ` +
    `No text, no labels, no words. Portrait only, soft and ethereal.`
  );
}

/**
 * Generate a sketch image using gpt-image-2-2026-04-21.
 * Supports soulmate-sketch and future-baby-sketch reading types.
 * Returns base64 image data (no hosted URL) — persists it to Supabase
 * Storage and returns that permanent URL, or null on failure.
 */
export async function generateSoulmateSketch(
  answers: Record<string, string>,
  readingId: string = "soulmate-sketch"
): Promise<string | null> {
  const prompt =
    readingId === "future-baby-sketch"
      ? buildFutureBabyPrompt(answers)
      : buildSketchPrompt(answers);

  try {
    const client = getClient();

    const response = await client.images.generate(
      {
        model: "gpt-image-2-2026-04-21",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "medium",
      },
      { timeout: 60_000 }
    );

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) return null;

    return await persistBase64ImageToStorage(b64, SKETCH_BUCKET);
  } catch (err) {
    console.error("Sketch image generation failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
