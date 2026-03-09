"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-xs uppercase tracking-[0.35em] text-orchid/60 mb-6"
        >
          Written in the stars
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal text-bone leading-[1.1] mb-6 max-w-3xl"
        >
          The Universe Knows
          <br />
          <em className="text-orchid">Your Person</em>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base md:text-lg text-mist max-w-md mb-10 leading-relaxed"
        >
          Four questions. Your cosmic blueprint. A hand-sketched portrait
          of the soul meant to find yours.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <Link href="/quiz">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-mystic inline-block px-10 py-4 text-white text-base cursor-pointer"
            >
              Begin Your Reading
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-8 space-y-1"
        >
          <p className="text-sm text-gold font-medium">
            First month just $1.29
          </p>
          <p className="text-xs text-ash">
            Then $16.99/mo &middot; Cancel anytime
          </p>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="mystic-divider mb-16" />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            {[
              {
                icon: "\u2727",
                title: "Reflect",
                desc: "Answer 4 questions about your inner world and cosmic energy.",
              },
              {
                icon: "\u2726",
                title: "Align",
                desc: "We map your answers to celestial patterns and planetary rhythms.",
              },
              {
                icon: "\u2728",
                title: "Reveal",
                desc: "Receive a hand-sketched portrait of your soulmate within 24 hours.",
              },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-2xl mb-3">{item.icon}</p>
                <h3 className="font-serif text-xl text-bone mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-mist/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
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
