"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getTeaser } from "@/lib/teasers";
import { useDiscount } from "@/components/DiscountProvider";
import { applyDiscount } from "@/lib/new-user-discount";
import CountdownTimer from "@/components/CountdownTimer";
import type { Reading } from "@/lib/readings";

interface TeaserPreviewProps {
  reading: Reading;
  answers: Record<string, string>;
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

type Phase = "checking" | "paywall" | "unlocking" | "unlock-error";

export default function TeaserPreview({ reading, answers }: TeaserPreviewProps) {
  const [phase, setPhase] = useState<Phase>("checking");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryType, setDeliveryType] = useState<"standard" | "express">("standard");

  const teaser = getTeaser(reading.id, answers);
  const isSketch = reading.expressAvailable === true;
  const EXPRESS_PRICE = 1499; // $14.99

  // New-visitor discount applies to standard delivery only — Express stays
  // full price. The actual charge is always recomputed server-side from the
  // same first-visit cookie in /api/checkout; this is display only.
  const { percent: discountPercent, tierEndsAt } = useDiscount();
  const isExpressSelected = isSketch && deliveryType === "express";
  const standardPrice = applyDiscount(reading.price, discountPercent);
  const hasStandardDiscount = discountPercent > 0;
  const showDiscountOnSummary = hasStandardDiscount && !isExpressSelected;

  const displayPrice = isExpressSelected ? EXPRESS_PRICE : standardPrice;

  const submitUnlock = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: { ...answers, reading_id: reading.id },
          deliveryType,
        }),
      });
      const data = await res.json();
      if (data.orderId) {
        window.location.href = `/reading/view/${data.orderId}`;
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong");
        setLoading(false);
        setPhase("unlock-error");
      }
    } catch {
      setError("Connection failed. Please try again.");
      setLoading(false);
      setPhase("unlock-error");
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/checkout/status?reading_id=${encodeURIComponent(reading.id)}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.eligible) {
          setPhase("unlocking");
          submitUnlock();
        } else {
          setPhase("paywall");
        }
      } catch {
        if (!cancelled) setPhase("paywall");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading.id]);

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
          {reading.title}
        </p>

        <h2 className="font-serif text-3xl md:text-4xl text-bone mb-4">
          {teaser.headline}
        </h2>

        <p className="text-mist/80 leading-relaxed mb-6">{teaser.preview}</p>

        <div className="mystic-divider mb-6" />

        {/* Blurred preview lines */}
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

        <div className="relative -mt-16 h-16 bg-gradient-to-t from-[#0a0510] to-transparent pointer-events-none" />
      </div>

      {(phase === "checking" || phase === "unlocking") && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-8 text-center"
        >
          {phase === "unlocking" ? (
            <>
              <p className="text-sm text-gold font-medium mb-1">
                ✦ Included in your collection
              </p>
              <p className="text-xs text-ash">
                Unlocking — your full reading will be emailed to you within 24 hours.
              </p>
            </>
          ) : (
            <p className="text-xs text-ash">Checking your collection…</p>
          )}
        </motion.div>
      )}

      {/* Unlock paywall */}
      {(phase === "paywall" || phase === "unlock-error") && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-8 text-center"
        >
          <p className="text-sm text-gold font-medium mb-1">{teaser.hookLine}</p>
          <p className="text-xs text-ash mb-6">
            Unlock your complete reading for a one-time payment.
          </p>

          {/* Express toggle — only for readings with expressAvailable */}
          {isSketch && (
            <div className="mb-6">
              <p className="text-xs text-ash mb-3 uppercase tracking-[0.2em]">
                Delivery Speed
              </p>
              <div className="flex rounded-xl overflow-hidden border border-white/[0.08]">
                <button
                  onClick={() => setDeliveryType("standard")}
                  className={`flex-1 py-3 px-4 text-sm transition-colors cursor-pointer ${
                    deliveryType === "standard"
                      ? "bg-orchid/20 text-orchid"
                      : "text-ash hover:text-mist"
                  } border-r border-white/[0.08]`}
                >
                  <span className="block font-medium">Standard</span>
                  <span className="text-xs opacity-70">
                    24 hours &middot;{" "}
                    {hasStandardDiscount ? (
                      <>
                        <span className="line-through opacity-60">{formatPrice(reading.price)}</span>{" "}
                        {formatPrice(standardPrice)}
                      </>
                    ) : (
                      formatPrice(reading.price)
                    )}
                  </span>
                </button>
                <button
                  onClick={() => setDeliveryType("express")}
                  className={`flex-1 py-3 px-4 text-sm transition-colors cursor-pointer ${
                    deliveryType === "express"
                      ? "bg-gold/10 text-gold"
                      : "text-ash hover:text-mist"
                  }`}
                >
                  <span className="block font-medium">{"⚡"} Express</span>
                  <span className="text-xs opacity-70">
                    30 min &middot; {formatPrice(EXPRESS_PRICE)}
                  </span>
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            {showDiscountOnSummary && (
              <p className="mb-2">
                <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-xs font-medium px-3 py-1.5 rounded-full">
                  ✦ {discountPercent}% New Visitor Discount
                  {tierEndsAt && (
                    <>
                      {" "}
                      &middot; ends in{" "}
                      <CountdownTimer target={tierEndsAt} expiredLabel="ending soon" />
                    </>
                  )}
                </span>
              </p>
            )}
            {showDiscountOnSummary && (
              <span className="text-mist/40 text-lg line-through mr-2">
                {formatPrice(reading.price)}
              </span>
            )}
            <span className="text-4xl font-serif text-bone">
              {formatPrice(displayPrice)}
            </span>
            <span className="text-mist/40 text-sm ml-2">one-time</span>
          </div>

          <ul className="text-left text-mist/60 text-sm space-y-2 mb-6 max-w-xs mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-gold text-xs mt-0.5">{"✦"}</span>
              <span>Full detailed reading delivered to your inbox</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold text-xs mt-0.5">{"✦"}</span>
              <span>Personalized to your exact cosmic profile</span>
            </li>
            {isSketch && deliveryType === "express" ? (
              <li className="flex items-start gap-2">
                <span className="text-gold text-xs mt-0.5">{"⚡"}</span>
                <span>Express — arrives in your inbox within 30 minutes</span>
              </li>
            ) : (
              <li className="flex items-start gap-2">
                <span className="text-gold text-xs mt-0.5">{"✦"}</span>
                <span>Yours to keep forever &mdash; no subscription</span>
              </li>
            )}
          </ul>

          {error && (
            <p className="text-dusty-rose text-sm mb-4">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={submitUnlock}
            disabled={loading}
            className="btn-mystic w-full py-4 text-white text-base disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? "Preparing…"
              : `Unlock Full Reading — ${formatPrice(displayPrice)}`}
          </motion.button>

          <p className="mt-4 text-[10px] text-ash/40">
            Secure one-time payment via Stripe.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
