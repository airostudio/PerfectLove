import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabase } from "@/lib/supabase";
import { readings, categoryOrder } from "@/lib/readings";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // Auth disabled during development — restore user check when re-enabling auth
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  const email = user?.email ?? "dev@localhost";

  const admin = getSupabase();
  const { data: orders } = user
    ? await admin
        .from("orders")
        .select("reading_id, status")
        .eq("email", email)
    : { data: [] };

  const purchasedIds = new Set(
    (orders || []).map((o: { reading_id: string }) => o.reading_id)
  );

  return (
    <DashboardClient
      userEmail={email}
      readings={readings}
      categoryOrder={categoryOrder}
      purchasedIds={Array.from(purchasedIds)}
    />
  );
}
