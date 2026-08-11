"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "Take a Short Quiz",
    desc: "A couple of minutes of questions about you — your sign, your energy, your intentions. Some readings ask a bit more (like birth details for Soulmate Sketch) to make the result feel like yours.",
  },
  {
    step: "02",
    title: "Preview for Free",
    desc: "Instantly see a teaser of your reading — a real preview shaped by your answers, not a generic sample.",
  },
  {
    step: "03",
    title: "Unlock the Full Reading",
    desc: "Like what you see? Unlock the complete reading with a one-time payment, typically $1.99–$6.99 depending on the reading. Secure checkout via Stripe, no account required to buy.",
  },
  {
    step: "04",
    title: "Delivered to Your Inbox",
    desc: "Your full reading — and portrait, for sketch readings — arrives by email within 24 hours, usually sooner. Soulmate Sketch also offers 30-minute Express delivery if you don't want to wait.",
  },
  {
    step: "05",
    title: "Revisit Anytime",
    desc: "Sign in with just your email — no password — and every reading you've unlocked lives in your dashboard for 60 days. After that, restoring access is a one-time $1.99.",
  },
];

const bundles = [
  {
    title: "The Complete Reading Collection",
    price: "$24.99 one-time",
    desc: "Unlock every one of PerfectLove's 26 reading types, forever — no need to buy each one individually.",
  },
  {
    title: "Tarot & Astrology Subscription",
    price: "$1.99/month",
    desc: "Unlimited fresh tarot and astrology readings for as long as you're subscribed. Cancel anytime from your dashboard.",
  },
];

const faqs = [
  {
    q: "How much does a reading cost?",
    a: "Most readings are a one-time $6.99, with a few smaller add-on readings priced lower. There's no subscription required to buy a single reading.",
  },
  {
    q: "How long until I get my reading?",
    a: "Within 24 hours by email for standard delivery — often much sooner. Soulmate Sketch offers 30-minute Express delivery for an additional fee if you're in a hurry.",
  },
  {
    q: "Is a soulmate sketch a real photo of someone?",
    a: "No — it's an AI-generated artistic portrait shaped by your quiz answers, meant for reflection and fun, not a literal depiction of a real, specific person.",
  },
  {
    q: "Can I see my past readings again?",
    a: "Yes. Sign in with the same email you used to purchase, and everything you've unlocked is in your dashboard for 60 days. After that, a small fee restores access.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function HowItWorksContent() {
  return (
    <main className="min-h-screen px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block text-xs text-ash hover:text-orchid transition-colors mb-10"
        >
          &larr; Back to PerfectLove
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-3">
            Simple &amp; Sacred
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-bone mb-4">
            How PerfectLove Works
          </h1>
          <p className="text-sm text-mist/60 max-w-lg mx-auto leading-relaxed">
            From a two-minute quiz to a reading in your inbox — here&apos;s
            exactly what happens, and what it costs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className={`glass-card p-8 ${i === steps.length - 1 ? "md:col-span-2" : ""}`}
            >
              <p className="font-serif text-4xl text-orchid/30 mb-4">
                {item.step}
              </p>
              <h3 className="font-serif text-xl text-bone mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-mist/60 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mystic-divider mb-16" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-10"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-3">
            Want More Than One Reading?
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-bone">
            Bundles &amp; Subscriptions
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {bundles.map((b, i) => (
            <motion.div
              key={b.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="glass-card p-8 text-center"
            >
              <h3 className="font-serif text-xl text-bone mb-2">{b.title}</h3>
              <p className="text-gold text-sm font-medium mb-4">{b.price}</p>
              <p className="text-sm text-mist/60 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mystic-divider mb-16" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-bone">
            Common Questions
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6 mb-16">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="glass-card p-6"
            >
              <h3 className="font-serif text-base text-bone mb-2">{f.q}</h3>
              <p className="text-sm text-mist/60 leading-relaxed">{f.a}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-ash/50 text-center max-w-lg mx-auto mb-12 leading-relaxed">
          Readings are generated by AI for entertainment and self-reflection
          — a fun, personalized lens on your questions, not professional
          advice.
        </p>

        <div className="text-center">
          <Link href="/auth">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-mystic inline-block px-10 py-4 text-white text-base cursor-pointer"
            >
              Begin Your Journey
            </motion.span>
          </Link>
        </div>
      </div>
    </main>
  );
}
