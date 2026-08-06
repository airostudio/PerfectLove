"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getReading } from "@/lib/readings";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function SuccessContent() {
  const params = useSearchParams();
  const readingParam = params.get("reading") ?? "";
  const reading = getReading(readingParam);
  const title = reading?.title ?? null;

  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getSupabaseBrowser()
      .auth.getUser()
      .then(({ data }) => {
        if (!cancelled && data.user) setSignedIn(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-card p-10 md:p-14 max-w-lg text-center"
    >
      <p className="text-3xl mb-6">{"✨"}</p>

      <h1 className="font-serif text-3xl md:text-4xl text-bone mb-4">
        The Stars Are Aligning
      </h1>

      <p className="text-mist/70 mb-4 leading-relaxed">
        {title ? (
          <>
            Your{" "}
            <span className="text-gold font-medium">{title}</span> is being
            crafted with cosmic care.{" "}
          </>
        ) : (
          "Your reading is being crafted with cosmic care. "
        )}
        Check your inbox within{" "}
        <span className="text-gold font-medium">24 hours</span> for the full
        reveal.
      </p>

      <p className="text-xs text-ash mb-8">
        A confirmation has been sent to your email. Your complete personalized
        reading will follow within 24 hours.
      </p>

      {signedIn && (
        <>
          <div className="mystic-divider mb-6" />
          <p className="text-xs text-mist/60 mb-4">
            You&apos;re signed in — your reading will appear in your
            dashboard as soon as it&apos;s ready.
          </p>
          <Link href="/dashboard">
            <span className="btn-mystic inline-block px-6 py-3 text-white text-sm cursor-pointer mb-6">
              Go to My Dashboard
            </span>
          </Link>
        </>
      )}

      <div className="mystic-divider mb-6" />

      <Link href="/">
        <span className="text-orchid hover:text-bone transition-colors text-sm cursor-pointer">
          &larr; Explore more readings
        </span>
      </Link>
    </motion.div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <Suspense
        fallback={
          <div className="glass-card p-10 md:p-14 max-w-lg text-center">
            <p className="text-3xl mb-6">{"✨"}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-bone mb-4">
              The Stars Are Aligning
            </h1>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
