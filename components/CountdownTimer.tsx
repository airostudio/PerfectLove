"use client";

import { useEffect, useState } from "react";

function formatRemaining(ms: number, expiredLabel: string): string {
  if (ms <= 0) return expiredLabel;
  const totalMinutes = Math.floor(ms / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return "Less than a minute";
}

interface CountdownTimerProps {
  target: string | number; // ISO string or ms epoch
  expiredLabel?: string;
}

export default function CountdownTimer({ target, expiredLabel = "Ready any moment" }: CountdownTimerProps) {
  const targetMs = typeof target === "number" ? target : new Date(target).getTime();
  const [remainingMs, setRemainingMs] = useState(() => targetMs - Date.now());

  useEffect(() => {
    const tick = () => setRemainingMs(targetMs - Date.now());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [targetMs]);

  return <>{formatRemaining(remainingMs, expiredLabel)}</>;
}
