"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getSupabaseBrowser();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-10 md:p-14 max-w-md w-full text-center"
      >
        {!sent ? (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-orchid/60 mb-4">
              Welcome to PerfectLove
            </p>
            <h1 className="font-serif text-3xl md:text-4xl text-bone mb-3">
              Sign In
            </h1>
            <p className="text-sm text-mist/60 mb-8 leading-relaxed">
              Enter your email and we&apos;ll send you a magic link.
              No password needed.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-bone placeholder:text-ash/50 focus:outline-none focus:border-orchid/40 transition-colors text-sm"
              />

              {error && (
                <p className="text-dusty-rose text-sm">{error}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-mystic w-full py-3.5 text-white text-sm disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Sending\u2026" : "Send Magic Link"}
              </motion.button>
            </form>
          </>
        ) : (
          <>
            <p className="text-3xl mb-6">{"\u2728"}</p>
            <h1 className="font-serif text-3xl text-bone mb-3">
              Check Your Inbox
            </h1>
            <p className="text-sm text-mist/60 leading-relaxed">
              We sent a magic link to{" "}
              <span className="text-orchid font-medium">{email}</span>.
              Click the link in the email to sign in.
            </p>
          </>
        )}

        <div className="mystic-divider my-6" />

        <Link
          href="/"
          className="text-xs text-ash hover:text-orchid transition-colors"
        >
          &larr; Back home
        </Link>
      </motion.div>
    </main>
  );
}
