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
      headline: answers.soul_window === "The Smile"
        ? "There is a smile you haven’t seen yet…"
        : "There are eyes you haven’t met yet…",
      preview: answers.personality === "Introverted depth"
        ? `Your ${sign} energy carries a quiet depth that most people never reach. The soul drawn to yours matches that depth — they won't rush you, won't overwhelm you, and when you first speak, it will feel less like meeting someone new and more like remembering someone you already knew.`
        : `Your ${sign} energy radiates warmth that calls in its equal. The soul drawn to yours carries the same radiance — the kind of person whose presence in a room you notice before you see their face. When you meet, there will be no awkward beginning. Just the feeling of: oh, there you are.`,
      blurredLines: [
        `Their ${answers.soul_window === "The Smile" ? "smile" : "eyes"} will be the first thing you notice — ████████ in a way that feels immediately...`,
        `The ${element} resonance in your chart points to someone who █████████ rather than fills silence with...`,
        `The sign that it’s them: a very specific moment involving ████████ that you will recognise because...`,
      ],
      hookLine: "Your soulmate portrait and full recognition guide are ready.",
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

    // ── Soulmate Search ──
    "soulmate-name-initials": {
      headline: "The initials are surfacing\u2026",
      preview: `As a ${sign} with ${element} energy, the letters tied to your soulmate carry a specific vibration. You may have already seen them \u2014 on a street sign, a coffee cup, a name in a dream. The universe has been leaving clues.`,
      blurredLines: [
        "The first initial is likely the letter \u2588\u2588, associated with \u2588\u2588\u2588\u2588\u2588\u2588\u2588 energy and...",
        "The second initial connects to \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 and will appear in the most unexpected...",
        "Together these initials form a pattern that tends to surface when you are feeling...",
      ],
      hookLine: "Your soulmate\u2019s full initials, appearance guidance, and timing signs are ready.",
    },
    "soulmate-zodiac": {
      headline: "A sign is emerging\u2026",
      preview: `Your ${element} resonance and ${sign} placement create a magnetic pull toward a very specific zodiac energy. The traits of this match will both challenge and complete you in ways you haven\u2019t experienced before.`,
      blurredLines: [
        "Their sun sign is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2014 meaning their core energy is deeply \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 and...",
        "Their rising sign suggests they first appear as \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which draws you in by...",
        "In love, this sign shows \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 which balances your \u2588\u2588\u2588\u2588\u2588 nature perfectly...",
      ],
      hookLine: "Your soulmate\u2019s full zodiac profile, traits, and compatibility breakdown are ready.",
    },
    "soulmate-aura": {
      headline: "An aura surrounds them\u2026",
      preview: `Every soul radiates a unique energetic field. The aura of the one drawn to your ${sign} energy carries colors and frequencies that your own energy is already calling in \u2014 you can feel it even now.`,
      blurredLines: [
        "Their dominant aura color is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which means they carry \u2588\u2588\u2588\u2588\u2588\u2588 healing energy...",
        "When you meet, your combined energies will create a \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 field that others notice...",
        "Their aura also reveals they are currently in a period of \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which means...",
      ],
      hookLine: "Your soulmate\u2019s full aura description, energy layers, and compatibility reading are ready.",
    },
    "soulmate-personality": {
      headline: "Their character is forming\u2026",
      preview: `Your ${sign} soul and ${element} nature call in someone with very specific traits. This person\u2019s personality has a signature you will recognize immediately \u2014 because it reflects exactly what you need most to grow.`,
      blurredLines: [
        "Their most prominent trait is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which shows up as \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 in daily life...",
        "In relationships they tend to \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which is exactly what your heart has been seeking...",
        "Their shadow side involves \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which is something you are uniquely equipped to help them...",
      ],
      hookLine: "Your soulmate\u2019s full personality profile and relationship dynamics are ready.",
    },
    "soulmate-spiritual": {
      headline: "A soul aligned with yours\u2026",
      preview: `Spiritual compatibility is the invisible thread that makes love last. The soul drawn to your ${element} energy carries a spiritual orientation that will both mirror and expand your own path in ways you\u2019ve longed for.`,
      blurredLines: [
        "Their spiritual practice centers around \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which aligns deeply with your own \u2588\u2588\u2588\u2588\u2588 path...",
        "They hold beliefs about \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 that will resonate like a long-forgotten truth...",
        "Together your combined spiritual paths point toward \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, a shared calling that will...",
      ],
      hookLine: "Your soulmate\u2019s full spiritual alignment and shared path reading is ready.",
    },
    "soulmate-spirit-animal": {
      headline: "Their spirit guide appears\u2026",
      preview: `Every soul is guided by an animal archetype that shapes their instincts, strengths, and way of loving. The spirit animal of the one meant for you is revealing itself now \u2014 and its message is significant.`,
      blurredLines: [
        "Their spirit animal is the \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, carrying the energy of \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 and fierce...",
        "This totem means they approach love with \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, instinctively protecting and...",
        "The message from this spirit guide for your connection is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2014 a call to...",
      ],
      hookLine: "Your soulmate\u2019s full spirit animal profile, totem meaning, and love style are ready.",
    },
    "soulmate-career": {
      headline: "Their work reflects their soul\u2026",
      preview: `Career and purpose are deeply tied to identity. The person drawn to your ${sign} energy follows a path shaped by ${element} values \u2014 and the way they work mirrors exactly how they love.`,
      blurredLines: [
        "They are likely drawn to \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 as a career field, specifically working with \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588...",
        "Their work ethic is characterized by \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 and a deep need to feel \u2588\u2588\u2588\u2588\u2588\u2588 in...",
        "Financially they approach security with \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 which complements your own \u2588\u2588\u2588\u2588\u2588 style...",
      ],
      hookLine: "Your soulmate\u2019s full career profile, lifestyle match, and financial values are ready.",
    },
    "soulmate-impact": {
      headline: "They carry a mission\u2026",
      preview: `Some souls don\u2019t just come to love you \u2014 they come to amplify your purpose. The person destined for your ${sign} energy carries a mission that will intertwine with yours in ways that feel almost too meaningful to be coincidence.`,
      blurredLines: [
        "Their core mission involves \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which connects directly to your own deeper calling...",
        "Together your combined impact on others will be \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, especially in the realm of...",
        "The legacy you could build together is centered around \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, a gift that outlasts you...",
      ],
      hookLine: "Your soulmate\u2019s full impact, mission, and shared legacy reading is ready.",
    },
    "soulmate-when-where": {
      headline: "The meeting is mapped\u2026",
      preview: `The universe doesn\u2019t leave sacred encounters to chance. Based on your ${sign} chart and ${element} timing cycles, the window for your soulmate encounter has already been identified \u2014 and it\u2019s closer than you think.`,
      blurredLines: [
        "The most likely timeframe is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, specifically during a period when you are...",
        "The type of setting will involve \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2014 somewhere you feel naturally \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588...",
        "A specific sign to watch for is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which will appear in the days just before you...",
      ],
      hookLine: "Your full when and where meeting guide, timing window, and cosmic signs are ready.",
    },
    "soulmate-meeting-details": {
      headline: "The details are shimmering in\u2026",
      preview: `Every great love story has a first moment \u2014 a specific detail that makes it unforgettable. Your cosmic profile reveals the texture of that first encounter in surprising and beautiful specificity.`,
      blurredLines: [
        "The first thing you\u2019ll notice is their \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 before they even speak a word...",
        "The conversation will begin with \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 and shift to something unexpectedly...",
        "A small but significant detail about the moment \u2014 the \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2014 will make you certain...",
      ],
      hookLine: "Your full first meeting story, details, and recognition signs are ready.",
    },
    "soulmate-past-life": {
      headline: "You have met before\u2026",
      preview: `The pull you feel toward the idea of a soulmate isn\u2019t just hope \u2014 it may be recognition. As a ${sign}, your soul carries karmic imprints from a previous connection that is actively seeking resolution and reunion in this lifetime.`,
      blurredLines: [
        "In your most significant past life together you were \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 and they played the role of...",
        "The unresolved bond between you involves \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588, which explains the \u2588\u2588\u2588\u2588\u2588\u2588 you feel...",
        "The karmic gift you\u2019re bringing each other this time is \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 \u2014 a healing that will...",
      ],
      hookLine: "Your full past life connection, karmic bond, and reunion reading is ready.",
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
