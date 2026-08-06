import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase-server";
import { getSupabase } from "@/lib/supabase";
import { readings, categoryOrder } from "@/lib/readings";
import { hasActiveSubscription } from "@/lib/subscriptions";
import { normalizeEmail } from "@/lib/email";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await getSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const email = normalizeEmail(user.email!);

  const admin = getSupabase();
  const { data: orders } = await admin
    .from("orders")
    .select("id, reading_id, status, content_expires_at")
    .eq("email", email);

  const allOrders = orders || [];

  // Check if the user has purchased the complete bundle
  const hasBundle = allOrders.some(
    (o: { reading_id: string; status: string }) =>
      o.reading_id === "complete-bundle" && o.status === "delivered"
  );

  // If bundle is active, mark ALL reading IDs as purchased
  const purchasedIds = hasBundle
    ? readings.map((r) => r.id)
    : Array.from(
        new Set(
          allOrders.map((o: { reading_id: string }) => o.reading_id)
        )
      );

  const hasTarotAstrologySub = await hasActiveSubscription(email);

  return (
    <DashboardClient
      userEmail={email}
      readings={readings}
      categoryOrder={categoryOrder}
      purchasedIds={purchasedIds}
      orders={allOrders}
      hasBundle={hasBundle}
      hasTarotAstrologySub={hasTarotAstrologySub}
    />
  );
}
