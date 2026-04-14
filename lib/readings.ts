export interface Reading {
  id: string;
  title: string;
  description: string;
  category: ReadingCategory;
  icon: string;
  href: string;
  price: number; // cents USD
  expressAvailable?: boolean; // whether express 30-min delivery is offered
}

export type ReadingCategory =
  | "soulmate"
  | "sketches"
  | "astrology"
  | "tarot"
  | "palmistry";

export const categoryLabels: Record<ReadingCategory, { title: string; subtitle: string }> = {
  soulmate: {
    title: "Soulmate Search",
    subtitle: "Unlock every dimension of the soul destined to find you",
  },
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
  "soulmate",
  "sketches",
  "tarot",
  "astrology",
  "palmistry",
];

export const readings: Reading[] = [
  // ── Soulmate Search ──
  {
    id: "soulmate-sketch",
    title: "Soulmate Sketch",
    description:
      "Receive an AI-generated hand-drawn portrait of your soulmate, channeled through your unique cosmic profile. Express delivery available.",
    category: "soulmate",
    icon: "\u2661",
    href: "/reading/soulmate-sketch",
    price: 699,
    expressAvailable: true,
  },
  {
    id: "soulmate-name-initials",
    title: "Name Initials of Your Soulmate",
    description:
      "Discover the initials of your soulmate. These unique letters will appear in unexpected places, guiding you closer to love.",
    category: "soulmate",
    icon: "\u2728",
    href: "/reading/soulmate-name-initials",
    price: 399,
  },
  {
    id: "soulmate-zodiac",
    title: "Zodiac Sign of Your Soulmate",
    description:
      "Uncover the zodiac sign of your soulmate and discover what makes them truly special — their approach to love, commitment, and adventure.",
    category: "soulmate",
    icon: "\u2648",
    href: "/reading/soulmate-zodiac",
    price: 399,
  },
  {
    id: "soulmate-aura",
    title: "Aura of Your Soulmate",
    description:
      "Uncover the aura of your soulmate and discover the unique energy that surrounds them — the qualities that make them your perfect match.",
    category: "soulmate",
    icon: "\u25CB",
    href: "/reading/soulmate-aura",
    price: 399,
  },
  {
    id: "soulmate-personality",
    title: "Personality Traits of Your Soulmate",
    description:
      "Uncover the personality traits of your soulmate — their loyalty, strength, and dedication to building a beautiful life together.",
    category: "soulmate",
    icon: "\u269C",
    href: "/reading/soulmate-personality",
    price: 399,
  },
  {
    id: "soulmate-spiritual",
    title: "Spiritual Alignment of Your Soulmate",
    description:
      "Discover the spiritual energy that guides you both — how their connection to love, compassion, and emotional balance creates a harmonious bond.",
    category: "soulmate",
    icon: "\u269B",
    href: "/reading/soulmate-spiritual",
    price: 399,
  },
  {
    id: "soulmate-spirit-animal",
    title: "Spirit Animal of Your Soulmate",
    description:
      "Uncover the spirit animal of your soulmate and discover the powerful instincts, strengths, and way of loving it reveals.",
    category: "soulmate",
    icon: "\u{1F43A}",
    href: "/reading/soulmate-spirit-animal",
    price: 199,
  },
  {
    id: "soulmate-career",
    title: "Job & Career of Your Soulmate",
    description:
      "Uncover the ambition that drives your soulmate — how their work reflects their soul and the lifestyle you could share together.",
    category: "soulmate",
    icon: "\u2736",
    href: "/reading/soulmate-career",
    price: 399,
  },
  {
    id: "soulmate-impact",
    title: "Impact & Mission of Your Soulmate",
    description:
      "Discover the purpose that drives your soulmate and how their mission intertwines with yours to create something meaningful in the world.",
    category: "soulmate",
    icon: "\u2605",
    href: "/reading/soulmate-impact",
    price: 399,
  },
  {
    id: "soulmate-when-where",
    title: "When & Where You'll Meet",
    description:
      "Uncover when and where you'll meet your soulmate — the timing, the setting, and the signs the universe has already aligned for your encounter.",
    category: "soulmate",
    icon: "\u29BF",
    href: "/reading/soulmate-when-where",
    price: 399,
  },
  {
    id: "soulmate-meeting-details",
    title: "Small Details of Your Meeting",
    description:
      "Discover the small details of how your paths will cross — the specific moments that will ignite a spark and mark the beginning of everything.",
    category: "soulmate",
    icon: "\u2737",
    href: "/reading/soulmate-meeting-details",
    price: 399,
  },
  {
    id: "soulmate-past-life",
    title: "Past Life Connection with Your Soulmate",
    description:
      "Uncover the powerful past life bond you share — a connection forged in a previous lifetime, now bringing you together again to heal, grow, and love.",
    category: "soulmate",
    icon: "\u221E",
    href: "/reading/soulmate-past-life",
    price: 399,
  },

  // ── Sketch Readings ──
  {
    id: "future-baby-sketch",
    title: "Future Baby Sketch Reading",
    description:
      "Discover a heartfelt preview of your future child through a hand-drawn sketch and personalized insights into their unique spirit and connection with you.",
    category: "sketches",
    icon: "\u2727",
    href: "/reading/future-baby-sketch",
    price: 699,
  },

  // ── Astrology & Numerology ──
  {
    id: "natal-chart",
    title: "Natal Chart Report",
    description:
      "Discover your unique strengths, challenges, and life path through your personal birth chart.",
    category: "astrology",
    icon: "\u2609",
    href: "/reading/natal-chart",
    price: 699,
  },
  {
    id: "astrocartography",
    title: "Your Astrocartography Report",
    description:
      "Reveal the cities where your planetary energy is strongest. Discover where you naturally belong and thrive around the world.",
    category: "astrology",
    icon: "\u2637",
    href: "/reading/astrocartography",
    price: 699,
  },
  {
    id: "numerology",
    title: "Numerology Report",
    description:
      "Reveal the power of numbers in your life. Discover how your life path, destiny, and soul numbers shape your future.",
    category: "astrology",
    icon: "\u2116",
    href: "/reading/numerology",
    price: 699,
  },
  {
    id: "compatibility",
    title: "Compatibility Reading",
    description:
      "Discover how compatible you are with someone special and explore your relationship dynamics in love, friendship, and karmic connections.",
    category: "astrology",
    icon: "\u2662",
    href: "/reading/compatibility",
    price: 699,
  },
  {
    id: "complete-astrology-guide",
    title: "Complete Astrology Guide",
    description:
      "Understand your Sun, Moon, and Rising signs, learn to read birth charts, and explore planets, houses, and aspects\u2014all in one beginner-friendly eBook.",
    category: "astrology",
    icon: "\u2606",
    href: "/reading/complete-astrology-guide",
    price: 699,
  },
  {
    id: "2026-forecast",
    title: "2026 Astrological Forecast",
    description:
      "Get a personalized forecast for the year ahead. Discover key astrological events and how they\u2019ll shape your love life, career, and personal growth in 2026.",
    category: "astrology",
    icon: "\u2604",
    href: "/reading/2026-forecast",
    price: 699,
  },

  // ── Palmistry ──
  {
    id: "palmistry",
    title: "Palmistry Reading Report",
    description:
      "Decode the lines in your hands to uncover your personality, future, and key life events. Explore your strengths and challenges through this unique insight.",
    category: "palmistry",
    icon: "\u270B",
    href: "/reading/palmistry",
    price: 699,
  },

  // ── Tarot ──
  {
    id: "yes-no-tarot",
    title: "Yes or No Tarot",
    description:
      "Ask a clear question and pull one card for a direct yes-leaning or no-leaning answer with quick guidance.",
    category: "tarot",
    icon: "\u2748",
    href: "/reading/yes-no-tarot",
    price: 699,
  },
  {
    id: "past-present-future-tarot",
    title: "Past Present Future Tarot",
    description:
      "Three cards that show what shaped this situation, where things stand now, and what direction it is moving toward.",
    category: "tarot",
    icon: "\u29D6",
    href: "/reading/past-present-future-tarot",
    price: 699,
  },
  {
    id: "past-love-clarity-tarot",
    title: "Past Love Clarity Tarot",
    description:
      "Learn where your ex truly stands and whether reconnecting supports your future.",
    category: "tarot",
    icon: "\u2619",
    href: "/reading/past-love-clarity-tarot",
    price: 699,
  },
  {
    id: "love-triangle-tarot",
    title: "Love Triangle Tarot",
    description:
      "Three cards to show your role in this love triangle and what each person brings into your life.",
    category: "tarot",
    icon: "\u25B3",
    href: "/reading/love-triangle-tarot",
    price: 699,
  },
  {
    id: "true-compatibility-tarot",
    title: "True Compatibility Tarot",
    description:
      "One card to reveal if this relationship is worth the effort and truly aligned with your future.",
    category: "tarot",
    icon: "\u2661",
    href: "/reading/true-compatibility-tarot",
    price: 699,
  },
  {
    id: "heartbreak-healing-tarot",
    title: "Heartbreak Healing Tarot",
    description:
      "See what\u2019s keeping you stuck and what to do next. A two-card Tarot reading to help you heal and move on.",
    category: "tarot",
    icon: "\u2764\uFE0F\u200D\u{1FA79}",
    href: "/reading/heartbreak-healing-tarot",
    price: 699,
  },
];

const readingsMap = new Map<string, Reading>(readings.map((r) => [r.id, r]));

export function getReading(id: string): Reading | undefined {
  return readingsMap.get(id);
}
