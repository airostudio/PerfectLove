"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// The root layout's gtag('config', ..., { send_page_view: false }) disables
// GA4's automatic page_view — it fires once on load AND again on every
// history.pushState the Next.js router triggers internally (often more than
// once per real navigation), which double-counts pageviews in a SPA. This
// sends exactly one page_view per actual route change instead.
export default function GoogleAnalyticsPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    const query = searchParams.toString();
    window.gtag("event", "page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
