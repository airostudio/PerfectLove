"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getZodiacSummary, getSoulmateTraits } from "@/lib/zodiac-facts";
import TeaserPreview from "@/components/TeaserPreview";
import type { Reading } from "@/lib/readings";

const GENDER_OPTIONS = ["Male", "Female", "Non-Binary", "Other"];

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-bone placeholder:text-ash/50 focus:outline-none focus:border-orchid/40 transition-colors text-base";

type Step =
  | { kind: "text"; id: string; label: string; placeholder?: string; optional?: boolean }
  | { kind: "date"; id: string; label: string }
  | { kind: "time"; id: string; label: string }
  | { kind: "select"; id: string; label: string; options: string[] }
  | { kind: "reveal"; id: "zodiac-summary" | "soulmate-essence" | "final-summary" };

const STEPS: Step[] = [
  { kind: "text", id: "name", label: "What's your name?", placeholder: "Your first name" },
  { kind: "select", id: "gender", label: "What's your gender?", options: GENDER_OPTIONS },
  { kind: "date", id: "birth_date", label: "What's your birth date?" },
  { kind: "time", id: "birth_time", label: "What time were you born?" },
  { kind: "text", id: "birth_place", label: "Where were you born?", placeholder: "City, Country", optional: true },
  { kind: "reveal", id: "zodiac-summary" },
  { kind: "select", id: "soulmate_gender", label: "What's your soulmate's gender?", options: GENDER_OPTIONS },
  { kind: "reveal", id: "soulmate-essence" },
  { kind: "reveal", id: "final-summary" },
];

function formatBirthDate(value?: string): string {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

function formatBirthTime(value?: string): string {
  if (!value) return "";
  const [h, min] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(min)) return value;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(min).padStart(2, "0")} ${period}`;
}

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="px-4 py-2 rounded-full bg-orchid/10 border border-orchid/20 text-orchid text-sm"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between py-2.5 border-b border-white/[0.06] last:border-0">
      <span className="text-xs uppercase tracking-[0.15em] text-ash">{label}</span>
      <span className="text-bone text-sm font-medium">{value}</span>
    </div>
  );
}

function RevealCard({
  title,
  subtitle,
  continueLabel = "Continue",
  onContinue,
  children,
}: {
  title: string;
  subtitle?: string;
  continueLabel?: string;
  onContinue: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="glass-card p-8 md:p-10 mb-6">
        <h2 className="font-serif text-2xl md:text-3xl text-bone mb-2">{title}</h2>
        {subtitle && <p className="text-mist/60 text-sm mb-6">{subtitle}</p>}
        <div className="mt-4 space-y-1">{children}</div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onContinue}
        className="btn-mystic w-full py-4 text-white text-base cursor-pointer"
      >
        {continueLabel}
      </motion.button>
    </motion.div>
  );
}

interface SketchFlowProps {
  reading: Reading;
}

export default function SketchFlow({ reading }: SketchFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fieldValue, setFieldValue] = useState("");

  const step = STEPS[stepIndex];
  const isComplete = stepIndex >= STEPS.length;
  const questionSteps = STEPS.filter((s) => s.kind !== "reveal");
  const questionPosition = STEPS.slice(0, stepIndex).filter((s) => s.kind !== "reveal").length;

  function commit(id: string, value: string) {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      if (id === "birth_date") {
        const summary = getZodiacSummary(value);
        if (summary) {
          next.sun_sign = summary.sunSign;
          next.element = summary.element;
          next.ruling_planet = summary.rulingPlanet;
          next.birthstone = summary.birthstone;
          next.colours = summary.colours;
          next.energy_time = summary.energyTime;
          next.lucky_numbers = summary.luckyNumbers.join(", ");
          next.cosmic_strengths = summary.cosmicStrengths.join(", ");
          next.soulmate_traits = getSoulmateTraits(summary.sunSign).join(", ");
        }
      }
      return next;
    });
    setFieldValue("");
    setStepIndex((i) => i + 1);
  }

  if (isComplete) {
    return <TeaserPreview reading={reading} answers={answers} />;
  }

  return (
    <>
      <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-10 text-center">
        {reading.icon} {reading.title}
      </p>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {step.kind === "reveal" ? (
            <div key={step.id}>
              {step.id === "zodiac-summary" && (
                <RevealCard
                  title={`Your Zodiac Summary${answers.name ? `, ${answers.name}` : ""}`}
                  subtitle="Channelled from your birth date."
                  onContinue={() => setStepIndex((i) => i + 1)}
                >
                  <StatRow label="Sun Sign" value={answers.sun_sign} />
                  <StatRow label="Ruling Planet" value={answers.ruling_planet} />
                  <StatRow label="Birth Stone" value={answers.birthstone} />
                  <StatRow label="Birth Colours" value={answers.colours} />
                  <StatRow label="Most Energy Time" value={answers.energy_time} />
                  <StatRow label="Lucky Numbers" value={answers.lucky_numbers} />
                  <div className="pt-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-ash mb-3">
                      Cosmic Strengths
                    </p>
                    <Pills items={(answers.cosmic_strengths || "").split(", ").filter(Boolean)} />
                  </div>
                </RevealCard>
              )}

              {step.id === "soulmate-essence" && (
                <RevealCard
                  title="The Essence"
                  subtitle="Your soulmate should carry these traits:"
                  onContinue={() => setStepIndex((i) => i + 1)}
                >
                  <Pills items={(answers.soulmate_traits || "").split(", ").filter(Boolean)} />
                </RevealCard>
              )}

              {step.id === "final-summary" && (
                <RevealCard
                  title={`Here's What We Found${answers.name ? `, ${answers.name}` : ""}`}
                  subtitle="Confirm your details before we channel your reading."
                  continueLabel="See My Reading"
                  onContinue={() => setStepIndex((i) => i + 1)}
                >
                  <StatRow label="Name" value={answers.name} />
                  <StatRow label="Gender" value={answers.gender} />
                  <StatRow label="Born" value={formatBirthDate(answers.birth_date)} />
                  <StatRow label="Time of Birth" value={formatBirthTime(answers.birth_time)} />
                  {answers.birth_place && <StatRow label="Birth Place" value={answers.birth_place} />}
                  <StatRow label="Sun Sign" value={answers.sun_sign} />
                  <StatRow label="Soulmate's Gender" value={answers.soulmate_gender} />
                </RevealCard>
              )}
            </div>
          ) : (
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-lg mx-auto"
            >
              <p className="text-xs text-ash text-center mb-3 tracking-widest uppercase">
                {questionPosition + 1} of {questionSteps.length}
              </p>
              <div className="w-full h-[2px] bg-bone/5 rounded-full mb-10 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amethyst to-orchid rounded-full"
                  initial={{ width: `${(questionPosition / questionSteps.length) * 100}%` }}
                  animate={{ width: `${((questionPosition + 1) / questionSteps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              <h2 className="font-serif text-2xl md:text-3xl text-center mb-10 text-bone leading-snug">
                {"label" in step ? step.label : ""}
              </h2>

              {step.kind === "select" ? (
                <div className="grid gap-3" role="list">
                  {step.options.map((option) => (
                    <motion.button
                      key={option}
                      role="listitem"
                      aria-label={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => commit(step.id, option)}
                      className="glass-card-hover px-6 py-4 text-left text-base text-mist cursor-pointer"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    commit(step.id, fieldValue.trim());
                  }}
                  className="space-y-4"
                >
                  <input
                    type={step.kind}
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={"placeholder" in step ? step.placeholder : undefined}
                    required={!("optional" in step && step.optional)}
                    autoFocus
                    className={inputClass}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-mystic w-full py-4 text-white text-base cursor-pointer"
                  >
                    Continue
                  </motion.button>
                  {"optional" in step && step.optional && (
                    <button
                      type="button"
                      onClick={() => commit(step.id, "")}
                      className="w-full text-center text-xs text-ash hover:text-mist transition-colors cursor-pointer"
                    >
                      Skip
                    </button>
                  )}
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
