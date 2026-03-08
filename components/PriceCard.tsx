"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PriceCardProps {
  answers: Record<string, string>;
}

export default function PriceCard({ answers }: PriceCardProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto text-center"
    >
      <div className="glass-card p-8 md:p-10">
        <p className="text-sm uppercase tracking-widest text-aura-glow mb-2">
          Your Soulmate Sketch
        </p>
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
          Reveal Your Match
        </h2>

        {/* Price display */}
        <div className="mb-6">
          <span className="text-aura-soft/50 line-through text-lg mr-2">
            $59.90
          </span>
          <span className="text-5xl font-bold text-white">$1.29</span>
          <span className="text-aura-soft/70 text-sm ml-1">USD</span>
        </div>

        {/* Discount badge */}
        <div className="inline-block bg-aura-rose/20 border border-aura-rose/40 rounded-full px-4 py-1 mb-6">
          <span className="text-aura-rose text-sm font-medium">
            97.9% OFF — Limited Time
          </span>
        </div>

        <ul className="text-left text-aura-soft/80 text-sm space-y-2 mb-8">
          <li className="flex items-center gap-2">
            <span className="text-aura-gold">&#10022;</span> Hand-sketched
            soulmate portrait
          </li>
          <li className="flex items-center gap-2">
            <span className="text-aura-gold">&#10022;</span> Delivered to your
            inbox within 24 hours
          </li>
          <li className="flex items-center gap-2">
            <span className="text-aura-gold">&#10022;</span> Based on your
            cosmic profile
          </li>
        </ul>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-aura-violet to-aura-rose text-white font-semibold text-lg transition-opacity disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Preparing…" : "Get My Sketch — $1.29"}
        </motion.button>
      </div>
    </motion.div>
  );
}
