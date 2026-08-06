import { getSupabase } from "@/lib/supabase";
import { getSupabaseServer } from "@/lib/supabase-server";

/**
 * Signs the current browser (via its cookies) into the given email's account,
 * without requiring a magic-link click. Used to keep a customer signed in
 * right after a Stripe purchase — must be called from a Route Handler
 * (cookies() is read-only in Server Components).
 */
export async function establishSessionForEmail(email: string): Promise<{ error: string | null }> {
  const admin = getSupabase();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (error || !data?.properties?.hashed_token) {
    return { error: error?.message ?? "Failed to generate sign-in link" };
  }

  const supabase = await getSupabaseServer();
  const { error: verifyError } = await supabase.auth.verifyOtp({
    token_hash: data.properties.hashed_token,
    type: "magiclink",
  });

  return { error: verifyError?.message ?? null };
}
