"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { OrderRecord } from "@/lib/supabase";
import { readingMeta } from "@/lib/deliver-order";

type Filter = "all" | "processing" | "delivered" | "overdue";
type Tab = "orders" | "marketing";

function isOverdue(order: OrderRecord): boolean {
  return order.status === "processing" && new Date(order.delivery_at) < new Date();
}

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function readingTitle(id: string): string {
  return readingMeta[id]?.title ?? id.replace(/-/g, " ");
}

function StatusBadge({ order }: { order: OrderRecord }) {
  if (order.status === "delivered") {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-900/40 text-emerald-400 border border-emerald-700/30">Delivered</span>;
  }
  if (isOverdue(order)) {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-red-900/40 text-red-400 border border-red-700/30">Overdue</span>;
  }
  return <span className="px-2 py-0.5 rounded-full text-xs bg-amber-900/40 text-amber-400 border border-amber-700/30">Processing</span>;
}

function downloadCSV(orders: OrderRecord[]) {
  const headers = ["Email", "Reading", "Status", "Amount (USD)", "Delivery Type", "Purchased At"];
  const rows = orders.map((o) => [
    o.email,
    readingTitle(o.reading_id),
    isOverdue(o) ? "overdue" : o.status,
    (o.amount_paid / 100).toFixed(2),
    o.delivery_type,
    new Date(o.created_at).toISOString(),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `perfectlove-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface DeliverState {
  loading: Set<string>;
  results: Map<string, "ok" | string>;
}

export default function AdminDashboard({ orders }: { orders: OrderRecord[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [filter, setFilter] = useState<Filter>("all");
  const [deliverState, setDeliverState] = useState<DeliverState>({
    loading: new Set(),
    results: new Map(),
  });
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = useCallback(async (orderId: string, email: string) => {
    if (!confirm(`Delete this order (${email})? This can't be undone.`)) return;

    setDeletingIds((prev) => new Set([...prev, orderId]));
    const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(`Failed to delete: ${data.error ?? "Unknown error"}`);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  }, [router]);

  const totalRevenue = orders.reduce((s, o) => s + o.amount_paid, 0);
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const processing = orders.filter((o) => o.status === "processing" && !isOverdue(o)).length;
  const overdue = orders.filter(isOverdue).length;

  const visibleOrders = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "overdue") return isOverdue(o);
    return o.status === filter;
  });

  const handleDeliver = useCallback(async (orderId: string) => {
    setDeliverState((prev) => ({
      loading: new Set([...prev.loading, orderId]),
      results: prev.results,
    }));

    const res = await fetch(`/api/admin/deliver/${orderId}`, { method: "POST" });
    const data = await res.json().catch(() => ({}));

    setDeliverState((prev) => {
      const next = new Set(prev.loading);
      next.delete(orderId);
      const results = new Map(prev.results);
      results.set(orderId, res.ok ? "ok" : (data.error ?? "Failed"));
      return { loading: next, results };
    });

    if (res.ok) router.refresh();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  // Marketing: unique customers with their purchase history
  const customerMap = new Map<string, { readings: string[]; total: number; firstAt: string }>();
  for (const o of orders) {
    const existing = customerMap.get(o.email);
    if (!existing) {
      customerMap.set(o.email, { readings: [readingTitle(o.reading_id)], total: o.amount_paid, firstAt: o.created_at });
    } else {
      existing.readings.push(readingTitle(o.reading_id));
      existing.total += o.amount_paid;
      if (o.created_at < existing.firstAt) existing.firstAt = o.created_at;
    }
  }
  const customers = [...customerMap.entries()].sort((a, b) => b[1].total - a[1].total);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/5 max-w-7xl mx-auto w-full">
        <div>
          <p className="text-xs tracking-widest uppercase text-orchid mb-0.5">PerfectLove</p>
          <h1 className="font-serif text-xl text-bone">Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-ash hover:text-orchid transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </header>

      <div className="px-6 py-8 max-w-7xl mx-auto w-full space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Revenue", value: fmt(totalRevenue), sub: `${orders.length} orders total` },
            { label: "Delivered", value: String(delivered), sub: `${Math.round((delivered / (orders.length || 1)) * 100)}% success rate` },
            { label: "Processing", value: String(processing), sub: "awaiting delivery window" },
            { label: "Overdue", value: String(overdue), sub: overdue > 0 ? "needs attention" : "all clear", alert: overdue > 0 },
          ].map(({ label, value, sub, alert }) => (
            <div key={label} className={`glass-card p-5 ${alert ? "border-red-700/40" : ""}`}>
              <p className="text-xs text-ash mb-1">{label}</p>
              <p className={`font-serif text-3xl mb-1 ${alert ? "text-red-400" : "text-bone"}`}>{value}</p>
              <p className="text-xs text-ash/70">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-white/5">
          {(["orders", "marketing"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm transition-colors cursor-pointer capitalize ${
                tab === t
                  ? "text-bone border-b-2 border-orchid -mb-px"
                  : "text-ash hover:text-mist"
              }`}
            >
              {t === "orders" ? `Orders (${orders.length})` : `Marketing (${customers.length})`}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              {(["all", "processing", "delivered", "overdue"] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-colors cursor-pointer capitalize ${
                    filter === f
                      ? "bg-orchid/20 text-orchid border border-orchid/30"
                      : "text-ash border border-white/10 hover:text-mist hover:border-white/20"
                  }`}
                >
                  {f}{" "}
                  <span className="opacity-60">
                    ({f === "all" ? orders.length : f === "overdue" ? overdue : orders.filter((o) => o.status === f).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      {["Email", "Reading", "Status", "Amount", "Type", "Ordered", "Deliver By", "Action"].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs text-ash font-normal whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-ash text-sm">No orders match this filter</td>
                      </tr>
                    ) : (
                      visibleOrders.map((order) => {
                        const isLoading = deliverState.loading.has(order.id);
                        const result = deliverState.results.get(order.id);
                        return (
                          <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3 text-mist text-xs">{order.email}</td>
                            <td className="px-4 py-3 text-bone text-xs whitespace-nowrap">{readingTitle(order.reading_id)}</td>
                            <td className="px-4 py-3"><StatusBadge order={order} /></td>
                            <td className="px-4 py-3 text-mist text-xs whitespace-nowrap">{fmt(order.amount_paid)}</td>
                            <td className="px-4 py-3 text-xs text-ash capitalize">{order.delivery_type}</td>
                            <td className="px-4 py-3 text-xs text-ash whitespace-nowrap">{fmtDate(order.created_at)}</td>
                            <td className="px-4 py-3 text-xs text-ash whitespace-nowrap">{fmtDateTime(order.delivery_at)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {result === "ok" ? (
                                  <span className="text-xs text-emerald-400">Sent ✓</span>
                                ) : result ? (
                                  <span className="text-xs text-red-400" title={result}>Failed</span>
                                ) : (
                                  <button
                                    onClick={() => handleDeliver(order.id)}
                                    disabled={isLoading}
                                    className="text-xs text-orchid hover:text-bone transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                  >
                                    {isLoading ? "Sending…" : order.status === "delivered" ? "Re-deliver" : "Deliver Now"}
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(order.id, order.email)}
                                  disabled={deletingIds.has(order.id)}
                                  className="text-xs text-ash hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                  {deletingIds.has(order.id) ? "…" : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Marketing Tab */}
        {tab === "marketing" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ash">{customers.length} unique customers &middot; {fmt(totalRevenue)} total revenue</p>
              <button
                onClick={() => downloadCSV(orders)}
                className="text-xs text-orchid hover:text-bone transition-colors cursor-pointer border border-orchid/30 hover:border-orchid/60 px-3 py-1.5 rounded-full"
              >
                Export CSV
              </button>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      {["Email", "Readings Purchased", "Total Spent", "First Purchase"].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs text-ash font-normal whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(([email, { readings, total, firstAt }]) => (
                      <tr key={email} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-mist text-xs">{email}</td>
                        <td className="px-4 py-3 text-xs text-ash">
                          <div className="flex flex-wrap gap-1">
                            {readings.map((r, i) => (
                              <span key={i} className="bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-xs text-mist/70">{r}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-bone whitespace-nowrap">{fmt(total)}</td>
                        <td className="px-4 py-3 text-xs text-ash whitespace-nowrap">{fmtDate(firstAt)}</td>
                      </tr>
                    ))}
                    {customers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-ash text-sm">No customers yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
