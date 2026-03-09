"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card p-10 md:p-14 max-w-lg text-center"
      >
        <p className="text-3xl mb-6">{"\u2728"}</p>

        <h1 className="font-serif text-3xl md:text-4xl text-bone mb-4">
          The Stars Are Aligning
        </h1>

        <p className="text-mist/70 mb-4 leading-relaxed">
          Your reading is being crafted with cosmic care. Check your inbox
          within{" "}
          <span className="text-gold font-medium">24 hours</span> for the full
          reveal.
        </p>

        <p className="text-xs text-ash mb-8">
          A confirmation has been sent to your email. Your complete personalized
          reading will follow within 24 hours.
        </p>

        <div className="mystic-divider mb-6" />

        <Link href="/">
          <span className="text-orchid hover:text-bone transition-colors text-sm cursor-pointer">
            &larr; Explore more readings
          </span>
        </Link>
      </motion.div>
    </main>
  );
}
