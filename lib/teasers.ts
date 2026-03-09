/**
 * Teaser snippets shown after the quiz, before the paywall.
 * Each reading gets a short "hook" preview that feels personalized
 * based on the user's answers, making them want to unlock the full result.
 */

export interface TeaserContent {
  headline: string;
  preview: string;
  blurredLines: string[];
  hookLine: string;
}

/**
 * Generate a teaser based on reading type and user answers.
 * The preview feels personal by referencing their quiz choices.
 */
export function getTeaser(
  readingId: string,
  answers: Record<string, string>
): TeaserContent {
  const sign = answers.sun_sign || "your sign";
  const element = answers.element || "your element";

  const teasers: Record<string, TeaserContent> = {
    "soulmate-sketch": {
      headline: "We see someone...",
      preview: `Based on your ${sign} energy and ${element} resonance, we've identified a strong romantic imprint in your chart. The soul drawn to yours carries a presence that will feel instantly familiar.`,
      blurredLines: [
        "Their most striking feature is their ███████ which reflects...",
        "You'll likely meet when ████████████ during a period of...",
        "The connection will feel like ██████████ from the very first...",
      ],
      hookLine: "Your full soulmate sketch and detailed portrait are ready.",
    },
    "future-baby-sketch": {
      headline: "A little soul is waiting...",
      preview: `The cosmic bond between you and your future child is already forming. With ${element} energy flowing through your chart, this child carries a spirit that mirrors your deepest values.`,
      blurredLines: [
        "They will have ████████ eyes that remind you of...",
        "Their personality will lean toward ██████████ with a natural gift for...",
        "The strongest bond between you will be ████████████...",
      ],
      hookLine: "Your future baby sketch and full spirit reading are ready.",
    },
    "natal-chart": {
      headline: "Your chart reveals hidden patterns...",
      preview: `As a ${sign}, your natal chart shows a powerful configuration that most people with your placement never discover. Your ${element} alignment amplifies this significantly.`,
      blurredLines: [
        "Your hidden strength lies in your ████████ house placement...",
        "The biggest challenge you'll overcome this year is ██████████...",
        "Your life purpose is directly connected to ████████████...",
      ],
      hookLine: "Your complete natal chart breakdown is ready.",
    },
    "astrocartography": {
      headline: "The map is pointing somewhere...",
      preview: `Your planetary lines reveal 3 cities where your energy peaks. As a ${sign} with ${element} resonance, one of these locations could change everything for you.`,
      blurredLines: [
        "Your Venus line runs through ████████ — this is where love...",
        "For career breakthroughs, your Jupiter line points to ██████████...",
        "Avoid extended stays near ████████████ as your Saturn line...",
      ],
      hookLine: "Your full astrocartography map and city guide are ready.",
    },
    "numerology": {
      headline: "Your numbers carry a message...",
      preview: `Your life path number reveals a pattern that only 8% of people share. Combined with your ${sign} placement, this creates an unusually powerful destiny number.`,
      blurredLines: [
        "Your destiny number is ██ which means you are naturally...",
        "The year ████ will be your most transformative period for...",
        "Your soul number reveals a hidden desire for ████████████...",
      ],
      hookLine: "Your complete numerology profile is ready.",
    },
    "compatibility": {
      headline: "There's a deep connection here...",
      preview: `The compatibility between ${sign} and ${answers.partner_sign || "their sign"} is more complex than most pairings. There's a magnetic pull, but also a tension that needs understanding.`,
      blurredLines: [
        "Your emotional compatibility score is ██/100 which suggests...",
        "The biggest source of conflict will be ████████████ but...",
        "Long-term, this connection has the potential to ██████████...",
      ],
      hookLine: "Your full compatibility analysis is ready.",
    },
    "complete-astrology-guide": {
      headline: "Your cosmic blueprint is unique...",
      preview: `Your ${sign} Sun combined with ${element} energy creates a profile that this guide will break down completely — from your big three to your hidden houses.`,
      blurredLines: [
        "Your Moon sign suggests your emotional core is ████████...",
        "Your Rising sign means others first perceive you as ██████████...",
        "The aspect between your Venus and Mars reveals ████████████...",
      ],
      hookLine: "Your personalized astrology guide is ready.",
    },
    "2026-forecast": {
      headline: "2026 holds a turning point for you...",
      preview: `Major planetary transits this year are hitting your ${sign} chart hard. One particular alignment in the coming months could reshape your love life entirely.`,
      blurredLines: [
        "In ████████ 2026, expect a major shift in your ██████████...",
        "Saturn's transit through your ██ house means ████████████...",
        "The most romantic period for you will be ██████████...",
      ],
      hookLine: "Your full 2026 personalized forecast is ready.",
    },
    "palmistry": {
      headline: "Your palms tell a story...",
      preview: `Based on your ${answers.dominant_hand || "dominant"} hand focus, your heart line and fate line carry markings that reveal something most people overlook about their future.`,
      blurredLines: [
        "Your heart line indicates you will experience ████████ in love...",
        "A rare marking near your fate line suggests ██████████...",
        "Your life line reveals unexpected ████████████ in your...",
      ],
      hookLine: "Your complete palmistry analysis is ready.",
    },
    "yes-no-tarot": {
      headline: "The card has been drawn...",
      preview: "The universe has answered. The energy around your question is clear, and the card pulled carries a definitive lean.",
      blurredLines: [
        "The card drawn is ████████████ which leans toward...",
        "The guidance attached to this pull says ██████████...",
      ],
      hookLine: "Your Yes or No answer with full card interpretation is ready.",
    },
    "past-present-future-tarot": {
      headline: "Three cards, three truths...",
      preview: "The spread has been laid. Your past card reveals a pattern you may not have noticed, your present card confirms what you already feel, and your future card... changes everything.",
      blurredLines: [
        "Past: ████████████ — this shaped your current situation by...",
        "Present: ████████████ — right now, the energy is...",
        "Future: ████████████ — the direction is moving toward...",
      ],
      hookLine: "Your full three-card reading with interpretations is ready.",
    },
    "past-love-clarity-tarot": {
      headline: "The cards see your ex clearly...",
      preview: "The spread reveals where your ex stands right now — and whether the door between you is truly closed or quietly waiting.",
      blurredLines: [
        "Your ex currently feels ████████████ about the connection...",
        "The card for reconciliation shows ██████████ which means...",
        "For your healing, the guidance is to ████████████...",
      ],
      hookLine: "Your full past love clarity reading is ready.",
    },
    "love-triangle-tarot": {
      headline: "The dynamic is becoming clear...",
      preview: "Three cards, three energies. Your role in this triangle is more defined than you think, and one of these connections is pulling harder than the other.",
      blurredLines: [
        "Your energy in this dynamic is ████████████...",
        "Person A brings ████████████ while Person B brings...",
        "The card for resolution suggests ██████████...",
      ],
      hookLine: "Your full love triangle spread is ready.",
    },
    "true-compatibility-tarot": {
      headline: "One card. One truth.",
      preview: "The compatibility card has been pulled. It speaks directly to whether this connection is aligned with your highest path — or pulling you away from it.",
      blurredLines: [
        "The card drawn is ████████████ which reveals this connection is...",
        "The deeper message for you is ██████████...",
      ],
      hookLine: "Your full compatibility card interpretation is ready.",
    },
    "heartbreak-healing-tarot": {
      headline: "The cards see your pain...",
      preview: "Two cards have been drawn — one for what's keeping you stuck, and one for what will set you free. The reading is gentle, but honest.",
      blurredLines: [
        "What's holding you back: ████████████ — this energy keeps...",
        "What will heal you: ████████████ — the path forward is...",
      ],
      hookLine: "Your full heartbreak healing reading is ready.",
    },
  };

  return (
    teasers[readingId] || {
      headline: "Your reading is taking shape...",
      preview: `As a ${sign} with ${element} energy, the patterns in your chart reveal something worth exploring further.`,
      blurredLines: [
        "The key insight from your profile is ████████████...",
        "What stands out most is ██████████ which suggests...",
        "The guidance for your path ahead is ████████████...",
      ],
      hookLine: "Your full personalized reading is ready.",
    }
  );
}
