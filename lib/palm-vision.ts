import OpenAI from "openai";

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return _client;
}

export interface PalmAnalysis {
  palmDetected: boolean;
  handShape: string;
  heartLine: string;
  headLine: string;
  lifeLine: string;
  fateLine: string;
  mounts: string;
  markings: string;
}

function isPalmAnalysis(val: unknown): val is PalmAnalysis {
  if (typeof val !== "object" || val === null) return false;
  const o = val as Record<string, unknown>;
  return (
    typeof o.palmDetected === "boolean" &&
    typeof o.handShape === "string" &&
    typeof o.heartLine === "string" &&
    typeof o.headLine === "string" &&
    typeof o.lifeLine === "string" &&
    typeof o.fateLine === "string" &&
    typeof o.mounts === "string" &&
    typeof o.markings === "string"
  );
}

const SYSTEM_PROMPT = `You are a palmistry expert examining a photo of someone's palm for an entertainment palm-reading app. Describe what you actually observe in THIS specific photo — real, visible characteristics (line length, depth, curvature, branching, spacing; palm and finger proportions; any visible marks) — in the warm, evocative language of traditional palmistry. This is for entertainment and self-reflection, not a medical or scientific claim.

If the photo does not clearly show an open palm (wrong body part, too blurry, too dark, obstructed), set palmDetected to false and leave the other fields as brief, honest placeholders explaining what you could and couldn't make out.

Return JSON with this exact structure:
{
  "palmDetected": true or false,
  "handShape": "Their hand's element type (Earth/Air/Fire/Water) based on palm-to-finger proportions, and what it suggests about temperament — 1-2 sentences",
  "heartLine": "What you observe about the heart line's length, depth, and curve, and what it suggests emotionally — 1-2 sentences",
  "headLine": "What you observe about the head line's length and slope, and what it suggests about their thinking style — 1-2 sentences",
  "lifeLine": "What you observe about the life line's depth and curve — 1-2 sentences. If faint or hard to trace, say so honestly rather than inventing detail",
  "fateLine": "What you observe about the fate line, if visible — many palms don't show a strong one, which is normal; say so if that's the case rather than inventing one",
  "mounts": "Which mounts (Venus, Jupiter, Saturn, Apollo, Mercury, Mars, Luna) appear most developed or notable in this photo, and what that suggests — 1-2 sentences",
  "markings": "Any notable markings visible (stars, crosses, islands, chains, triangles) — or state plainly that none are clearly visible"
}`;

// Analyzes a palm photo in a single request and returns only a structured
// text description — the image itself is never written anywhere (no DB, no
// storage, no logs) and goes out of scope the moment this function returns.
export async function analyzePalmImage(imageDataUri: string): Promise<PalmAnalysis | null> {
  try {
    const client = getClient();
    const completion = await client.chat.completions.create(
      {
        model: "gpt-5.4-nano-2026-03-17",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this photo of a palm for a palmistry reading. Return only the JSON structure described in your instructions." },
              { type: "image_url", image_url: { url: imageDataUri } },
            ],
          },
        ],
      },
      { timeout: 30_000 }
    );

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Palm vision response was not valid JSON");
      return null;
    }

    if (!isPalmAnalysis(parsed)) {
      console.error("Palm vision response has unexpected structure");
      return null;
    }

    return parsed;
  } catch (err) {
    console.error("Palm vision analysis failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
