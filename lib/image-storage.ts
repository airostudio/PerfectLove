import { randomUUID } from "crypto";
import { getSupabase } from "@/lib/supabase";

// DALL-E's returned URL is only valid for ~1 hour, but generated images get
// embedded in emails that may be opened days later and in dashboard views
// that stay live for weeks — so download once and re-host permanently.
export async function persistImageToStorage(
  tempUrl: string,
  bucket: string,
  path: string = `${randomUUID()}.png`
): Promise<string | null> {
  try {
    const res = await fetch(tempUrl);
    if (!res.ok) {
      console.error(`persistImageToStorage: failed to download temp image, status ${res.status}`);
      return null;
    }
    const bytes = new Uint8Array(await res.arrayBuffer());

    const { error } = await getSupabase()
      .storage.from(bucket)
      .upload(path, bytes, { contentType: "image/png" });

    if (error) {
      console.error(`persistImageToStorage: upload to ${bucket}/${path} failed:`, error.message);
      return null;
    }

    const { data } = getSupabase().storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.error("persistImageToStorage: failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
