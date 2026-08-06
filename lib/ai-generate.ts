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
  const element = answers.element || "Water";
  const personality = answers.personality || "Introverted depth";
  const soulWindow = answers.soul_window || "The Gaze";

  const elementMood: Record<string, string> = {
    Earth: "a calm, grounded stillness — as though rooted deeply in the earth",
    Air: "a light, restless energy — as though always about to say something surprising",
    Fire: "an intense, magnetic pull — a presence that fills the room without trying",
    Water: "a quiet, fathomless depth — the kind of stillness that holds oceans",
  };

  const featureHint =
    soulWindow === "The Smile"
      ? "a warm, unmistakable smile, soft at the corners of the mouth"
      : "clear, expressive eyes with real focus and depth";

  const presenceHint =
    personality === "Introverted depth"
      ? "facing three-quarters toward the viewer, calm and composed, gaze settled just past camera"
      : "facing the viewer directly, open and present, chin slightly lifted";

  return (
    `A fine-art charcoal and graphite pencil portrait, strictly monochrome, no colour whatsoever. ` +
    `A clean, clearly rendered likeness with well-defined facial structure and features — resolved and complete, not an abstract impression. ` +
    `${presenceHint}. ` +
    `Their most striking feature: ${featureHint}. ` +
    `They carry ${elementMood[element] || "a quiet, otherworldly presence"}. ` +
    `Medium: confident charcoal linework with smooth graphite shading for real dimension and realism — a finished, polished rendering, not loose or unfinished sketch marks. ` +
    `Background: simple and uncluttered, soft graduated shading fading to white. ` +
    `Atmosphere: intimate, warm, timeless — a portrait someone would want to frame and keep. ` +
    `No text, no labels, no watermarks, no colour. Monochrome charcoal portrait only.`
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
