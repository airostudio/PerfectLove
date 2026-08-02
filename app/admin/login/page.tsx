"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Invalid secret");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-10 max-w-sm w-full text-center">
        <p className="text-xs tracking-widest uppercase text-orchid mb-6">PerfectLove</p>
        <h1 className="font-serif text-2xl text-bone mb-8">Admin Access</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="secret" className="sr-only">Admin secret</label>
            <input
              id="secret"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Admin secret"
              autoComplete="current-password"
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-bone placeholder-ash text-sm focus:outline-none focus:border-orchid/40 transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !secret}
            className="btn-mystic w-full py-3 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
