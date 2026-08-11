import type { Metadata } from "next";
import HowItWorksContent from "./HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From a two-minute quiz to a personalized reading in your inbox — see exactly how PerfectLove works, what it costs, and how delivery works.",
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
