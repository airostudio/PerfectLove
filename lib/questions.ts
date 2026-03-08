export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export const questions: QuizQuestion[] = [
  {
    id: "sun_sign",
    question: "What is your sun sign?",
    options: [
      "Aries",
      "Taurus",
      "Gemini",
      "Cancer",
      "Leo",
      "Virgo",
      "Libra",
      "Scorpio",
      "Sagittarius",
      "Capricorn",
      "Aquarius",
      "Pisces",
    ],
  },
  {
    id: "personality",
    question: "Introverted depth or Extroverted radiance?",
    options: ["Introverted depth", "Extroverted radiance"],
  },
  {
    id: "element",
    question: "Which element do you resonate with?",
    options: ["Earth", "Air", "Fire", "Water"],
  },
  {
    id: "soul_window",
    question:
      "In a partner, is the 'Gaze' or the 'Smile' the window to the soul?",
    options: ["The Gaze", "The Smile"],
  },
];
