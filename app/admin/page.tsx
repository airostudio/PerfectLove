import { getSupabase } from "@/lib/supabase";
import type { OrderRecord } from "@/lib/supabase";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data, error } = await getSupabase()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-10 text-center">
          <p className="text-red-400">Failed to load orders: {error.message}</p>
        </div>
      </main>
    );
  }

  return <AdminDashboard orders={(data as OrderRecord[]) ?? []} />;
}
