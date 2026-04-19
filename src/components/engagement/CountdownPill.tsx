"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

interface CountdownPillProps {
  label: string;
  target: Date | string | number;
  tone?: "cyan" | "amber" | "rose";
  className?: string;
}

function formatRemaining(ms: number) {
  if (ms <= 0) {
    return "00:00:00";
  }

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

const toneClasses = {
  cyan: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-100",
  rose: "border-rose-400/20 bg-rose-400/10 text-rose-100",
};

export function CountdownPill({
  label,
  target,
  tone = "cyan",
  className,
}: CountdownPillProps) {
  const targetTime = useMemo(() => new Date(target).getTime(), [target]);
  const [hasMounted, setHasMounted] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    setHasMounted(true);
    setRemaining(Math.max(targetTime - Date.now(), 0));

    const interval = window.setInterval(() => {
      setRemaining(Math.max(targetTime - Date.now(), 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [targetTime]);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]",
        toneClasses[tone],
        className,
      )}
    >
      <Clock3 className="h-3.5 w-3.5" />
      <span className="text-[10px] text-white/70">{label}</span>
      <span className="font-display text-[11px] text-white" suppressHydrationWarning>
        {hasMounted ? formatRemaining(remaining) : "--:--:--"}
      </span>
    </div>
  );
}
