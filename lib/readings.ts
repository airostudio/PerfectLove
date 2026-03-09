export interface Reading {
  id: string;
  title: string;
  description: string;
  category: ReadingCategory;
  icon: string;
  href: string;
}

export type ReadingCategory =
  | "sketches"
  | "astrology"
  | "tarot"
  | "palmistry";

export const categoryLabels: Record<ReadingCategory, { title: string; subtitle: string }> = {
  sketches: {
    title: "Sketch Readings",
    subtitle: "Personalized hand-drawn portraits revealed through your cosmic energy",
  },
  astrology: {
    title: "Astrology & Numerology",
    subtitle: "Deep insights from the planets, stars, and sacred numbers",
  },
  tarot: {
    title: "Tarot Readings",
    subtitle: "Draw the cards and let the universe speak",
  },
  palmistry: {
    title: "Palmistry",
    subtitle: "The stories written in the lines of your hands",
  },
};

export const categoryOrder: ReadingCategory[] = [
  "sketches",
  "tarot",
  "astrology",
  "palmistry",
];

export const readings: Reading[] = [
  // ── Sketch Readings ──
  {
    id: "soulmate-sketch",
    title: "Soulmate Sketch Reading",
    description:
      "See your soulmate through a personalized sketch and explore the romantic potential destined for you.",
    category: "sketches",
    icon: "\u2661",
    href: "/quiz/soulmate-sketch",
  },
  {
    id: "future-baby-sketch",
    title: "Future Baby Sketch Reading",
    description:
      "Discover a heartfelt preview of your future child through a hand-drawn sketch and personalized insights into their unique spirit and connection with you.",
    category: "sketches",
    icon: "\u2727",
    href: "/quiz/future-baby-sketch",
  },

  // ── Astrology & Numerology ──
  {
    id: "natal-chart",
    title: "Natal Chart Report",
    description:
      "Discover your unique strengths, challenges, and life path through your personal birth chart.",
    category: "astrology",
    icon: "\u2609",
    href: "/quiz/natal-chart",
  },
  {
    id: "astrocartography",
    title: "Your Astrocartography Report",
    description:
      "Reveal the cities where your planetary energy is strongest. Discover where you naturally belong and thrive around the world.",
    category: "astrology",
    icon: "\u2637",
    href: "/quiz/astrocartography",
  },
  {
    id: "numerology",
    title: "Numerology Report",
    description:
      "Reveal the power of numbers in your life. Discover how your life path, destiny, and soul numbers shape your future.",
    category: "astrology",
    icon: "\u2116",
    href: "/quiz/numerology",
  },
  {
    id: "compatibility",
    title: "Compatibility Reading",
    description:
      "Discover how compatible you are with someone special and explore your relationship dynamics in love, friendship, and karmic connections.",
    category: "astrology",
    icon: "\u2662",
    href: "/quiz/compatibility",
  },
  {
    id: "complete-astrology-guide",
    title: "Complete Astrology Guide",
    description:
      "Understand your Sun, Moon, and Rising signs, learn to read birth charts, and explore planets, houses, and aspects\u2014all in one beginner-friendly eBook.",
    category: "astrology",
    icon: "\u2606",
    href: "/quiz/complete-astrology-guide",
  },
  {
    id: "2026-forecast",
    title: "2026 Astrological Forecast",
    description:
      "Get a personalized forecast for the year ahead. Discover key astrological events and how they\u2019ll shape your love life, career, and personal growth in 2026.",
    category: "astrology",
    icon: "\u2604",
    href: "/quiz/2026-forecast",
  },

  // ── Palmistry ──
  {
    id: "palmistry",
    title: "Palmistry Reading Report",
    description:
      "Decode the lines in your hands to uncover your personality, future, and key life events. Explore your strengths and challenges through this unique insight.",
    category: "palmistry",
    icon: "\u270B",
    href: "/quiz/palmistry",
  },

  // ── Tarot ──
  {
    id: "yes-no-tarot",
    title: "Yes or No Tarot",
    description:
      "Ask a clear question and pull one card for a direct yes-leaning or no-leaning answer with quick guidance.",
    category: "tarot",
    icon: "\u2748",
    href: "/quiz/yes-no-tarot",
  },
  {
    id: "past-present-future-tarot",
    title: "Past Present Future Tarot",
    description:
      "Three cards that show what shaped this situation, where things stand now, and what direction it is moving toward.",
    category: "tarot",
    icon: "\u29D6",
    href: "/quiz/past-present-future-tarot",
  },
  {
    id: "past-love-clarity-tarot",
    title: "Past Love Clarity Tarot",
    description:
      "Learn where your ex truly stands and whether reconnecting supports your future.",
    category: "tarot",
    icon: "\u2619",
    href: "/quiz/past-love-clarity-tarot",
  },
  {
    id: "love-triangle-tarot",
    title: "Love Triangle Tarot",
    description:
      "Three cards to show your role in this love triangle and what each person brings into your life.",
    category: "tarot",
    icon: "\u25B3",
    href: "/quiz/love-triangle-tarot",
  },
  {
    id: "true-compatibility-tarot",
    title: "True Compatibility Tarot",
    description:
      "One card to reveal if this relationship is worth the effort and truly aligned with your future.",
    category: "tarot",
    icon: "\u2661",
    href: "/quiz/true-compatibility-tarot",
  },
  {
    id: "heartbreak-healing-tarot",
    title: "Heartbreak Healing Tarot",
    description:
      "See what\u2019s keeping you stuck and what to do next. A two-card Tarot reading to help you heal and move on.",
    category: "tarot",
    icon: "\u2764\uFE0F\u200D\u{1FA79}",
    href: "/quiz/heartbreak-healing-tarot",
  },
];
