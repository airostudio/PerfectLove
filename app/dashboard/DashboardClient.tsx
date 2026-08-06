"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Reading, ReadingCategory } from "@/lib/readings";
import ReadingCard from "@/components/ReadingCard";
import CategorySection from "@/components/CategorySection";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface OrderSummary {
  id: string;
  reading_id: string;
  status: string;
  content_expires_at: string | null;
}

interface DashboardClientProps {
  userEmail: string;
  readings: Reading[];
  categoryOrder: ReadingCategory[];
  purchasedIds: string[];
  orders: OrderSummary[];
  hasBundle: boolean;
  hasTarotAstrologySub: boolean;
}

export default function DashboardClient({
  userEmail,
  readings,
  categoryOrder,
  purchasedIds,
  orders,
  hasBundle,
  hasTarotAstrologySub,
}: DashboardClientProps) {
  const router = useRouter();
  const purchased = new Set(purchasedIds);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [bundleError, setBundleError] = useState<string | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleBundleCheckout = async () => {
    setBundleLoading(true);
    setBundleError(null);
    try {
      const res = await fetch("/api/checkout/bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setBundleError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setBundleError("Something went wrong. Please try again.");
    } finally {
      setBundleLoading(false);
    }
  };

  const handleSubscribeCheckout = async () => {
    setSubLoading(true);
    setSubError(null);
    try {
      const res = await fetch("/api/checkout/subscribe", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setSubError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setSubError("Something went wrong. Please try again.");
    } finally {
      setSubLoading(false);
    }
  };

  const purchasedReadings = readings.filter(
    (r) => purchased.has(r.id) && r.id !== "complete-bundle"
  );

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 max-w-6xl mx-auto w-full">
        <div>
          <p className="font-serif text-lg text-bone">PerfectLove</p>
          <p className="text-xs text-ash">{userEmail}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="text-xs text-ash hover:text-orchid transition-colors cursor-pointer"
        >
          Sign out
        </button>
      </header>

      {/* Hero */}
      <section className="px-6 pt-10 pb-12 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-gold text-sm mb-3 tracking-widest"
        >
          ✦
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-4xl md:text-5xl text-bone mb-3"
        >
          Your Sanctuary
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-ash text-sm"
        >
          {userEmail} &middot; {purchasedReadings.length} reading{purchasedReadings.length !== 1 ? "s" : ""} in your collection
        </motion.p>
      </section>

      <div className="px-6 max-w-6xl mx-auto w-full">
        {/* Bundle section */}
        {hasBundle ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5 mb-10 border border-gold/30 flex items-center gap-3"
          >
            <span className="text-gold text-base">✦</span>
            <div>
              <p className="text-bone text-sm font-serif">Complete Collection</p>
              <p className="text-ash text-xs mt-0.5">You have access to all 26 readings.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-8 md:p-10 mb-10 border border-gold/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.02) 50%, transparent 100%)",
            }}
          >
            <p className="text-gold text-xs tracking-widest uppercase mb-3">
              Limited Collection
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-bone mb-3">
              Unlock Everything
            </h2>
            <p className="text-ash text-sm mb-6">
              Every reading. One sacred collection. One price.
            </p>

            <div className="mystic-divider mb-6" />

            <ul className="space-y-3 mb-8">
              {[
                "All 26 readings — every soulmate insight, sketch, and forecast",
                "Every future reading you take, automatically included",
                "Never pay for an individual reading again",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-mist/80">
                  <span className="text-gold mt-0.5 shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl text-bone">$24.99</span>
              <div className="flex flex-col">
                <span className="text-ash text-xs">save 30% on individual readings</span>
                <span className="text-ash/60 text-xs">one-time payment</span>
              </div>
            </div>

            {bundleError && (
              <p className="text-dusty-rose text-xs mb-4">{bundleError}</p>
            )}

            <button
              onClick={handleBundleCheckout}
              disabled={bundleLoading}
              className="btn-mystic w-full py-4 text-white text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {bundleLoading
                ? "Redirecting…"
                : "Unlock Complete Collection — $24.99"}
            </button>
          </motion.div>
        )}

        {/* Tarot & Astrology monthly subscription */}
        {hasTarotAstrologySub ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-5 mb-10 border border-orchid/30 flex items-center gap-3"
          >
            <span className="text-orchid text-base">✦</span>
            <div>
              <p className="text-bone text-sm font-serif">Tarot & Astrology Monthly</p>
              <p className="text-ash text-xs mt-0.5">
                Active — pull fresh Tarot and Astrology & Numerology readings anytime.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-6 mb-10 border border-orchid/20 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between"
          >
            <div>
              <p className="text-bone text-sm font-serif mb-1">Tarot & Astrology Monthly</p>
              <p className="text-ash text-xs">
                Fresh Tarot pulls and Astrology & Numerology readings, every month — separate from the bundle.
              </p>
              {subError && (
                <p className="text-dusty-rose text-xs mt-2">{subError}</p>
              )}
            </div>
            <button
              onClick={handleSubscribeCheckout}
              disabled={subLoading}
              className="btn-mystic px-6 py-3 text-white text-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {subLoading ? "Redirecting…" : "Subscribe — $1.99/mo"}
            </button>
          </motion.div>
        )}

        {/* Purchased readings — only show when not on bundle */}
        {purchasedReadings.length > 0 && !hasBundle && (
          <section className="pb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="font-serif text-2xl text-bone mb-2">
                Your Readings
              </h2>
              <p className="text-sm text-ash">Your unlocked collection.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchasedReadings.map((reading, i) => {
                const order = orders.find((o) => o.reading_id === reading.id);
                const isContentActive =
                  order?.content_expires_at != null &&
                  new Date(order.content_expires_at) > new Date();
                return (
                  <motion.div
                    key={reading.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex flex-col gap-1"
                  >
                    <ReadingCard reading={reading} index={i} />
                    {order?.status === "delivered" &&
                      (isContentActive ? (
                        <a
                          href={`/reading/view/${order.id}`}
                          className="text-xs text-orchid hover:text-bone transition-colors self-start pl-1"
                        >
                          View Reading →
                        </a>
                      ) : (
                        <a
                          href={order ? `/reading/view/${order.id}` : "#"}
                          className="text-xs text-ash hover:text-orchid transition-colors self-start pl-1"
                        >
                          Retrieve Archive — $1.99 →
                        </a>
                      ))}
                    {order?.status === "processing" && (
                      <span className="text-xs text-amber-400/70 pl-1">
                        Preparing…
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <div className="mystic-divider mt-12" />
          </section>
        )}

        {/* Explore / Complete Collection section */}
        <section className="pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            {hasBundle ? (
              <>
                <h2 className="font-serif text-2xl text-bone mb-2">
                  Your Complete Collection
                </h2>
                <p className="text-sm text-ash">
                  All readings are included in your collection.
                </p>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-bone mb-2">
                  Explore Readings
                </h2>
                <p className="text-sm text-ash">
                  Take any quiz free &middot; Unlock the full reading for a one-time payment.
                </p>
              </>
            )}
          </motion.div>
          {categoryOrder.map((category) => (
            <CategorySection
              key={category}
              category={category}
              readings={readings.filter((r) => r.category === category)}
            />
          ))}
        </section>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 text-center mt-auto">
        <div className="mystic-divider mb-8 max-w-lg mx-auto" />
        <p className="text-xs text-ash/50">
          PerfectLove &middot; Navigate your love life through modern astrology
        </p>
      </footer>
    </main>
  );
}
