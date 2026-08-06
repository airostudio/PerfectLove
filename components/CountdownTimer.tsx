"use client";

import { useEffect, useState } from "react";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Ready any moment";
  const totalMinutes = Math.floor(ms / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return "Less than a minute";
}

export default function CountdownTimer({ target }: { target: string }) {
  const [remainingMs, setRemainingMs] = useState(() => new Date(target).getTime() - Date.now());

  useEffect(() => {
    const tick = () => setRemainingMs(new Date(target).getTime() - Date.now());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [target]);

  return <>{formatRemaining(remainingMs)}</>;
}
