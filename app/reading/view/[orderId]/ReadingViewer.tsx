"use client";

import { useState } from "react";
import Link from "next/link";

interface OrderProps {
  id: string;
  reading_id: string;
  reading_html: string | null;
  content_expires_at: string | null;
  status: string;
}

interface ReadingViewerProps {
  order: OrderProps;
  daysRemaining: number;
  isExpired: boolean;
  title: string;
}

export default function ReadingViewer({
  order,
  daysRemaining,
  isExpired,
  title,
}: ReadingViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleArchiveRetrieval = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout");
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  // Order still processing
  if (order.status === "processing") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <p className="font-serif text-xl text-bone mb-3">{title}</p>
          <p className="text-sm text-mist/70">
            Your reading is being prepared — check your email when it&apos;s ready.
          </p>
          <div className="mt-6">
            <Link href="/dashboard" className="text-xs text-orchid hover:text-bone transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Content expired — show archive retrieval UI
  if (isExpired && order.reading_html) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <p className="font-serif text-xl text-bone mb-3">{title}</p>
          <p className="text-sm text-mist/70 mb-6">
            Your 60-day access window has closed. Retrieve this reading for another 60 days for just $1.99.
          </p>
          {error && (
            <p className="text-xs text-red-400 mb-4">{error}</p>
          )}
          <button
            onClick={handleArchiveRetrieval}
            disabled={loading}
            className="btn-mystic w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Redirecting…" : "Retrieve Archive — $1.99"}
          </button>
          <div className="mt-6">
            <Link href="/dashboard" className="text-xs text-ash hover:text-orchid transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // No content available
  if (!order.reading_html) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <p className="font-serif text-xl text-bone mb-3">{title}</p>
          <p className="text-sm text-mist/70">Content not available.</p>
          <div className="mt-6">
            <Link href="/dashboard" className="text-xs text-orchid hover:text-bone transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Normal view — reading content available and not expired
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <Link
          href="/dashboard"
          className="text-xs text-orchid hover:text-bone transition-colors"
        >
          ← Dashboard
        </Link>
        <div className="flex items-center gap-4">
          {daysRemaining > 0 && (
            <span className="text-xs text-ash">
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
            </span>
          )}
          <button
            onClick={() => window.print()}
            className="text-xs text-mist/70 hover:text-bone transition-colors border border-white/10 rounded px-3 py-1"
          >
            Save / Print
          </button>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: order.reading_html }}
      />
    </main>
  );
}
