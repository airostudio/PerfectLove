import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import GoogleAnalyticsPageview from "@/components/GoogleAnalyticsPageview";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-Y963BC6PMT";

export const metadata: Metadata = {
  title: {
    default:
      "PerfectLove — Personalized Astrology, Tarot Readings & Soulmate Sketches",
    template: "%s | PerfectLove",
  },
  description:
    "Get hyper-personalized soulmate sketches, tarot readings, natal charts, compatibility reports, numerology, palmistry, and astrology forecasts. Take a free quiz and receive your full reading within 24 hours. One-time $6.99 — no subscription.",
  keywords: [
    "soulmate sketch",
    "soulmate sketch reading",
    "future baby sketch",
    "tarot reading online",
    "yes or no tarot",
    "love tarot reading",
    "natal chart reading",
    "birth chart report",
    "astrology compatibility",
    "numerology report",
    "palmistry reading",
    "astrocartography report",
    "love reading",
    "heartbreak healing tarot",
    "past love tarot",
    "love triangle tarot",
    "personalized astrology",
    "2026 astrology forecast",
    "spiritual readings online",
    "cosmic readings",
  ],
  authors: [{ name: "PerfectLove" }],
  creator: "PerfectLove",
  publisher: "PerfectLove",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://perfectlove.co"
  ),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PerfectLove",
    title:
      "PerfectLove — Personalized Astrology, Tarot Readings & Soulmate Sketches",
    description:
      "Hyper-personalized soulmate sketches, tarot readings, birth charts, and more. Take the free quiz and unlock your cosmic insights for just $6.99.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "PerfectLove — Discover What the Stars Know About You",
    description:
      "Personalized soulmate sketches, tarot readings, natal charts, and cosmic forecasts. Free quiz, $6.99 per reading, no subscription.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function JsonLd() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://perfectlove.co";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PerfectLove",
    url: appUrl,
    description:
      "Personalized astrology readings, tarot card pulls, soulmate sketches, natal charts, and spiritual guidance delivered to your inbox.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PerfectLove",
    url: appUrl,
    description:
      "Hyper-personalized soulmate sketches, tarot readings, birth charts, numerology, palmistry, and astrology forecasts.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${appUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a soulmate sketch reading?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A soulmate sketch reading uses your birth details and cosmic energy to channel a hand-drawn portrait of your destined romantic partner. You answer a short quiz, and a personalized sketch along with a detailed written reading is delivered to your inbox within 24 hours.",
        },
      },
      {
        "@type": "Question",
        name: "How does a tarot reading work online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our online tarot readings guide you through focused questions about your situation. Based on your energy and responses, cards are drawn and interpreted to provide clarity on love, relationships, past lives, and life direction.",
        },
      },
      {
        "@type": "Question",
        name: "What is a natal chart and why does it matter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A natal chart (or birth chart) is a map of where every planet was at the exact moment you were born. It reveals your personality traits, strengths, challenges, and life path — like a cosmic blueprint for your entire life.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a PerfectLove reading cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every reading on PerfectLove is a one-time payment of $6.99. You take the quiz for free, see a preview, and only pay if you want the full detailed report. There are no subscriptions or recurring charges.",
        },
      },
      {
        "@type": "Question",
        name: "How long until I receive my reading?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Your complete personalized reading is delivered to your email inbox within 24 hours of purchase. Most readings arrive much sooner.",
        },
      },
      {
        "@type": "Question",
        name: "Can I access my readings again after purchase?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Simply sign in with the same email you used to purchase. All your past readings are saved to your account and accessible anytime from your personal dashboard.",
        },
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Personalized Cosmic Reading",
    description:
      "Hyper-personalized astrology, tarot, soulmate sketch, and spiritual readings delivered to your inbox within 24 hours.",
    brand: { "@type": "Brand", name: "PerfectLove" },
    offers: {
      "@type": "Offer",
      price: "6.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
    </>
  );
}

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
        <JsonLd />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          `}
        </Script>
      </head>
      <body className="antialiased font-sans">
        <Suspense fallback={null}>
          <GoogleAnalyticsPageview />
        </Suspense>
        <div className="starfield" />
        <div className="nebula nebula-1" />
        <div className="nebula nebula-2" />
        <div className="nebula nebula-3" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
