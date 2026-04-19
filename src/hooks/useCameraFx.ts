"use client";

import { useEffect, useState } from "react";

interface ImpactEvent {
  damage: number;
  crit?: boolean;
  result?: "hit" | "miss" | "blocked";
  dx?: number;
  dy?: number;
}

export function useCameraFx(events: ImpactEvent[]) {
  const [shake, setShake] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!events || events.length === 0) return;

    let totalX = 0;
    let totalY = 0;

    for (const e of events) {
      if (e.result === "miss") continue;

      const intensity =
        e.damage / 60 + (e.crit ? 2.5 : 0) + (e.result === "blocked" ? 0.4 : 0);

      const dirX = e.dx ?? Math.random() - 0.5;
      const dirY = e.dy ?? Math.random() - 0.5;

      totalX += dirX * intensity;
      totalY += dirY * intensity;
    }

    setShake({
      x: totalX,
      y: totalY,
    });

    const timeout = setTimeout(() => {
      setShake({ x: 0, y: 0 });
    }, 120);

    return () => clearTimeout(timeout);
  }, [events]);

  return shake;
}
