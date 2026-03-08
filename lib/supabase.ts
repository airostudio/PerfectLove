import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _supabase;
}

export interface OrderRecord {
  id: string;
  email: string;
  answers: Record<string, string>;
  stripe_session_id: string;
  status: "processing" | "delivered";
  delivery_at: string;
  created_at: string;
}
