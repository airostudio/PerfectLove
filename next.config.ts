import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  // Next.js requires unsafe-inline for inline scripts during hydration
  "script-src 'self' 'unsafe-inline' https://js.stripe.com",
  // Tailwind CSS and Framer Motion inject inline styles; Google Fonts stylesheet
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Sketch images are re-hosted in Supabase Storage after generation (DALL-E's
  // own URLs, still allowed here as a fallback, expire after ~1 hour)
  "img-src 'self' data: blob: https://*.supabase.co https://oaidalleapiprodscus.blob.core.windows.net",
  // Google Fonts serves font files from fonts.gstatic.com
  "font-src 'self' https://fonts.gstatic.com",
  "frame-src https://js.stripe.com",
  "connect-src 'self' https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
