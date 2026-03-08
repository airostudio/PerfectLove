"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-aura-violet/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-aura-rose/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 text-center max-w-2xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-aura-glow mb-4">
          Cosmic Connection
        </p>

        <h1 className="text-5xl md:text-7xl font-light text-white leading-tight mb-6">
          Discover Your
          <br />
          <span className="bg-gradient-to-r from-aura-violet to-aura-rose bg-clip-text text-transparent font-medium">
            Soulmate
          </span>
        </h1>

        <p className="text-lg text-aura-soft/70 mb-10 max-w-md mx-auto">
          Answer 4 cosmic questions and receive a hand-sketched portrait of your
          perfect match within 24 hours.
        </p>

        <Link href="/quiz">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-aura-violet to-aura-rose text-white font-semibold text-lg cursor-pointer"
          >
            Begin Your Reading
          </motion.span>
        </Link>

        <p className="mt-6 text-xs text-aura-soft/40">
          Only <span className="text-aura-gold font-medium">$1.29</span>{" "}
          <span className="line-through">$59.90</span> — 97.9% off today
        </p>
      </motion.div>
    </main>
  );
}
