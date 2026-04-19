"use client";

import { useEffect, useState } from "react";

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

interface Trail {
  id: string;
  points: TrailPoint[];
  crit?: boolean;
}

interface Props {
  projectiles: {
    id: string;
    x: number;
    y: number;
    crit?: boolean;
  }[];
}

export default function ProjectileTrailLayer({ projectiles }: Props) {
  const [trails, setTrails] = useState<Trail[]>([]);

  useEffect(() => {
    if (projectiles.length === 0) return;

    setTrails((prev) => {
      const updated = [...prev];

      for (const p of projectiles) {
        let trail = updated.find((t) => t.id === p.id);

        if (!trail) {
          trail = { id: p.id, points: [], crit: p.crit };
          updated.push(trail);
        }

        trail.points.push({
          x: p.x,
          y: p.y,
          life: 1,
        });
      }

      return updated;
    });
  }, [projectiles]);

  useEffect(() => {
    let frame = 0;

    function tick() {
      setTrails((prev) =>
        prev
          .map((t) => ({
            ...t,
            points: t.points
              .map((p) => ({
                ...p,
                life: p.life - 0.04,
              }))
              .filter((p) => p.life > 0),
          }))
          .filter((t) => t.points.length > 0),
      );

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      {trails.map((trail) =>
        trail.points.map((p, i) => (
          <div
            key={`${trail.id}-${i}`}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: trail.crit ? 6 : 4,
              height: trail.crit ? 6 : 4,
              borderRadius: "50%",
              background: trail.crit ? "#ff0000" : "#22d3ee",
              opacity: p.life * 0.6,
              transform: "translate(-50%, -50%)",
            }}
          />
        )),
      )}
    </>
  );
}
