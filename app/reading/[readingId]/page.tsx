"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { getQuestionsForReading } from "@/lib/questions";
import { readings } from "@/lib/readings";
import QuizStep from "@/components/QuizStep";
import TeaserPreview from "@/components/TeaserPreview";
import Link from "next/link";

export default function ReadingQuizPage() {
  const params = useParams();
  const readingId = params.readingId as string;
  const questions = getQuestionsForReading(readingId);
  const reading = readings.find((r) => r.id === readingId);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const quizComplete = currentStep >= questions.length;

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setCurrentStep((prev) => prev + 1);
  };

  if (!reading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="font-serif text-3xl text-bone mb-4">
          Reading not found
        </h1>
        <p className="text-mist/60 mb-8">
          This reading doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="text-orchid hover:text-bone transition-colors text-sm"
        >
          &larr; Back to Insights
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      {!quizComplete && (
        <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-10 text-center">
          {reading.icon} {reading.title}
        </p>
      )}

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
            <TeaserPreview
              key="teaser"
              readingId={readingId}
              readingTitle={reading.title}
              answers={answers}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
