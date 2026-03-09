"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { getTeaser } from "@/lib/teasers";

interface TeaserPreviewProps {
  readingId: string;
  readingTitle: string;
  answers: Record<string, string>;
}

export default function TeaserPreview({
  readingId,
  readingTitle,
  answers,
}: TeaserPreviewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const teaser = getTeaser(readingId, answers);

  const handleUnlock = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: { ...answers, reading_id: readingId } }),
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
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Teaser result */}
      <div className="glass-card p-8 md:p-10 mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-orchid/60 mb-4">
          {readingTitle}
        </p>

        <h2 className="font-serif text-3xl md:text-4xl text-bone mb-4">
          {teaser.headline}
        </h2>

        <p className="text-mist/80 leading-relaxed mb-6">{teaser.preview}</p>

        <div className="mystic-divider mb-6" />

        {/* Blurred lines — the trickle */}
        <div className="space-y-3 mb-6">
          {teaser.blurredLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="text-sm text-mist/50 leading-relaxed select-none"
              style={{ filter: "blur(3px)", WebkitUserSelect: "none" }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Fade overlay on blurred content */}
        <div className="relative -mt-16 h-16 bg-gradient-to-t from-[#0a0510] to-transparent pointer-events-none" />
      </div>

      {/* Unlock paywall */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="glass-card p-8 text-center"
      >
        <p className="text-sm text-gold font-medium mb-1">
          {teaser.hookLine}
        </p>
        <p className="text-xs text-ash mb-6">
          Unlock your complete reading for a one-time payment.
        </p>

        <div className="mb-6">
          <span className="text-4xl font-serif text-bone">$6.99</span>
          <span className="text-mist/40 text-sm ml-2">one-time</span>
        </div>

        <ul className="text-left text-mist/60 text-sm space-y-2 mb-6 max-w-xs mx-auto">
          <li className="flex items-start gap-2">
            <span className="text-gold text-xs mt-0.5">{"\u2726"}</span>
            <span>Full detailed reading delivered to your inbox</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold text-xs mt-0.5">{"\u2726"}</span>
            <span>Personalized to your exact cosmic profile</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gold text-xs mt-0.5">{"\u2726"}</span>
            <span>Yours to keep forever &mdash; no subscription</span>
          </li>
        </ul>

        {error && (
          <p className="text-dusty-rose text-sm mb-4">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleUnlock}
          disabled={loading}
          className="btn-mystic w-full py-4 text-white text-base disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Preparing\u2026" : "Unlock Full Reading \u2014 $6.99"}
        </motion.button>

        <p className="mt-4 text-[10px] text-ash/40">
          Secure one-time payment via Stripe.
        </p>
      </motion.div>
    </motion.div>
  );
}
