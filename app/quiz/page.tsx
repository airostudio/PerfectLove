"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { questions } from "@/lib/questions";
import QuizStep from "@/components/QuizStep";
import PriceCard from "@/components/PriceCard";

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const quizComplete = currentStep >= questions.length;

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full">
        <AnimatePresence mode="wait">
          {!quizComplete ? (
            <QuizStep
              key={currentStep}
              question={questions[currentStep]}
              onAnswer={handleAnswer}
              stepNumber={currentStep}
              totalSteps={questions.length}
            />
          ) : (
            <PriceCard key="price" answers={answers} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
