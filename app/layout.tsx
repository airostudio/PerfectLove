import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PerfectLove — Discover Your Soulmate Sketch",
  description:
    "Answer 4 cosmic questions and receive a hand-sketched portrait of your soulmate within 24 hours.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
