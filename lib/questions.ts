export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  type?: "select" | "text";
}

// Shared questions reused across readings
const sunSignQ: QuizQuestion = {
  id: "sun_sign",
  question: "What is your sun sign?",
  options: [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
  ],
};

const personalityQ: QuizQuestion = {
  id: "personality",
  question: "Introverted depth or Extroverted radiance?",
  options: ["Introverted depth", "Extroverted radiance"],
};

const elementQ: QuizQuestion = {
  id: "element",
  question: "Which element do you resonate with?",
  options: ["Earth", "Air", "Fire", "Water"],
};

const soulWindowQ: QuizQuestion = {
  id: "soul_window",
  question: "In a partner, is the 'Gaze' or the 'Smile' the window to the soul?",
  options: ["The Gaze", "The Smile"],
};

const relationshipStatusQ: QuizQuestion = {
  id: "relationship_status",
  question: "What best describes your current love life?",
  options: ["Single and searching", "In a relationship", "It's complicated", "Healing from a past love"],
};

const intentionQ: QuizQuestion = {
  id: "intention",
  question: "What are you seeking clarity on right now?",
  options: ["Love and romance", "Self-understanding", "A major decision", "Healing and closure"],
};

// ── Soulmate Search shared questions ──
const letterEnergyQ: QuizQuestion = {
  id: "letter_energy",
  question: "Which type of letter feels most magnetic to you?",
  options: ["Strong consonants (K, M, R)", "Soft vowels (A, E, I)", "Flowing letters (L, S, N)", "Sharp letters (T, D, B)"],
};

const partnerEnergyQ: QuizQuestion = {
  id: "partner_energy",
  question: "What energy do you seek most in a partner?",
  options: ["Calm and grounded", "Adventurous and free", "Passionate and intense", "Gentle and nurturing"],
};

const auraFeelQ: QuizQuestion = {
  id: "aura_feel",
  question: "When you imagine your soulmate, what energy fills the room?",
  options: ["Warm golden light", "Cool silver radiance", "Deep violet mystery", "Soft rose warmth"],
};

const loveLanguageQ: QuizQuestion = {
  id: "love_language",
  question: "What is your primary love language?",
  options: ["Words of affirmation", "Acts of service", "Physical touch", "Quality time"],
};

const partnerQualityQ: QuizQuestion = {
  id: "partner_quality",
  question: "What quality matters most to you in a partner?",
  options: ["Loyalty and devotion", "Humor and lightness", "Depth and intensity", "Ambition and drive"],
};

const spiritualPathQ: QuizQuestion = {
  id: "spiritual_path",
  question: "How do you connect with your spirituality?",
  options: ["Through nature and earth rituals", "Through meditation and silence", "Through community and sharing", "Through creative expression"],
};

const soulCallingQ: QuizQuestion = {
  id: "soul_calling",
  question: "What feels like your soul\u2019s deepest calling?",
  options: ["To heal others", "To create beauty", "To seek truth", "To build something lasting"],
};

const natureAffinityQ: QuizQuestion = {
  id: "nature_affinity",
  question: "What realm of nature do you feel most connected to?",
  options: ["Forest and earth", "Ocean and water", "Sky and wind", "Desert and fire"],
};

const partnerDriveQ: QuizQuestion = {
  id: "partner_drive",
  question: "What kind of ambition attracts you most?",
  options: ["Creative visionary", "Helping professions", "Entrepreneurial spirit", "Academic and analytical"],
};

const seasonQ: QuizQuestion = {
  id: "season_feeling",
  question: "Which season feels most aligned with new beginnings for you?",
  options: ["Spring \u2014 fresh starts", "Summer \u2014 peak energy", "Autumn \u2014 transformation", "Winter \u2014 quiet magic"],
};

const settingQ: QuizQuestion = {
  id: "setting_attraction",
  question: "Where do you feel most open to love?",
  options: ["In nature", "At a gathering or event", "Through everyday life", "When traveling"],
};

const firstImpressionQ: QuizQuestion = {
  id: "first_impression",
  question: "What kind of first impression do you imagine?",
  options: ["Eyes meet across a crowd", "A chance conversation", "A mutual friend connection", "An unexpected encounter"],
};

const dejaVuQ: QuizQuestion = {
  id: "deja_vu",
  question: "Have you ever felt an unexplainable connection to a stranger?",
  options: ["Yes, powerfully", "Once or twice", "I\u2019m not sure", "Not yet but I believe it\u2019s possible"],
};

const karmicLessonQ: QuizQuestion = {
  id: "karmic_lesson",
  question: "What karmic pattern have you been working to release?",
  options: ["Fear of abandonment", "Difficulty trusting", "Giving too much of yourself", "Holding back your love"],
};

// Questions mapped by reading ID
export const questionsByReading: Record<string, QuizQuestion[]> = {
  "soulmate-sketch": [sunSignQ, personalityQ, elementQ, soulWindowQ],

  "soulmate-name-initials": [sunSignQ, elementQ, letterEnergyQ],
  "soulmate-zodiac": [sunSignQ, elementQ, partnerEnergyQ],
  "soulmate-aura": [sunSignQ, elementQ, auraFeelQ],
  "soulmate-personality": [sunSignQ, partnerQualityQ, loveLanguageQ],
  "soulmate-spiritual": [sunSignQ, elementQ, spiritualPathQ, soulCallingQ],
  "soulmate-spirit-animal": [elementQ, natureAffinityQ, soulWindowQ],
  "soulmate-career": [sunSignQ, partnerDriveQ, elementQ],
  "soulmate-impact": [sunSignQ, soulCallingQ, personalityQ],
  "soulmate-when-where": [sunSignQ, seasonQ, settingQ],
  "soulmate-meeting-details": [sunSignQ, firstImpressionQ, soulWindowQ],
  "soulmate-past-life": [sunSignQ, dejaVuQ, karmicLessonQ],

  "future-baby-sketch": [
    sunSignQ,
    {
      id: "partner_sign",
      question: "What is your partner's sun sign? (Or your ideal partner's)",
      options: [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
      ],
    },
    elementQ,
    {
      id: "baby_trait",
      question: "What quality do you hope your future child carries?",
      options: ["Courage and fire", "Kindness and warmth", "Curiosity and wonder", "Calm and wisdom"],
    },
  ],

  "natal-chart": [
    sunSignQ,
    {
      id: "birth_time_known",
      question: "Do you know your exact birth time?",
      options: ["Yes, I know it", "I have a rough idea", "No, I don't know"],
    },
    {
      id: "chart_focus",
      question: "What area of your life do you want the chart to focus on?",
      options: ["Love and relationships", "Career and purpose", "Personal growth", "All of the above"],
    },
    elementQ,
  ],

  "astrocartography": [
    sunSignQ,
    elementQ,
    {
      id: "travel_intention",
      question: "What are you looking for in a place?",
      options: ["Romance and connection", "Career growth", "Creative inspiration", "Inner peace"],
    },
    {
      id: "current_feeling",
      question: "How do you feel about where you live now?",
      options: ["I love it here", "Something feels off", "I'm ready for a change", "I'm just curious"],
    },
  ],

  "numerology": [
    sunSignQ,
    {
      id: "life_area",
      question: "Which area do you want your numbers to speak to?",
      options: ["Love and soulmates", "Career and money", "Life purpose", "Overall destiny"],
    },
    personalityQ,
    intentionQ,
  ],

  "compatibility": [
    sunSignQ,
    {
      id: "partner_sign",
      question: "What is the other person's sun sign?",
      options: [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
      ],
    },
    {
      id: "relationship_type",
      question: "What is your connection with this person?",
      options: ["Romantic partner", "Crush or new interest", "Ex partner", "Close friend"],
    },
    {
      id: "compat_focus",
      question: "What do you want to understand about this connection?",
      options: ["Emotional compatibility", "Long-term potential", "Communication style", "All of it"],
    },
  ],

  "complete-astrology-guide": [
    sunSignQ,
    {
      id: "astro_level",
      question: "How much do you know about astrology?",
      options: ["Complete beginner", "I know my big three", "Intermediate", "I want to go deeper"],
    },
    elementQ,
    intentionQ,
  ],

  "2026-forecast": [
    sunSignQ,
    relationshipStatusQ,
    {
      id: "forecast_focus",
      question: "What do you want 2026 to bring you?",
      options: ["True love", "Career breakthrough", "Inner peace", "A fresh start"],
    },
    intentionQ,
  ],

  "palmistry": [
    {
      id: "dominant_hand",
      question: "Which is your dominant hand?",
      options: ["Right hand", "Left hand"],
    },
    {
      id: "palm_focus",
      question: "What do you most want to know from your palms?",
      options: ["Love and heart line", "Career and fate line", "Life path and longevity", "Hidden talents"],
    },
    personalityQ,
    intentionQ,
  ],

  "yes-no-tarot": [
    intentionQ,
    {
      id: "energy",
      question: "How are you feeling right now?",
      options: ["Hopeful", "Anxious", "Calm", "Conflicted"],
    },
  ],

  "past-present-future-tarot": [
    intentionQ,
    relationshipStatusQ,
    {
      id: "energy",
      question: "What energy are you bringing to this reading?",
      options: ["Openness", "Urgency", "Curiosity", "Seeking peace"],
    },
  ],

  "past-love-clarity-tarot": [
    sunSignQ,
    {
      id: "ex_feeling",
      question: "How do you feel about your ex right now?",
      options: ["I still love them", "I'm confused", "I'm angry or hurt", "I'm mostly over it"],
    },
    {
      id: "reconnect_desire",
      question: "Would you want to reconnect if the cards aligned?",
      options: ["Yes, definitely", "Maybe, depending", "No, I want closure", "I'm not sure"],
    },
  ],

  "love-triangle-tarot": [
    relationshipStatusQ,
    {
      id: "triangle_role",
      question: "Where do you feel you sit in this dynamic?",
      options: ["Caught in the middle", "Choosing between two", "The one being chosen", "Watching from outside"],
    },
    intentionQ,
  ],

  "true-compatibility-tarot": [
    relationshipStatusQ,
    {
      id: "relationship_feeling",
      question: "What does your gut tell you about this connection?",
      options: ["It feels right", "Something feels off", "I'm unsure", "I need confirmation"],
    },
  ],

  "heartbreak-healing-tarot": [
    {
      id: "heartbreak_stage",
      question: "Where are you in the healing process?",
      options: ["Still in the thick of it", "Starting to process", "Almost through", "Stuck and can't move on"],
    },
    {
      id: "healing_need",
      question: "What do you need most right now?",
      options: ["Understanding why", "Permission to let go", "Hope for the future", "To feel my strength"],
    },
  ],
};

// Fallback for any reading not yet mapped
const defaultQuestions: QuizQuestion[] = [sunSignQ, personalityQ, elementQ, intentionQ];

export function getQuestionsForReading(readingId: string): QuizQuestion[] {
  return questionsByReading[readingId] || defaultQuestions;
}
