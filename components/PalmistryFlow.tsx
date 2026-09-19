"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestionsForReading } from "@/lib/questions";
import QuizStep from "@/components/QuizStep";
import TeaserPreview from "@/components/TeaserPreview";
import type { Reading } from "@/lib/readings";
import type { PalmAnalysis } from "@/lib/palm-vision";

type Phase =
  | "checking-camera"
  | "intro"
  | "requesting-camera"
  | "capturing"
  | "preview"
  | "analyzing"
  | "analyze-error"
  | "captured"
  | "quiz";

const MAX_DIMENSION = 900; // keeps the captured JPEG small and fast to send

function serializeAnalysis(a: PalmAnalysis): string {
  return [
    `Hand Shape: ${a.handShape}`,
    `Heart Line: ${a.heartLine}`,
    `Head Line: ${a.headLine}`,
    `Life Line: ${a.lifeLine}`,
    `Fate Line: ${a.fateLine}`,
    `Mounts: ${a.mounts}`,
    `Markings: ${a.markings}`,
  ].join("\n");
}

interface PalmistryFlowProps {
  reading: Reading;
}

export default function PalmistryFlow({ reading }: PalmistryFlowProps) {
  const [phase, setPhase] = useState<Phase>("checking-camera");
  const [error, setError] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PalmAnalysis | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizStep, setQuizStep] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const questions = getQuestionsForReading(reading.id);
  const quizComplete = quizStep >= questions.length;

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  // Feature-detect a camera without ever prompting for permission — only
  // offer the option if one plausibly exists.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!navigator.mediaDevices?.enumerateDevices) {
          if (!cancelled) setPhase("quiz");
          return;
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some((d) => d.kind === "videoinput");
        if (!cancelled) setPhase(hasCamera ? "intro" : "quiz");
      } catch {
        if (!cancelled) setPhase("quiz");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const enableCamera = async () => {
    setError("");
    setPhase("requesting-camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setPhase("capturing");
    } catch {
      setError("Camera access wasn't available — no problem, let's continue with the questions instead.");
      setPhase("quiz");
    }
  };

  // A plain ref + effect keyed on `phase` isn't reliable here: AnimatePresence's
  // mode="wait" delays mounting the new child (this <video>) until the
  // previous phase's exit animation finishes, so the effect can fire before
  // the element actually exists in the DOM. A callback ref instead fires
  // exactly when the node is inserted, regardless of animation timing.
  const attachVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
      el.play().catch(() => {});
    }
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(video.videoWidth, video.videoHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCapturedImage(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
    setPhase("preview");
  };

  const retake = () => {
    setCapturedImage(null);
    enableCamera();
  };

  const analyzePhoto = async () => {
    if (!capturedImage) return;
    setPhase("analyzing");
    setError("");
    try {
      const res = await fetch("/api/palm-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: capturedImage }),
      });
      const data = await res.json();

      // Whether this succeeds or fails, the photo itself is done being
      // useful the moment this call returns — drop our only reference to it
      // so it's no longer reachable in memory.
      setCapturedImage(null);

      if (!res.ok) {
        setError(data.error || "Couldn't analyze that photo.");
        setPhase("analyze-error");
        return;
      }

      setAnswers((prev) => ({ ...prev, palm_analysis: serializeAnalysis(data.analysis) }));
      setAnalysisResult(data.analysis);
      setPhase("captured");
    } catch {
      setCapturedImage(null);
      setError("Connection failed. You can try again or skip ahead.");
      setPhase("analyze-error");
    }
  };

  const skipCamera = () => {
    stopCamera();
    setCapturedImage(null);
    setPhase("quiz");
  };

  const handleQuizAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setQuizStep((prev) => prev + 1);
  };

  if (phase === "quiz" && quizComplete) {
    return <TeaserPreview reading={reading} answers={answers} />;
  }

  return (
    <>
      <p className="text-xs uppercase tracking-[0.3em] text-orchid/50 mb-10 text-center">
        {reading.icon} {reading.title}
      </p>

      <div className="w-full">
        <AnimatePresence mode="wait">
          {phase === "checking-camera" && (
            <motion.div key="checking" className="text-center text-ash text-xs">
              Checking for a camera…
            </motion.div>
          )}

          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg mx-auto glass-card p-8 md:p-10 text-center"
            >
              <p className="text-4xl mb-4">✋</p>
              <h2 className="font-serif text-2xl md:text-3xl text-bone mb-4">
                Show Us Your Palm
              </h2>
              <p className="text-sm text-mist/70 leading-relaxed mb-6">
                We can take a real photo of your palm and analyze its actual
                lines, shape, and mounts for a much more personal reading.
              </p>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-gold font-medium mb-1.5">
                  ✦ Your privacy
                </p>
                <p className="text-xs text-mist/60 leading-relaxed">
                  Your photo is analyzed instantly and is <strong>never saved</strong> —
                  it exists only in your browser and our server&apos;s memory for
                  the few seconds it takes to read it, then it&apos;s gone. It&apos;s
                  never stored, uploaded to a file, or kept anywhere.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={enableCamera}
                  className="btn-mystic flex-1 py-3.5 text-white text-sm cursor-pointer"
                >
                  Enable Camera
                </button>
                <button
                  onClick={skipCamera}
                  className="flex-1 py-3.5 text-sm text-ash hover:text-mist transition-colors cursor-pointer border border-white/[0.08] rounded-full"
                >
                  Skip — Just Answer Questions
                </button>
              </div>
            </motion.div>
          )}

          {phase === "requesting-camera" && (
            <motion.div key="requesting" className="text-center text-ash text-xs">
              Requesting camera access…
            </motion.div>
          )}

          {phase === "capturing" && (
            <motion.div
              key="capturing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] mb-6 bg-black">
                <video
                  ref={attachVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-2/3 aspect-square rounded-[40%] border-2 border-dashed border-gold/60" />
                </div>
                <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-white/80 bg-black/40 py-1.5">
                  Open palm, flat, well-lit — fill the outline
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="btn-mystic flex-1 py-3.5 text-white text-sm cursor-pointer"
                >
                  Capture Photo
                </button>
                <button
                  onClick={skipCamera}
                  className="px-5 py-3.5 text-sm text-ash hover:text-mist transition-colors cursor-pointer"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}

          {phase === "preview" && capturedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg mx-auto"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Your captured palm"
                className="w-full aspect-[3/4] object-cover rounded-2xl border border-white/[0.08] mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={analyzePhoto}
                  className="btn-mystic flex-1 py-3.5 text-white text-sm cursor-pointer"
                >
                  Analyze My Palm →
                </button>
                <button
                  onClick={retake}
                  className="px-5 py-3.5 text-sm text-ash hover:text-mist transition-colors cursor-pointer border border-white/[0.08] rounded-full"
                >
                  Retake
                </button>
              </div>
            </motion.div>
          )}

          {phase === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <p className="text-sm text-gold mb-2">Reading your palm…</p>
              <p className="text-xs text-ash">This takes a few seconds.</p>
            </motion.div>
          )}

          {phase === "analyze-error" && (
            <motion.div
              key="analyze-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-lg mx-auto glass-card p-8 text-center"
            >
              <p className="text-sm text-dusty-rose mb-6">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={enableCamera}
                  className="btn-mystic flex-1 py-3.5 text-white text-sm cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={skipCamera}
                  className="px-5 py-3.5 text-sm text-ash hover:text-mist transition-colors cursor-pointer border border-white/[0.08] rounded-full"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}

          {phase === "captured" && analysisResult && (
            <motion.div
              key="captured"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg mx-auto glass-card p-8 md:p-10 text-center"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-orchid/50 mb-3">
                Palm Captured
              </p>
              <h2 className="font-serif text-xl text-bone mb-4">
                Hand Shape: {analysisResult.handShape.split(".")[0]}
              </h2>
              <p className="text-sm text-mist/60 leading-relaxed mb-6">
                Your photo has already been discarded. A few more questions,
                then your full reading unlocks.
              </p>
              <button
                onClick={() => setPhase("quiz")}
                className="btn-mystic w-full py-3.5 text-white text-sm cursor-pointer"
              >
                Continue
              </button>
            </motion.div>
          )}

          {phase === "quiz" && !quizComplete && (
            <QuizStep
              key={quizStep}
              question={questions[quizStep]}
              onAnswer={handleQuizAnswer}
              stepNumber={quizStep}
              totalSteps={questions.length}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
