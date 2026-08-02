import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _client;
}

function buildSketchPrompt(answers: Record<string, string>): string {
  const sign = answers.sun_sign || "Pisces";
  const element = answers.element || "Water";
  const personality = answers.personality || "Introverted depth";
  const soulWindow = answers.soul_window || "The Gaze";

  const elementDescriptions: Record<string, string> = {
    Earth: "grounded, warm, earthy features — strong jaw, brown or green eyes, calm and steady presence",
    Air: "ethereal, bright features — sharp cheekbones, light eyes that sparkle with curiosity and wit",
    Fire: "magnetic, passionate features — expressive eyes, defined brow, a smile that commands attention",
    Water: "soft, intuitive features — dreamy eyes, gentle expression, an otherworldly depth in their gaze",
  };

  const soulWindowDetail =
    soulWindow === "The Smile"
      ? "a warm, captivating smile that draws you in"
      : "deep, soulful eyes that seem to see right through you";

  const personalityDetail =
    personality === "Introverted depth"
      ? "quiet strength and mystery, someone who holds secrets behind their eyes"
      : "radiant warmth and presence, someone whose energy lights up the room";

  return (
    `A mystical, romantic hand-drawn pencil portrait of a soulmate figure. ` +
    `Their energy is ${sign} and ${element}. ` +
    `They have ${elementDescriptions[element] || "striking, memorable features"}. ` +
    `Their defining feature is ${soulWindowDetail}. ` +
    `They exude ${personalityDetail}. ` +
    `Style: delicate pencil sketch with soft watercolor washes, celestial starfield background, ` +
    `glowing violet and gold accents, spiritual and romantic atmosphere. ` +
    `No text, no labels, no words. Portrait only, dreamy and mystical.`
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
 * Generate a sketch image using DALL-E 3.
 * Supports soulmate-sketch and future-baby-sketch reading types.
 * Returns the image URL (hosted by OpenAI, valid ~1 hour) or null on failure.
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
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
      },
      { timeout: 60_000 }
    );

    return response.data?.[0]?.url ?? null;
  } catch (err) {
    console.error("DALL-E generation failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
