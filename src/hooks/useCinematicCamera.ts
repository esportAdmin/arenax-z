"use client";

import { useEffect, useState } from "react";

interface CinematicEvent {
  x: number;
  y: number;
  damage: number;
  crit?: boolean;
}

export function useCinematicCamera(events: CinematicEvent[]) {
  const [zoom, setZoom] = useState(1);
  const [slowMo, setSlowMo] = useState(false);

  useEffect(() => {
    if (!events || events.length === 0) return;

    // 🔥 strongest event
    const strongest = [...events].sort((a, b) => b.damage - a.damage)[0];
    if (!strongest) return;

    const isBigHit = strongest.damage > 40 || strongest.crit;

    if (!isBigHit) return;

    // 🎬 cinematic trigger
    setZoom(1.6);
    setSlowMo(true);

    const t = setTimeout(() => {
      setZoom(1);
      setSlowMo(false);
    }, 450);

    return () => clearTimeout(t);
  }, [events]);

  return {
    zoom,
    slowMo,
  };
}
