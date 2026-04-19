"use client";

import { useEffect, useMemo, useState } from "react";

// ============================================================
// TYPES
// ============================================================

interface CastEvent {
  type: "cast_start" | "cast_interrupt";
  attackerId: string;
  defenderId?: string;
  /** Nom de l'ability en cours de cast (ex: "precision_shot"). */
  ability?: string;
  /** skillType de l'attaquant — utilisé pour dériver castTimeMs côté front. */
  skill?: string;
}

interface Props {
  units: Array<{ unit_id: string; x: number; y: number }>;
  events: CastEvent[];
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Durée de cast par skillType — miroir de getCastTimeMs() dans combatEngine.ts.
 * Mis à jour ici si les valeurs changent côté moteur.
 */
function castTimeMsFromSkill(skill?: string): number {
  switch (skill) {
    case "sniper":  return 260;
    case "mage":    return 520;
    case "storm":   return 420;
    case "berserk": return 120;
    default:        return 400; // fallback raisonnable
  }
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ============================================================
// RUNTIME STATE
// ============================================================

interface RuntimeCast {
  attackerId: string;
  defenderId?: string;
  skill?: string;
  castTimeMs: number;
  startedAt: number;
}

interface RuntimeInterrupt {
  attackerId: string;
  startedAt: number;
}

// ============================================================
// SOUS-COMPOSANT — Barre de cast + cercle + ligne de ciblage
// ============================================================

function CastBar({
  cast,
  pos,
  targetPos,
  progress,
}: {
  cast: RuntimeCast;
  pos: { x: number; y: number };
  targetPos: { x: number; y: number } | null;
  progress: number; // [0, 1]
}) {
  const ringOpacity = 0.55 + Math.sin(Date.now() / 200) * 0.15;

  return (
    <>
      {/* ── Anneau de cast (pulse CSS natif) ── */}
      <div
        className="pointer-events-none absolute rounded-full border border-cyan-400"
        style={{
          left:   pos.x,
          top:    pos.y,
          width:  42,
          height: 42,
          transform: "translate(-50%, -50%)",
          opacity:   clamp(ringOpacity, 0.4, 0.75),
          boxShadow: "0 0 10px rgba(34,211,238,0.45)",
          animation: "castRingPulse 0.8s ease-in-out infinite",
        }}
      />

      {/* ── Barre de progression (width calculé via progress, pas de keyframe CSS) ── */}
      <div
        className="pointer-events-none absolute overflow-hidden rounded-full"
        style={{
          left:      pos.x,
          top:       pos.y + 22,
          transform: "translateX(-50%)",
          width:     40,
          height:    3,
          background: "rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            height:     "100%",
            width:      `${Math.round(progress * 100)}%`,
            background: "rgba(34,211,238,0.9)",
            transition: "width 0.033s linear",
          }}
        />
      </div>

      {/* ── Ligne de ciblage vers le défenseur ── */}
      {targetPos && (() => {
        const dx  = targetPos.x - pos.x;
        const dy  = targetPos.y - pos.y;
        const len = Math.hypot(dx, dy);
        const deg = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <div
            className="pointer-events-none absolute"
            style={{
              left:            pos.x,
              top:             pos.y,
              width:           len,
              height:          2,
              transform:       `rotate(${deg}deg)`,
              transformOrigin: "0 50%",
              background:
                "linear-gradient(90deg, rgba(34,211,238,0.7) 0%, rgba(34,211,238,0.1) 100%)",
            }}
          />
        );
      })()}

      {/* ── Zone danger AoE pré-impact ──
          Affichée sur la cible pendant le cast pour indiquer la zone d'impact.
          Mage (orbe explosif) : anneau orange, rayon 60px.
          Storm (chain lightning) : anneau violet, rayon 48px (zone de chain).
          Progress s'intensifie à l'approche de l'impact — signal d'urgence joueur. */}
      {targetPos && (cast.skill === "mage" || cast.skill === "storm") && (() => {
        const isMage  = cast.skill === "mage";
        const color   = isMage ? "rgba(251,146,60," : "rgba(217,70,239,";
        const radius  = isMage ? 60 : 48;
        const opacity = 0.25 + progress * 0.45;
        return (
          <div
            className="pointer-events-none absolute rounded-full border-2"
            style={{
              left:      targetPos.x,
              top:       targetPos.y,
              width:     radius,
              height:    radius,
              transform: "translate(-50%, -50%)",
              opacity,
              borderColor: `${color}0.9)`,
              background:  `radial-gradient(circle, ${color}0.08) 0%, ${color}0.03) 60%, transparent 100%)`,
              boxShadow:   `0 0 ${8 + progress * 12}px ${color}0.3)`,
            }}
          />
        );
      })()}
    </>
  );
}

// ============================================================
// SOUS-COMPOSANT — Feedback interrupt
// ============================================================

function InterruptFx({
  pos,
  progress, // [0, 1] sur 600ms — piloté par le ticker
}: {
  pos: { x: number; y: number };
  progress: number;
}) {
  const opacity = 1 - progress;
  const scale   = 1 + progress * 0.4;
  const dy      = -progress * 18; // monte légèrement

  return (
    <div
      className="pointer-events-none absolute select-none"
      style={{
        left:      pos.x,
        top:       pos.y + dy,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        color:     "#f87171",
        fontSize:  "10px",
        fontWeight: 700,
        letterSpacing: "0.04em",
        textShadow:    "0 0 8px rgba(248,113,113,0.8)",
        whiteSpace:    "nowrap",
        zIndex:        70,
      }}
    >
      INTERRUPT
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/**
 * CastEffectLayer
 *
 * Affiche les FX de cast en overlay sur la carte :
 * - Anneau pulsant + barre de progression (progress piloté par le ticker 33ms)
 * - Ligne de ciblage vers le défenseur
 * - Feedback "INTERRUPT" one-shot (600ms, monte et fade)
 *
 * Architecture :
 * - RuntimeCast : Map<attackerId> avec startedAt + castTimeMs
 * - Ticker 33ms : avance le clock, purge les casts expirés (TTL = castTimeMs + 300ms)
 * - Pas de keyframe CSS pour la barre — width% calculé depuis progress
 *   (évite les resets au re-render)
 * - Keys stables sur attackerId (pas index)
 *
 * Path : @/components/rts/CastEffectLayer
 */
export default function CastEffectLayer({ units, events }: Props) {
  const [activeCasts, setActiveCasts]       = useState<Map<string, RuntimeCast>>(new Map());
  const [interrupts, setInterrupts]         = useState<Map<string, RuntimeInterrupt>>(new Map());
  const [clock, setClock]                   = useState<number>(Date.now());

  // ── Indexation O(1) des positions d'unités ──
  const unitMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    units.forEach((u) => map.set(u.unit_id, { x: u.x, y: u.y }));
    return map;
  }, [units]);

  // ── Ingestion des events (cast_start / cast_interrupt) ──
  // Un seul useEffect, deux passes distinctes pour éviter le double setState imbriqué
  // qui causait un glitch React (setActiveCasts appelé depuis setInterrupts).
  useEffect(() => {
    if (!events?.length) return;
    const now = Date.now();

    // Passe 1 : traite les cast_start et les cast_interrupt sur activeCasts ensemble.
    // Pas de !next.has() sur cast_start — un recast rapide repart proprement depuis 0.
    setActiveCasts((prev) => {
      const next = new Map(prev);
      events.forEach((e) => {
        if (e.type === "cast_start") {
          next.set(e.attackerId, {
            attackerId: e.attackerId,
            defenderId: e.defenderId,
            skill:      e.skill,
            // castTimeMs : valeur backend si présente, fallback front sinon.
            // Évite la désync si le moteur change ses valeurs.
            castTimeMs: (e as any).castTimeMs ?? castTimeMsFromSkill(e.skill),
            startedAt:  now,
          });
        }
        if (e.type === "cast_interrupt") {
          // Supprimé ici (même setState) — plus de double setState imbriqué
          next.delete(e.attackerId);
        }
      });
      return next;
    });

    // Passe 2 : enregistre les interrupts pour l'affichage du FX one-shot
    setInterrupts((prev) => {
      const next = new Map(prev);
      events.forEach((e) => {
        if (e.type === "cast_interrupt") {
          next.set(e.attackerId, { attackerId: e.attackerId, startedAt: now });
        }
      });
      return next;
    });
  }, [events]);

  // ── Ticker 33ms — clock + purge TTL ──
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      setClock(now);

      // Purge casts expirés (TTL = castTimeMs + 300ms de grâce)
      setActiveCasts((prev) => {
        let changed = false;
        const next  = new Map(prev);
        prev.forEach((cast, id) => {
          if (now - cast.startedAt > cast.castTimeMs + 300) {
            next.delete(id);
            changed = true;
          }
        });
        return changed ? next : prev;
      });

      // Purge interrupts expirés (TTL = 600ms)
      setInterrupts((prev) => {
        let changed = false;
        const next  = new Map(prev);
        prev.forEach((interrupt, id) => {
          if (now - interrupt.startedAt > 600) {
            next.delete(id);
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 33);

    return () => window.clearInterval(interval);
  }, []);

  if (!activeCasts.size && !interrupts.size) return null;

  return (
    <>
      {/* ── Casts actifs ── */}
      {[...activeCasts.values()].map((cast) => {
        const pos = unitMap.get(cast.attackerId);
        if (!pos) return null;

        const elapsed  = clock - cast.startedAt;
        const progress = clamp(elapsed / cast.castTimeMs, 0, 1);
        const targetPos = cast.defenderId ? (unitMap.get(cast.defenderId) ?? null) : null;

        return (
          <CastBar
            key={`cast-${cast.attackerId}`}
            cast={cast}
            pos={pos}
            targetPos={targetPos}
            progress={progress}
          />
        );
      })}

      {/* ── Interrupts one-shot ── */}
      {[...interrupts.values()].map((interrupt) => {
        const pos = unitMap.get(interrupt.attackerId);
        if (!pos) return null;

        const elapsed  = clock - interrupt.startedAt;
        const progress = clamp(elapsed / 600, 0, 1);

        return (
          <InterruptFx
            key={`interrupt-${interrupt.attackerId}`}
            pos={pos}
            progress={progress}
          />
        );
      })}

      {/* ── Keyframe CSS pour l'anneau pulsant ── */}
      <style>{`
        @keyframes castRingPulse {
          0%   { box-shadow: 0 0 6px rgba(34,211,238,0.4); opacity: 0.45; }
          50%  { box-shadow: 0 0 14px rgba(34,211,238,0.7); opacity: 0.7; }
          100% { box-shadow: 0 0 6px rgba(34,211,238,0.4); opacity: 0.45; }
        }
      `}</style>
    </>
  );
}
