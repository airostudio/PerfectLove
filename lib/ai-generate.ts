import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _client;
}

/**
 * Build a DALL-E 3 prompt for the soulmate sketch from quiz answers.
 */
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

/**
 * Generate a soulmate sketch image using DALL-E 3.
 * Returns the image URL (hosted by OpenAI, valid ~1 hour) or null on failure.
 */
export async function generateSoulmateSketch(
  answers: Record<string, string>
): Promise<string | null> {
  try {
    const client = getClient();
    const prompt = buildSketchPrompt(answers);

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
