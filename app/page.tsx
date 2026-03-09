"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: "\u2661",
    title: "Soulmate & Baby Sketches",
    description:
      "Receive a personalized hand-drawn portrait of your soulmate or future child, channeled through your unique cosmic energy.",
  },
  {
    icon: "\u2749",
    title: "Tarot Readings",
    description:
      "Yes/No pulls, love triangle clarity, past-life insights, and heartbreak healing \u2014 your cards, your truth.",
  },
  {
    icon: "\u2609",
    title: "Birth Charts & Astrology",
    description:
      "Natal charts, compatibility reports, astrocartography, numerology, and your complete 2026 forecast.",
  },
  {
    icon: "\u270B",
    title: "Palmistry Reports",
    description:
      "Decode the sacred lines in your hands to reveal personality, purpose, and what your future holds.",
  },
];

const testimonials = [
  {
    quote:
      "The soulmate sketch was eerily accurate. I showed it to my partner and we both got chills.",
    name: "Mia R.",
    detail: "Soulmate Sketch",
  },
  {
    quote:
      "My natal chart reading helped me understand patterns I\u2019ve been repeating for years. Life-changing.",
    name: "Jade K.",
    detail: "Natal Chart",
  },
  {
    quote:
      "I was skeptical, but the tarot reading gave me the clarity I needed to finally move on.",
    name: "Luna S.",
    detail: "Heartbreak Healing Tarot",
  },
];

const faqs = [
  {
    q: "What is a soulmate sketch reading?",
    a: "A soulmate sketch reading uses your birth details and cosmic energy to channel a hand-drawn portrait of your destined romantic partner. You answer a short quiz, and a personalized sketch along with a detailed written reading is delivered to your inbox within 24 hours.",
  },
  {
    q: "How does a tarot reading work online?",
    a: "Our online tarot readings guide you through focused questions about your situation. Based on your energy and responses, cards are drawn and interpreted by our system to provide clarity on love, relationships, past lives, and life direction.",
  },
  {
    q: "What is a natal chart and why does it matter?",
    a: "A natal chart (or birth chart) is a map of where every planet was at the exact moment you were born. It reveals your personality traits, strengths, challenges, and life path. Understanding your natal chart is like having a cosmic blueprint for your entire life.",
  },
  {
    q: "Do I need to pay a subscription?",
    a: "No. Every reading on PerfectLove is a one-time payment of $6.99. You take the quiz for free, see a preview of your reading, and only pay if you want the full detailed report. No subscriptions, no recurring charges.",
  },
  {
    q: "How long until I receive my reading?",
    a: "Your complete personalized reading is delivered to your email inbox within 24 hours of purchase. Most readings arrive much sooner.",
  },
  {
    q: "Can I access my readings again after purchase?",
    a: "Yes! Simply sign in with the same email you used to purchase. All your past readings are saved to your account and accessible anytime from your personal dashboard.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[10px] uppercase tracking-[0.45em] text-gold/70 mb-8"
        >
          Astrology &middot; Tarot &middot; Sketches &middot; Palmistry
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal text-bone leading-[1.05] mb-6 max-w-3xl"
        >
          Discover What the
          <br />
          <em className="text-orchid">Stars</em> Know About{" "}
          <em className="text-dusty-rose">You</em>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-base md:text-lg text-mist/80 max-w-xl mb-10 leading-relaxed"
        >
          Hyper-personalized readings crafted from your unique cosmic profile.
          Soulmate sketches, tarot pulls, birth charts, and more &mdash;
          delivered to your inbox within 24 hours.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link href="/auth">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-mystic inline-block px-10 py-4 text-white text-base cursor-pointer"
            >
              Begin Your Journey
            </motion.span>
          </Link>
          <a
            href="#how-it-works"
            className="text-sm text-orchid/70 hover:text-orchid transition-colors"
          >
            See how it works &darr;
          </a>
        </motion.div>

        <motion.p
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-6 text-xs text-ash/60"
        >
          Free quiz &middot; $6.99 per reading &middot; No subscription
        </motion.p>
      </section>

      {/* ── Social proof bar ── */}
      <section className="px-6 pb-16">
        <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="font-serif text-2xl text-bone">15+</p>
            <p className="text-xs text-ash">Unique Readings</p>
          </div>
          <div className="w-px bg-orchid/10" />
          <div>
            <p className="font-serif text-2xl text-bone">24hr</p>
            <p className="text-xs text-ash">Delivery</p>
          </div>
          <div className="w-px bg-orchid/10" />
          <div>
            <p className="font-serif text-2xl text-bone">$6.99</p>
            <p className="text-xs text-ash">One-time</p>
          </div>
          <div className="w-px bg-orchid/10" />
          <div>
            <p className="font-serif text-2xl text-bone">{"\u2726"}</p>
            <p className="text-xs text-ash">No Subscription</p>
          </div>
        </div>
      </section>

      <div className="mystic-divider max-w-4xl mx-auto" />

      {/* ── How It Works ── */}
      <section id="how-it-works" className="px-6 py-20 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-3">
            Simple &amp; Sacred
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-bone">
            How It Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Take the Quiz",
              desc: "Answer a few questions about your birth details, intentions, and cosmic curiosities. It takes under two minutes.",
            },
            {
              step: "02",
              title: "Preview Your Reading",
              desc: "See a teaser of your personalized results instantly. If it resonates, unlock the full reading for a one-time $6.99.",
            },
            {
              step: "03",
              title: "Receive Your Reading",
              desc: "Your complete, detailed reading is delivered to your inbox within 24 hours. Yours to keep forever.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="glass-card p-8 text-center"
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
      </section>

      <div className="mystic-divider max-w-4xl mx-auto" />

      {/* ── Features / What We Offer ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-3">
            Your Cosmic Toolkit
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-bone">
            Readings Crafted for Your Soul
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass-card p-8 flex gap-5"
            >
              <span className="text-2xl shrink-0 mt-1">{f.icon}</span>
              <div>
                <h3 className="font-serif text-lg text-bone mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-mist/60 leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="mystic-divider max-w-4xl mx-auto" />

      {/* ── Testimonials ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-3">
            Real Stories
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-bone">
            What Our Community Says
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass-card p-8"
            >
              <p className="text-sm text-mist/70 leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-bone text-sm font-medium">{t.name}</p>
                <p className="text-xs text-ash">{t.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="mystic-divider max-w-4xl mx-auto" />

      {/* ── FAQ (SEO + GEO) ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-3">
            Common Questions
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-bone">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card group"
            >
              <summary className="px-6 py-5 cursor-pointer text-bone font-medium text-sm list-none flex justify-between items-center">
                {faq.q}
                <span className="text-orchid/50 text-xs ml-4 group-open:rotate-45 transition-transform duration-200">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5">
                <p className="text-sm text-mist/60 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      <div className="mystic-divider max-w-4xl mx-auto" />

      {/* ── Final CTA ── */}
      <section className="px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-gold/60 mb-6">
            Your stars are waiting
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-bone mb-4 max-w-xl mx-auto leading-tight">
            Ready to See What the Universe Has Planned?
          </h2>
          <p className="text-mist/60 mb-8 max-w-md mx-auto">
            Create your free account and explore 15+ personalized cosmic
            readings. No subscription &mdash; just you and the stars.
          </p>
          <Link href="/auth">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-mystic inline-block px-12 py-4 text-white text-base cursor-pointer"
            >
              Begin Your Journey
            </motion.span>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 text-center">
        <div className="mystic-divider mb-8 max-w-lg mx-auto" />
        <p className="font-serif text-lg text-bone/80 mb-1">PerfectLove</p>
        <p className="text-xs text-ash/50 mb-4">
          Navigate your love life through modern astrology, tarot, and cosmic
          insight.
        </p>
        <div className="flex justify-center gap-6 text-xs text-ash/40">
          <Link href="/auth" className="hover:text-orchid transition-colors">
            Sign In
          </Link>
          <a href="#how-it-works" className="hover:text-orchid transition-colors">
            How It Works
          </a>
          <a href="#" className="hover:text-orchid transition-colors">
            Privacy
          </a>
        </div>
      </footer>
    </main>
  );
}
