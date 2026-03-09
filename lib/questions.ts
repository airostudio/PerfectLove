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

// Questions mapped by reading ID
export const questionsByReading: Record<string, QuizQuestion[]> = {
  "soulmate-sketch": [sunSignQ, personalityQ, elementQ, soulWindowQ],

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
