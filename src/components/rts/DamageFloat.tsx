"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  x: number;
  y: number;
  damage: number;
  crit?: boolean;
  result?: "hit" | "miss" | "blocked";
  ability?: string;
  impactDirection?: {
    dx: number;
    dy: number;
  } | null;
  damageKind?: "physical" | "magic" | "true";
}

export default function DamageFloat({
  x,
  y,
  damage,
  crit = false,
  result = "hit",
  ability,
  impactDirection = null,
  damageKind = "physical",
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 900);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  const offset = useMemo(() => {
    if (!impactDirection) {
      return { x: 0, y: 0 };
    }

    return {
      x: impactDirection.dx * 18,
      y: impactDirection.dy * 18,
    };
  }, [impactDirection]);

  const display = useMemo(() => {
    if (result === "miss") {
      return {
        text: "MISS",
        color: "#94a3b8",
        textShadow: "0 0 8px rgba(148,163,184,0.45)",
      };
    }

    if (result === "blocked") {
      return {
        text: "BLOCK",
        color: "#22d3ee",
        textShadow: "0 0 8px rgba(34,211,238,0.45)",
      };
    }

    if (damageKind === "magic") {
      return {
        text: String(damage),
        color: crit ? "#f0abfc" : "#d946ef",
        textShadow: crit
          ? "0 0 12px rgba(240,171,252,0.65)"
          : "0 0 10px rgba(217,70,239,0.55)",
      };
    }

    if (damageKind === "true") {
      return {
        text: String(damage),
        color: "#f8fafc",
        textShadow: "0 0 10px rgba(248,250,252,0.5)",
      };
    }

    return {
      text: String(damage),
      color: crit ? "#fde047" : "#ffffff",
      textShadow: crit
        ? "0 0 12px rgba(253,224,71,0.65)"
        : "0 0 10px rgba(255,255,255,0.35)",
    };
  }, [damage, crit, result, damageKind]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{
        left: x + offset.x,
        top: y + offset.y,
        transform: "translate(-50%, -50%)",
        animation: "floatUp 0.9s ease-out forwards",
      }}
    >
      <div
        className="text-center text-xs font-bold"
        style={{
          color: display.color,
          textShadow: display.textShadow,
          fontSize: crit ? "14px" : "11px",
        }}
      >
        {display.text}
      </div>

      {ability && ability !== "none" && result === "hit" && (
        <div
          className="mt-0.5 text-center text-[10px] uppercase tracking-wide"
          style={{
            color: "#c084fc",
            textShadow: "0 0 8px rgba(192,132,252,0.45)",
          }}
        >
          {ability}
        </div>
      )}
    </div>
  );
}
