"use client";

import { motion } from "framer-motion";
import { readings, categoryOrder } from "@/lib/readings";
import CategorySection from "@/components/CategorySection";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-xs uppercase tracking-[0.35em] text-orchid/60 mb-6"
        >
          Navigate your life through modern astrology
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-5xl md:text-7xl font-normal text-bone leading-[1.1] mb-6 max-w-2xl"
        >
          Your Cosmic
          <br />
          <em className="text-orchid">Insights</em>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base md:text-lg text-mist max-w-lg mb-8 leading-relaxed"
        >
          Sketch readings, tarot pulls, birth charts, and more.
          Everything you need to understand yourself and the ones you love.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="space-y-1"
        >
          <p className="text-sm text-gold font-medium">
            Take the quiz free &middot; Unlock your full reading for $6.99
          </p>
          <p className="text-xs text-ash">
            One-time payment per reading &middot; No subscription
          </p>
        </motion.div>
      </section>

      {/* Readings by category */}
      <section className="px-6 pb-12 max-w-6xl mx-auto w-full">
        <div className="mystic-divider mb-16" />

        {categoryOrder.map((category) => {
          const categoryReadings = readings.filter(
            (r) => r.category === category
          );
          return (
            <CategorySection
              key={category}
              category={category}
              readings={categoryReadings}
            />
          );
        })}
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <div className="mystic-divider mb-8 max-w-lg mx-auto" />
        <p className="text-xs text-ash/50">
          PerfectLove &middot; Navigate your love life through modern astrology
        </p>
      </footer>
    </main>
  );
}
