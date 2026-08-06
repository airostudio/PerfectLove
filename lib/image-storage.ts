import { randomUUID } from "crypto";
import { getSupabase } from "@/lib/supabase";

async function uploadBytes(bytes: Uint8Array, bucket: string, path: string): Promise<string | null> {
  const { error } = await getSupabase()
    .storage.from(bucket)
    .upload(path, bytes, { contentType: "image/png" });

  if (error) {
    console.error(`persistImageToStorage: upload to ${bucket}/${path} failed:`, error.message);
    return null;
  }

  const { data } = getSupabase().storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Generated images (from a temporary provider URL) get embedded in emails
// that may be opened days later and in dashboard views that stay live for
// weeks — so download once and re-host permanently.
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
    return await uploadBytes(bytes, bucket, path);
  } catch (err) {
    console.error("persistImageToStorage: failed:", err instanceof Error ? err.message : err);
    return null;
  }
}

// GPT image models (gpt-image-1 and later) always return base64-encoded
// image data rather than a URL — no download step needed, just decode.
export async function persistBase64ImageToStorage(
  base64: string,
  bucket: string,
  path: string = `${randomUUID()}.png`
): Promise<string | null> {
  try {
    const bytes = new Uint8Array(Buffer.from(base64, "base64"));
    return await uploadBytes(bytes, bucket, path);
  } catch (err) {
    console.error("persistBase64ImageToStorage: failed:", err instanceof Error ? err.message : err);
    return null;
  }
}
