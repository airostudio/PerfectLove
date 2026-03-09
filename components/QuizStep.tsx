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
      {/* Step counter */}
      <p className="text-xs text-ash text-center mb-3 tracking-widest uppercase">
        {stepNumber + 1} of {totalSteps}
      </p>

      {/* Progress bar */}
      <div className="w-full h-[2px] bg-bone/5 rounded-full mb-10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amethyst to-orchid rounded-full"
          initial={{ width: `${(stepNumber / totalSteps) * 100}%` }}
          animate={{ width: `${((stepNumber + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <h2 className="font-serif text-2xl md:text-3xl text-center mb-10 text-bone leading-snug">
        {question.question}
      </h2>

      <div className="grid gap-3">
        {question.options.map((option) => (
          <motion.button
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAnswer(question.id, option)}
            className="glass-card-hover px-6 py-4 text-left text-base text-mist cursor-pointer"
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
