"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-aura-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 glass-card p-10 md:p-14 max-w-lg text-center"
      >
        <div className="text-5xl mb-6">&#10024;</div>
        <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
          The Stars Are Aligning
        </h1>
        <p className="text-aura-soft/70 mb-8">
          Your soulmate sketch is being crafted with cosmic care. Check your
          inbox within <span className="text-aura-gold font-medium">24 hours</span> for
          the reveal.
        </p>
        <Link href="/">
          <span className="text-aura-glow hover:text-white transition-colors text-sm cursor-pointer">
            &larr; Return Home
          </span>
        </Link>
      </motion.div>
    </main>
  );
}
