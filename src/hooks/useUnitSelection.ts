"use client";

import { useState } from "react";
import { ArmyUnitLive } from "@/hooks/useArmyUnitsLive";

export function useUnitSelection(units: ArmyUnitLive[]) {
  const [selectedUnits, setSelectedUnits] = useState<ArmyUnitLive[]>([]);
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);

  function onMouseDown(x: number, y: number) {
    setDragging(true);
    setStart([x, y]);
    setEnd([x, y]);
  }

  function onMouseMove(x: number, y: number) {
    if (!dragging) return;
    setEnd([x, y]);
  }

  function onMouseUp() {
    if (!start || !end) {
      setDragging(false);
      return;
    }

    const [x1, y1] = start;
    const [x2, y2] = end;

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    const selected = units.filter((u) => {
      if (typeof u.lat !== "number" || typeof u.lng !== "number") return false;

      // ⚠️ MVP projection (écran ≈ coords)
      const px = u.lng;
      const py = u.lat;

      return px >= minX && px <= maxX && py >= minY && py <= maxY;
    });

    setSelectedUnits(selected);
    setDragging(false);
  }

  return {
    selectedUnits,
    dragging,
    start,
    end,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    setSelectedUnits,
  };
}
