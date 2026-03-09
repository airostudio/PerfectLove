"use client";

import { motion } from "framer-motion";
import type { Reading, ReadingCategory } from "@/lib/readings";
import { categoryLabels } from "@/lib/readings";
import ReadingCard from "@/components/ReadingCard";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

interface DashboardClientProps {
  userEmail: string;
  readings: Reading[];
  categoryOrder: ReadingCategory[];
  purchasedIds: string[];
}

export default function DashboardClient({
  userEmail,
  readings,
  categoryOrder,
  purchasedIds,
}: DashboardClientProps) {
  const router = useRouter();
  const purchased = new Set(purchasedIds);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/");
  };

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
      <section className="px-6 pt-8 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-4xl md:text-5xl text-bone mb-3"
        >
          Your Readings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-mist/60 text-sm"
        >
          Take the quiz free &middot; Unlock your full reading for $6.99
        </motion.p>
      </section>

      {/* Purchased readings */}
      {purchased.size > 0 && (
        <section className="px-6 pb-12 max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-serif text-2xl text-bone mb-2">
              Your Purchased Readings
            </h2>
            <p className="text-sm text-ash">
              These readings are unlocked and ready for you.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {readings
              .filter((r) => purchased.has(r.id))
              .map((reading, i) => (
                <ReadingCard key={reading.id} reading={reading} index={i} />
              ))}
          </div>
          <div className="mystic-divider mt-12" />
        </section>
      )}

      {/* All readings by category */}
      <section className="px-6 pb-12 max-w-6xl mx-auto w-full">
        {categoryOrder.map((category) => {
          const { title, subtitle } = categoryLabels[category];
          const categoryReadings = readings.filter(
            (r) => r.category === category
          );

          return (
            <section key={category} className="mb-16">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="font-serif text-2xl md:text-3xl text-bone mb-2">
                  {title}
                </h2>
                <p className="text-sm text-ash">{subtitle}</p>
              </motion.div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryReadings.map((reading, i) => (
                  <ReadingCard key={reading.id} reading={reading} index={i} />
                ))}
              </div>
            </section>
          );
        })}
      </section>

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
