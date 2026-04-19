"use client";

import { useEffect, useState } from "react";

export interface AbilityFxEvent {
  id: string;
  type: "dash" | "explosion" | "chain";
  x: number;
  y: number;
}

export function useAbilityFx(events: AbilityFxEvent[]) {
  const [fx, setFx] = useState<AbilityFxEvent[]>([]);

  useEffect(() => {
    if (!events.length) return;

    setFx((prev) => [...prev, ...events]);

    const t = setTimeout(() => {
      setFx([]);
    }, 600);

    return () => clearTimeout(t);
  }, [events]);

  return fx;
}
