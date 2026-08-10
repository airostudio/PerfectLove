/**
 * Real traditional astrology correspondences, computed deterministically
 * from a birth date — no external ephemeris/geocoding, just the standard
 * tropical zodiac date ranges plus well-established correspondence tables
 * (ruling planets, birthstones by month, sign colours, element-based
 * compatibility). Birth time/place aren't required for any of this.
 */

export type ZodiacSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

export type Element = "Fire" | "Earth" | "Air" | "Water";

export interface ZodiacSummary {
  sunSign: ZodiacSign;
  element: Element;
  rulingPlanet: string;
  birthstone: string;
  colours: string;
  energyTime: string;
  luckyNumbers: number[];
  cosmicStrengths: string[];
}

const ELEMENT_BY_SIGN: Record<ZodiacSign, Element> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

const RULING_PLANET_BY_SIGN: Record<ZodiacSign, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Pluto",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Uranus", Pisces: "Neptune",
};

const BIRTHSTONE_BY_MONTH: Record<number, string> = {
  1: "Garnet", 2: "Amethyst", 3: "Aquamarine", 4: "Diamond",
  5: "Emerald", 6: "Pearl", 7: "Ruby", 8: "Peridot",
  9: "Sapphire", 10: "Opal", 11: "Topaz", 12: "Turquoise",
};

const COLOURS_BY_SIGN: Record<ZodiacSign, string> = {
  Aries: "Red", Taurus: "Green", Gemini: "Yellow", Cancer: "Silver",
  Leo: "Gold", Virgo: "Forest Green", Libra: "Pastel Blue", Scorpio: "Deep Crimson",
  Sagittarius: "Purple", Capricorn: "Charcoal Grey", Aquarius: "Electric Blue", Pisces: "Sea Green",
};

const ENERGY_TIME_BY_ELEMENT: Record<Element, string> = {
  Fire: "Midday, when the sun is highest",
  Earth: "Early morning, just after sunrise",
  Air: "Dawn and dusk, the in-between hours",
  Water: "Night, once the world goes quiet",
};

const LUCKY_NUMBERS_BY_SIGN: Record<ZodiacSign, number[]> = {
  Aries: [1, 9, 17, 27], Taurus: [2, 6, 15, 24], Gemini: [5, 7, 14, 23],
  Cancer: [2, 4, 11, 20], Leo: [1, 5, 9, 19], Virgo: [5, 14, 15, 23],
  Libra: [6, 15, 24, 33], Scorpio: [8, 11, 18, 22], Sagittarius: [3, 9, 12, 21],
  Capricorn: [4, 8, 13, 22], Aquarius: [4, 7, 11, 22], Pisces: [3, 7, 12, 16],
};

const COSMIC_STRENGTHS_BY_SIGN: Record<ZodiacSign, string[]> = {
  Aries: ["Courageous", "Determined", "Confident", "Enthusiastic"],
  Taurus: ["Reliable", "Patient", "Devoted", "Grounded"],
  Gemini: ["Adaptable", "Curious", "Witty", "Expressive"],
  Cancer: ["Intuitive", "Nurturing", "Loyal", "Protective"],
  Leo: ["Generous", "Warm-hearted", "Charismatic", "Creative"],
  Virgo: ["Analytical", "Reliable", "Practical", "Hardworking"],
  Libra: ["Diplomatic", "Fair-minded", "Graceful", "Idealistic"],
  Scorpio: ["Passionate", "Resourceful", "Brave", "Perceptive"],
  Sagittarius: ["Optimistic", "Adventurous", "Honest", "Freedom-loving"],
  Capricorn: ["Disciplined", "Responsible", "Ambitious", "Steady"],
  Aquarius: ["Original", "Independent", "Visionary", "Humanitarian"],
  Pisces: ["Compassionate", "Artistic", "Intuitive", "Gentle"],
};

// Ideal-partner traits per sign, grounded in classical element compatibility
// (Fire pairs with Air, Earth pairs with Water) rather than picked at random.
const SOULMATE_TRAITS_BY_SIGN: Record<ZodiacSign, string[]> = {
  Aries: ["Quick-witted and communicative", "Independent, not clingy", "Able to match their energy", "Honest and direct"],
  Taurus: ["Emotionally deep and sincere", "Patient and unhurried", "Loyal and consistent", "A comforting presence"],
  Gemini: ["Spontaneous and bold", "A stimulating conversationalist", "Confident and passionate", "Open to new experiences"],
  Cancer: ["Steady and dependable", "Emotionally attuned", "Patient with their moods", "Home-oriented and grounded"],
  Leo: ["Expressive and engaging", "Generous with praise", "Socially confident", "Genuinely supportive"],
  Virgo: ["Emotionally open", "Gentle and reassuring", "Appreciative of their care", "Intuitive and sincere"],
  Libra: ["Passionate and decisive", "Spontaneous", "Confident taking initiative", "Warm and affectionate"],
  Scorpio: ["Steady and trustworthy", "Unshaken by their intensity", "Patient and grounded", "Deeply loyal"],
  Sagittarius: ["Free-spirited and curious", "Intellectually engaging", "Comfortable with independence", "An optimistic outlook"],
  Capricorn: ["Warm and emotionally expressive", "Patient with their reserve", "Nurturing", "Brings softness to their drive"],
  Aquarius: ["Warm and spirited", "Comfortable with their individuality", "Confident and bold", "Sparks their passion"],
  Pisces: ["Grounded and dependable", "Protective and steady", "Patient with their dreaminess", "Practically supportive"],
};

function parseBirthDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  // Rejects overflowed dates like Feb 30 (UTC normalizes them into the next month)
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

export function getSunSign(month: number, day: number): ZodiacSign {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces"; // Feb 19 – Mar 20
}

/** birthDate must be an ISO "yyyy-mm-dd" string (native <input type="date"> value). */
export function getZodiacSummary(birthDate: string): ZodiacSummary | null {
  const date = parseBirthDate(birthDate);
  if (!date) return null;

  const month = date.getUTCMonth() + 1;
  const sign = getSunSign(month, date.getUTCDate());
  const element = ELEMENT_BY_SIGN[sign];

  return {
    sunSign: sign,
    element,
    rulingPlanet: RULING_PLANET_BY_SIGN[sign],
    birthstone: BIRTHSTONE_BY_MONTH[month],
    colours: COLOURS_BY_SIGN[sign],
    energyTime: ENERGY_TIME_BY_ELEMENT[element],
    luckyNumbers: LUCKY_NUMBERS_BY_SIGN[sign],
    cosmicStrengths: COSMIC_STRENGTHS_BY_SIGN[sign],
  };
}

export function getSoulmateTraits(sunSign: string): string[] {
  return SOULMATE_TRAITS_BY_SIGN[sunSign as ZodiacSign] ?? SOULMATE_TRAITS_BY_SIGN.Cancer;
}
