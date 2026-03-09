import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabase } from "@/lib/supabase";
import { readings, categoryOrder } from "@/lib/readings";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  // Fetch user's purchased readings using the admin client
  const admin = getSupabase();
  const { data: orders } = await admin
    .from("orders")
    .select("reading_id, status")
    .eq("email", user.email!);

  const purchasedIds = new Set(
    (orders || []).map((o: { reading_id: string }) => o.reading_id)
  );

  return (
    <DashboardClient
      userEmail={user.email!}
      readings={readings}
      categoryOrder={categoryOrder}
      purchasedIds={Array.from(purchasedIds)}
    />
  );
}
