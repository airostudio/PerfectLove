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
  reading_id: string;
  answers: Record<string, string>;
  stripe_session_id: string;
  amount_paid: number;
  status: "processing" | "delivered";
  delivery_type: "standard" | "express";
  delivery_at: string;
  image_url: string | null;
  created_at: string;
}
