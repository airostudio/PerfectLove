import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PerfectLove — Navigate Your Love Life Through the Stars",
  description:
    "Hyper-personalized soulmate sketch based on your cosmic profile. Answer 4 questions and receive your reading within 24 hours.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">
        <div className="starfield" />
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
