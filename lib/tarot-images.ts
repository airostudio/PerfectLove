import OpenAI from "openai";
import { getSupabase } from "@/lib/supabase";
import { persistImageToStorage } from "@/lib/image-storage";
import { matchTarotCard } from "@/lib/tarot-cards";

const TAROT_BUCKET = "tarot-cards";

let _client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_client) _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  return _client;
}

function slugify(cardName: string): string {
  return cardName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildCardPrompt(cardName: string): string {
  return (
    `An original mystical tarot card illustration for "${cardName}", drawing on the traditional ` +
    `symbolic imagery associated with this card in classic tarot decks — reinterpreted in a rich, ` +
    `painterly art-nouveau style with deep jewel tones (amethyst, midnight blue, antique gold). ` +
    `Ornate thin gold linework border framing the scene, like a hand-illuminated manuscript page. ` +
    `Symmetrical, portrait-oriented composition, centered subject. ` +
    `No text, no numerals, no titles, no watermarks — imagery only.`
  );
}

async function generateAndPersistCard(cardName: string): Promise<string | null> {
  try {
    const response = await getClient().images.generate(
      {
        model: "dall-e-3",
        prompt: buildCardPrompt(cardName),
        n: 1,
        size: "1024x1792",
        quality: "standard",
        style: "vivid",
      },
      { timeout: 60_000 }
    );

    const tempUrl = response.data?.[0]?.url;
    if (!tempUrl) return null;

    return await persistImageToStorage(tempUrl, TAROT_BUCKET, `${slugify(cardName)}.png`);
  } catch (err) {
    console.error(`Tarot card generation failed for "${cardName}":`, err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Returns a permanent image URL for a tarot card, generating and caching it
 * on first use. There are only 78 possible cards, so after each is drawn
 * once site-wide, every later reading gets an instant cache hit instead of
 * a new DALL-E call. Returns null (never throws) if the name isn't
 * recognized or generation fails — the reading still delivers without it.
 */
export async function getTarotCardImageUrl(rawCardName: string | undefined | null): Promise<string | null> {
  const cardName = matchTarotCard(rawCardName);
  if (!cardName) return null;

  const supabase = getSupabase();

  const { data: cached } = await supabase
    .from("tarot_card_images")
    .select("image_url")
    .eq("card_name", cardName)
    .maybeSingle();

  if (cached?.image_url) return cached.image_url;

  const imageUrl = await generateAndPersistCard(cardName);
  if (!imageUrl) return null;

  const { error: insertError } = await supabase
    .from("tarot_card_images")
    .upsert({ card_name: cardName, image_url: imageUrl }, { onConflict: "card_name" });

  if (insertError) {
    // Non-fatal — the image still generated and is usable this time,
    // it just won't be cached for next time.
    console.error(`Failed to cache tarot card image for "${cardName}":`, insertError.message);
  }

  return imageUrl;
}
