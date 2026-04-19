"use client";

// ============================================================
// TYPES
// ============================================================

interface Props {
  headline: string;
  subheadline?: string;
  povLabel?: string;
  round?: number;
  /** Kills du round courant — alimente le calcul d'intensité */
  kills?: number;
  /** Ultimates du round courant */
  ultimates?: number;
  /** Momentum accumulé depuis useSpectatorCamera (0–300) */
  momentum?: number;
}

// ============================================================
// HELPERS
// ============================================================

/**
 * Calcule le tier d'intensité du round pour l'affichage caster.
 *
 * CRITICAL  : kills >= 2 OU momentum >= 200 OU (kill + ult simultanés)
 * HIGH      : kill OU ultimate OU momentum >= 100
 * MEDIUM    : momentum >= 40
 * LOW       : rien de notable
 */
function getIntensityTier(kills = 0, ultimates = 0, momentum = 0): {
  label: string;
  color: string;
  emoji: string;
} {
  if (kills >= 2 || momentum >= 200 || (kills >= 1 && ultimates >= 1)) {
    return { label: "CRITICAL", color: "#ef4444", emoji: "💀" };
  }
  if (kills >= 1 || ultimates >= 1 || momentum >= 100) {
    return { label: "HIGH",     color: "#f97316", emoji: "🔥" };
  }
  if (momentum >= 40) {
    return { label: "MEDIUM",   color: "#facc15", emoji: "⚡" };
  }
  return   { label: "LOW",      color: "#6b7280", emoji: "🎯" };
}

// ============================================================
// COMPONENT
// ============================================================

/**
 * BroadcastCasterDesk — commentaire live du round.
 *
 * Affiche headline, subheadline, POV, round ET un indicateur
 * d'intensité dynamique (LOW → MEDIUM → HIGH → CRITICAL)
 * calculé depuis kills, ultimates et momentum.
 *
 * Path : @/components/rts/BroadcastCasterDesk
 */
export default function BroadcastCasterDesk({
  headline,
  subheadline = "",
  povLabel    = "Auto",
  round,
  kills       = 0,
  ultimates   = 0,
  momentum    = 0,
}: Props) {
  const intensity = getIntensityTier(kills, ultimates, momentum);

  return (
    <div className="rounded-lg border border-white/10 bg-black/65 p-3 text-white backdrop-blur">
      {/* Header row : Caster Desk + intensity badge */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
          Caster Desk
        </div>
        <div
          className="flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold"
          style={{ background: `${intensity.color}22`, color: intensity.color, border: `1px solid ${intensity.color}44` }}
        >
          <span>{intensity.emoji}</span>
          <span>{intensity.label}</span>
        </div>
      </div>

      <div className="mt-2 text-lg font-bold leading-tight">{headline}</div>

      {subheadline && (
        <div className="mt-1 text-sm text-white/70">{subheadline}</div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/70">
        <span className="rounded bg-white/10 px-2 py-1">POV {povLabel}</span>
        {typeof round === "number" && (
          <span className="rounded bg-white/10 px-2 py-1">Round {round}</span>
        )}
        {/* Momentum bar */}
        {momentum > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-white/40">Momentum</span>
            <div className="h-1.5 w-16 overflow-hidden rounded bg-white/10">
              <div
                className="h-full transition-all"
                style={{
                  width: `${Math.min(100, (momentum / 300) * 100)}%`,
                  background: intensity.color,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
