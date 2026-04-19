"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  x: number;
  y: number;
  crit?: boolean;
  damageKind?: "physical" | "magic" | "true";
  impactStyle?: "impact" | "explosion" | "chain";
  aoeRadius?: number;
}

export default function ImpactEffect({
  x,
  y,
  crit = false,
  damageKind = "physical",
  impactStyle = "impact",
  aoeRadius = 0,
}: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 500);
    return () => clearTimeout(t);
  }, []);

  const color = useMemo(() => {
    if (damageKind === "magic") return "#d946ef";
    if (damageKind === "true") return "#ffffff";
    return "#22d3ee";
  }, [damageKind]);

  const size = useMemo(() => {
    if (impactStyle === "explosion") {
      return crit ? 80 : Math.max(52, 40 + aoeRadius * 50);
    }

    if (impactStyle === "chain") {
      return crit ? 52 : 38;
    }

    return crit ? 60 : 40;
  }, [impactStyle, crit, aoeRadius]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className="absolute rounded-full border animate-ping"
        style={{
          width: size,
          height: size,
          borderColor: color,
          opacity: 0.5,
          boxShadow:
            impactStyle === "explosion"
              ? `0 0 24px ${color}`
              : `0 0 12px ${color}`,
        }}
      />

      {impactStyle === "explosion" && (
        <div
          className="absolute rounded-full"
          style={{
            width: Math.max(18, size * 0.35),
            height: Math.max(18, size * 0.35),
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${color}, transparent 70%)`,
            opacity: 0.45,
          }}
        />
      )}

      {impactStyle === "chain" && (
        <div
          className="absolute rounded-full"
          style={{
            width: 16,
            height: 16,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: color,
            boxShadow: `0 0 18px ${color}`,
            opacity: 0.75,
          }}
        />
      )}

      <div
        className="rounded-full"
        style={{
          width: 8,
          height: 8,
          background: color,
          boxShadow: `0 0 ${crit ? 20 : 10}px ${color}`,
        }}
      />
    </div>
  );
}
