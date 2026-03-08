"use client";

import { motion } from "framer-motion";
import type { QuizQuestion } from "@/lib/questions";

interface QuizStepProps {
  question: QuizQuestion;
  onAnswer: (questionId: string, answer: string) => void;
  stepNumber: number;
  totalSteps: number;
}

export default function QuizStep({
  question,
  onAnswer,
  stepNumber,
  totalSteps,
}: QuizStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Progress indicator */}
      <div className="flex gap-2 mb-8 justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 w-10 rounded-full transition-colors duration-300 ${
              i < stepNumber
                ? "bg-aura-violet"
                : i === stepNumber
                  ? "bg-aura-rose"
                  : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <h2 className="text-2xl md:text-3xl font-light text-center mb-8 text-aura-soft">
        {question.question}
      </h2>

      <div className="grid gap-3">
        {question.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(question.id, option)}
            className="glass-card px-6 py-4 text-left text-lg text-aura-soft hover:bg-white/10 hover:border-aura-violet/50 transition-all duration-200 cursor-pointer"
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
