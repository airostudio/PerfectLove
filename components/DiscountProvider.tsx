"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface DiscountState {
  percent: number;
  tierEndsAt: number | null;
  loading: boolean;
}

const DiscountContext = createContext<DiscountState>({
  percent: 0,
  tierEndsAt: null,
  loading: true,
});

const REFRESH_MS = 5 * 60_000; // keep the displayed tier reasonably fresh across long-open tabs

export function DiscountProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DiscountState>({
    percent: 0,
    tierEndsAt: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/discount/status");
        const data = await res.json();
        if (!cancelled) {
          setState({ percent: data.percent ?? 0, tierEndsAt: data.tierEndsAt ?? null, loading: false });
        }
      } catch {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStatus();
    const id = setInterval(fetchStatus, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return <DiscountContext.Provider value={state}>{children}</DiscountContext.Provider>;
}

export function useDiscount(): DiscountState {
  return useContext(DiscountContext);
}
