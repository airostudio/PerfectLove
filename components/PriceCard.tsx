"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PriceCardProps {
  answers: Record<string, string>;
}

export default function PriceCard({ answers }: PriceCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      setError("Connection failed. Please try again.");
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
        <p className="text-xs uppercase tracking-[0.3em] text-orchid/60 mb-3">
          Your cosmic reading is ready
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-bone mb-2">
          Reveal Your Match
        </h2>
        <p className="text-sm text-mist/60 mb-8">
          A hand-sketched soulmate portrait based on your unique cosmic
          blueprint.
        </p>

        {/* Price display */}
        <div className="mb-2">
          <span className="text-5xl font-serif text-bone">$1.29</span>
          <span className="text-mist/50 text-sm ml-2">first month</span>
        </div>
        <p className="text-xs text-ash mb-6">
          Then $16.99/mo &middot; Cancel anytime
        </p>

        {/* Discount badge */}
        <div className="inline-block bg-amethyst/10 border border-amethyst/25 rounded-full px-4 py-1.5 mb-8">
          <span className="text-orchid text-xs font-medium tracking-wide">
            92% OFF YOUR FIRST MONTH
          </span>
        </div>

        {/* What you get */}
        <div className="mystic-divider mb-6" />
        <ul className="text-left text-mist/70 text-sm space-y-3 mb-8">
          <li className="flex items-start gap-3">
            <span className="text-gold text-xs mt-0.5">{"\u2726"}</span>
            <span>Hand-sketched soulmate portrait delivered within 24 hours</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gold text-xs mt-0.5">{"\u2726"}</span>
            <span>Monthly personalized cosmic love readings</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-gold text-xs mt-0.5">{"\u2726"}</span>
            <span>Compatibility insights based on planetary alignments</span>
          </li>
        </ul>

        {error && (
          <p className="text-dusty-rose text-sm mb-4">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCheckout}
          disabled={loading}
          className="btn-mystic w-full py-4 text-white text-base disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Preparing\u2026" : "Start My Reading \u2014 $1.29"}
        </motion.button>

        <p className="mt-4 text-[10px] text-ash/40 leading-relaxed">
          Secure payment via Stripe. Your subscription renews at $16.99/mo
          after the first month. Cancel anytime from your account.
        </p>
      </div>
    </motion.div>
  );
}
