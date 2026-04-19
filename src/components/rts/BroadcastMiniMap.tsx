"use client";

import { useMemo } from "react";

// ============================================================
// TYPES
// ============================================================

export interface MiniMapUnit {
  id: string;
  x: number;
  y: number;
  clubId?: string | null;
}

/** Zone de danger (meteor, blackhole, AOE) projetée sur la minimap */
export interface MiniMapZone {
  x: number;
  y: number;
  radius: number;
  kind?: "aoe" | "blackhole" | "projectile";
}

interface Props {
  units: MiniMapUnit[];
  focusPoint?: { x: number; y: number } | null;
  dangerZones?: MiniMapZone[];
  width?: number;
  height?: number;
}

// ============================================================
// HELPERS
// ============================================================

function normalizeBounds(units: MiniMapUnit[]) {
  if (!units.length) return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  const xs = units.map((u) => u.x);
  const ys = units.map((u) => u.y);
  return {
    minX: Math.min(...xs), maxX: Math.max(...xs),
    minY: Math.min(...ys), maxY: Math.max(...ys),
  };
}

function scalePoint(value: number, min: number, max: number, size: number): number {
  if (max - min <= 0.0001) return size / 2;
  return ((value - min) / (max - min)) * size;
}

/**
 * Assigne une couleur stable par index d'apparition du clubId.
 *
 * Fix I : évite clubId.includes("2") qui est fragile sur les UUIDs.
 * Le premier club rencontré dans la liste des unités = cyan (équipe 1).
 * Le second club = red (équipe 2). Les suivants = blanc.
 */
function buildClubColorMap(units: MiniMapUnit[]): Map<string, string> {
  const CLUB_COLORS = [
    "rgba(34,211,238,0.95)",  // cyan  — équipe 1
    "rgba(239,68,68,0.95)",   // red   — équipe 2
    "rgba(250,204,21,0.95)",  // yellow — équipe 3 (rare)
  ];
  const seen = new Map<string, string>();
  let idx = 0;
  for (const unit of units) {
    const clubId = unit.clubId ?? "unknown";
    if (!seen.has(clubId)) {
      seen.set(clubId, CLUB_COLORS[idx] ?? "rgba(255,255,255,0.7)");
      idx++;
    }
  }
  return seen;
}

// ============================================================
// COMPONENT
// ============================================================

/**
 * BroadcastMiniMap — vue aérienne des positions d'unités.
 *
 * - Normalise les coordonnées sur le canvas (minX/maxX/minY/maxY)
 * - Couleur par équipe : premier club = cyan, second = red (index-based)
 * - Affiche le focusPoint de la caméra spectateur (anneau jaune)
 *
 * Path : @/components/rts/BroadcastMiniMap
 */
export default function BroadcastMiniMap({
  units,
  focusPoint  = null,
  dangerZones = [],
  width  = 220,
  height = 140,
}: Props) {
  const bounds        = useMemo(() => normalizeBounds(units), [units]);
  const clubColorMap  = useMemo(() => buildClubColorMap(units), [units]);

  return (
    <div className="rounded-lg border border-white/10 bg-black/65 p-3 text-white backdrop-blur">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">
        Minimap
      </div>

      <div
        className="relative overflow-hidden rounded border border-white/10 bg-[#02040a]"
        style={{ width, height }}
      >
        {/* Grille légère */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
        />

        {/* Danger zones — AOE/meteor/blackhole en cours de vol ou au sol */}
        {dangerZones.map((zone, i) => {
          const zx = scalePoint(zone.x, bounds.minX, bounds.maxX, width);
          const zy = scalePoint(zone.y, bounds.minY, bounds.maxY, height);
          // Normalise le rayon en px selon le ratio de la zone vs l'espace géo total
          const rangeW = bounds.maxX - bounds.minX || 1;
          const px = (zone.radius / rangeW) * width;
          const color =
            zone.kind === "blackhole" ? "rgba(139,92,246,0.35)" :
            zone.kind === "projectile" ? "rgba(34,211,238,0.25)" :
            "rgba(251,146,60,0.30)"; // aoe default
          const border =
            zone.kind === "blackhole" ? "1px solid rgba(139,92,246,0.7)" :
            zone.kind === "projectile" ? "1px solid rgba(34,211,238,0.5)" :
            "1px solid rgba(251,146,60,0.65)";
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: zx, top: zy,
                width: px * 2, height: px * 2,
                transform: "translate(-50%, -50%)",
                background: color,
                border,
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
          );
        })}

        {/* Unités */}
        {units.map((unit) => {
          const x   = scalePoint(unit.x, bounds.minX, bounds.maxX, width);
          const y   = scalePoint(unit.y, bounds.minY, bounds.maxY, height);
          const col = clubColorMap.get(unit.clubId ?? "unknown") ?? "rgba(255,255,255,0.7)";
          return (
            <div
              key={unit.id}
              className="absolute rounded-full"
              style={{
                left: x, top: y,
                width: 6, height: 6,
                transform: "translate(-50%, -50%)",
                background: col,
                boxShadow: "0 0 6px rgba(255,255,255,0.15)",
              }}
            />
          );
        })}

        {/* Focus point caméra spectateur */}
        {focusPoint && (
          <div
            className="absolute rounded-full border-2 border-yellow-300"
            style={{
              left:   scalePoint(focusPoint.x, bounds.minX, bounds.maxX, width),
              top:    scalePoint(focusPoint.y, bounds.minY, bounds.maxY, height),
              width: 18, height: 18,
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 12px rgba(253,224,71,0.35)",
            }}
          />
        )}
      </div>

      {/* Légende couleurs équipes */}
      <div className="mt-2 flex gap-3 text-[10px] text-white/50">
        {[...clubColorMap.entries()].map(([clubId, color], i) => (
          <span key={clubId} className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: color }} />
            {i === 0 ? "Team A" : i === 1 ? "Team B" : `Team ${i + 1}`}
          </span>
        ))}
      </div>
    </div>
  );
}
