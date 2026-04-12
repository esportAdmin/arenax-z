"use client";

import { useEffect, useState } from "react";

export interface ProjectileInput {
  id: string;
  from: [number, number];
  to: [number, number];
  crit?: boolean;
  projectileType?: "none" | "arrow" | "bolt" | "orb";
  duration?: number;
}

interface ProjectileRuntime extends ProjectileInput {
  startTime: number;
}

export interface ProjectilePosition {
  id: string;
  x: number;
  y: number;
  angle: number;
  dx: number;
  dy: number;
  crit?: boolean;
}

interface Props {
  projectiles: ProjectileInput[];
  defaultDuration?: number;
  onUpdate?: (positions: ProjectilePosition[]) => void;
}

function easeOutQuad(t: number) {
  return t * (2 - t);
}

function normalizeVector(dx: number, dy: number) {
  const len = Math.hypot(dx, dy);
  if (len <= 0.0001) return { dx: 0, dy: -1 };
  return { dx: dx / len, dy: dy / len };
}

function getProjectileStyle(
  projectileType: ProjectileInput["projectileType"],
  crit?: boolean,
) {
  if (projectileType === "arrow") {
    return {
      width: crit ? 16 : 12, height: crit ? 3 : 2, borderRadius: 999,
      background: crit ? "#ff8a8a" : "#e5e7eb",
      boxShadow: crit ? "0 0 12px #ff8a8a" : "0 0 8px #e5e7eb",
    };
  }
  if (projectileType === "orb") {
    return {
      width: crit ? 10 : 7, height: crit ? 10 : 7, borderRadius: "50%",
      background: crit ? "#ff0000" : "#22d3ee",
      boxShadow: crit ? "0 0 14px #ff0000" : "0 0 12px #22d3ee",
    };
  }
  if (projectileType === "bolt") {
    return {
      width: crit ? 12 : 8, height: crit ? 4 : 3, borderRadius: 999,
      background: crit ? "#fde047" : "#a78bfa",
      boxShadow: crit ? "0 0 14px #fde047" : "0 0 10px #a78bfa",
    };
  }
  return {
    width: crit ? 14 : 10, height: crit ? 4 : 3, borderRadius: 999,
    background: crit ? "#ff0000" : "#22d3ee",
    boxShadow: crit ? "0 0 14px #ff0000" : "0 0 10px #22d3ee",
  };
}

export default function ProjectileLayer({
  projectiles,
  defaultDuration = 400,
  onUpdate,
}: Props) {
  const [active, setActive] = useState<ProjectileRuntime[]>([]);

  useEffect(() => {
    if (projectiles.length === 0) return;
    const now = Date.now();
    setActive((prev) => [...prev, ...projectiles.map((p) => ({ ...p, startTime: now }))]);
  }, [projectiles]);

  useEffect(() => {
    let frame = 0;

    function tick() {
      const now = Date.now();

      setActive((prev) => {
        const alive = prev.filter((p) => {
          const duration = p.duration ?? defaultDuration;
          return now - p.startTime < duration;
        });

        if (onUpdate) {
          const positions: ProjectilePosition[] = alive.map((p) => {
            const duration  = p.duration ?? defaultDuration;
            const t         = Math.min(1, (now - p.startTime) / duration);
            const eased     = easeOutQuad(t);
            const x         = p.from[0] + (p.to[0] - p.from[0]) * eased;
            const y         = p.from[1] + (p.to[1] - p.from[1]) * eased;
            // Arc dynamique proportionnel à la distance — plus naturel qu'une valeur fixe
            const projDist  = Math.hypot(p.to[0] - p.from[0], p.to[1] - p.from[1]);
            const arcHeight = Math.min(30, projDist * 0.25);
            const arc       = Math.sin(Math.PI * eased) * arcHeight;
            const rawDx     = p.to[0] - p.from[0];
            const rawDy     = p.to[1] - p.from[1];
            const vector    = normalizeVector(rawDx, rawDy);
            const angle     = (Math.atan2(rawDy, rawDx) * 180) / Math.PI;
            return { id: p.id, x, y: y - arc, angle, dx: vector.dx, dy: vector.dy, crit: p.crit };
          });
          onUpdate(positions);
        }

        return alive;
      });

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [defaultDuration, onUpdate]);

  return (
    <>
      {active.map((p) => {
        const now       = Date.now();
        const duration  = p.duration ?? defaultDuration;
        const t         = Math.min(1, (now - p.startTime) / duration);
        const eased     = easeOutQuad(t);
        const x         = p.from[0] + (p.to[0] - p.from[0]) * eased;
        const y         = p.from[1] + (p.to[1] - p.from[1]) * eased;
        const projDist  = Math.hypot(p.to[0] - p.from[0], p.to[1] - p.from[1]);
        const arcHeight = Math.min(30, projDist * 0.25);
        const arc       = Math.sin(Math.PI * eased) * arcHeight;
        const dx        = p.to[0] - p.from[0];
        const dy        = p.to[1] - p.from[1];
        const angle     = (Math.atan2(dy, dx) * 180) / Math.PI;
        const style     = getProjectileStyle(p.projectileType, p.crit);

        return (
          <div
            key={p.id}
            className="pointer-events-none absolute z-50"
            style={{
              left: x, top: y - arc,
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              ...style,
            }}
          />
        );
      })}
    </>
  );
}
