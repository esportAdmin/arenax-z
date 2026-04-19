"use client";

import { useMemo } from "react";

// ============================================================
// TYPES
// ============================================================

interface SpectatorEvent {
  event_id?: string;
  ability?: string;
  damage?: number;
  crit?: boolean;
  type?: string;
  isKill?: boolean;
  killStreak?: number;
  highlight?: "clutch" | "ace" | "teamwipe" | "ultimate";
  replayTag?: string;
  esport?: {
    tag?: string | null;
    type?: string | null;
    teamFocus?: string | null;
    formation?: string | null;
  };
}

interface Props {
  events: SpectatorEvent[];
  maxEvents?: number;
  focusLabel?: string | null;
  slowMo?: boolean;
  freezeFrame?: boolean;
  teamFight?: boolean;
}

// ============================================================
// CONFIG
// ============================================================

const REPLAY_TAG_LABEL: Record<string, string> = {
  ULT_BLACKHOLE:  "⚫ Blackhole",
  ULT_METEOR:     "☄️ Meteor",
  ULT_DASH_AOE:   "⚡ Dash AOE",
  ACTIVE_BLINK:   "💨 Blink",
  ACTIVE_SHIELD:  "🛡️ Shield",
  ACTIVE_CLEANSE: "✨ Cleanse",
  TEAM_FOCUS:     "🎯 Focus call",
  TEAM_REGROUP:   "🔄 Regroup",
  CAST_INTERRUPT: "✗ Interrupted",
  MELEE_HIT:      "⚔️ Melee hit",
  RANGED_SHOT:    "🏹 Ranged shot",
  CAST_START:     "⚡ Casting",
};

const REPLAY_TAG_COLOR: Record<string, string> = {
  ULT_BLACKHOLE:  "#8b5cf6",
  ULT_METEOR:     "#f97316",
  ULT_DASH_AOE:   "#ef4444",
  ACTIVE_BLINK:   "#06b6d4",
  ACTIVE_SHIELD:  "#60a5fa",
  ACTIVE_CLEANSE: "#a78bfa",
  TEAM_FOCUS:     "#34d399",
  TEAM_REGROUP:   "#f59e0b",
  CAST_INTERRUPT: "#ef4444",
};

// ============================================================
// HELPERS
// ============================================================

function getEventScore(event: SpectatorEvent): number {
  let score = Number(event.damage ?? 0);
  if (event.type === "ultimate")            score += 30;
  if (event.isKill)                         score += 50;
  if (event.highlight === "ace")            score += 80;
  if (event.highlight === "teamwipe")       score += 70;
  if (event.highlight === "clutch")         score += 45;
  if (event.killStreak && event.killStreak >= 2) score += event.killStreak * 15;
  if (event.crit)                           score += 10;
  return score;
}

function getHighlightLabel(event: SpectatorEvent): string | null {
  if (event.highlight === "ace")      return "🏆 ACE";
  if (event.highlight === "teamwipe") return "💥 TEAMWIPE";
  if (event.highlight === "clutch")   return "⚡ CLUTCH";
  if (event.highlight === "ultimate") return "✨ ULT";
  if (event.isKill)                   return "💀 KILL";
  if (event.killStreak && event.killStreak >= 2) return `🔥 x${event.killStreak}`;
  return null;
}

// ============================================================
// COMPONENT
// ============================================================

/**
 * SpectatorOverlay — feed live des events les plus significatifs.
 *
 * Affiche jusqu'à `maxEvents` événements triés par score esport.
 * Reçoit les états camera (slowMo, freezeFrame, teamFight) depuis
 * useSpectatorCamera pour les badges d'état.
 *
 * Path : @/components/rts/SpectatorOverlay
 */
export default function SpectatorOverlay({
  events,
  maxEvents = 4,
  focusLabel = null,
  slowMo = false,
  freezeFrame = false,
  teamFight = false,
}: Props) {
  const featured = useMemo(
    () => [...events].sort((a, b) => getEventScore(b) - getEventScore(a)).slice(0, maxEvents),
    [events, maxEvents],
  );

  if (!featured.length && !focusLabel && !teamFight) return null;

  return (
    <div className="absolute bottom-4 left-4 z-50 w-[320px] rounded-lg border border-white/10 bg-black/65 p-3 text-white backdrop-blur">
      {/* Keyframe fadeIn inline — évite la dépendance à tailwind.config */}
      <style>{`
        @keyframes spectator-fade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
          Spectator Feed
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide">
          {teamFight && (
            <span className="rounded bg-red-500/20 px-2 py-1 text-red-300">Team Fight</span>
          )}
          {slowMo && (
            <span className="rounded bg-yellow-500/20 px-2 py-1 text-yellow-300">Slow Mo</span>
          )}
          {freezeFrame && (
            <span className="rounded bg-white/15 px-2 py-1 text-white">Freeze</span>
          )}
        </div>
      </div>

      {/* Focus label */}
      {focusLabel && (
        <div className="mb-3 rounded bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200">
          Focus: {focusLabel}
        </div>
      )}

      {/* Event list */}
      <div className="space-y-2">
        {featured.map((event, index) => {
          const label =
            (event.replayTag && REPLAY_TAG_LABEL[event.replayTag]) ||
            event.ability ||
            event.type ||
            "event";
          const tagColor = (event.replayTag && REPLAY_TAG_COLOR[event.replayTag]) || "#94a3b8";
          const highlightLabel = getHighlightLabel(event);

          // Animation fadeIn via transition opacity (compatible sans tailwind.config custom)
          // Ring rouge si kill pour effet broadcast
          const isKillEvent = event.isKill || event.highlight === "ace" || event.highlight === "teamwipe";

          return (
            <div
              key={event.event_id ?? `${index}-${label}`}
              className="rounded bg-white/5 p-2 transition-all duration-200"
              style={{
                borderLeft: `3px solid ${tagColor}`,
                // Ring kill : outline rouge semi-transparent
                outline: isKillEvent ? "1px solid rgba(248,113,113,0.5)" : "none",
                // Fade-in via opacity + translateY depuis style inline (pas besoin de keyframe)
                animation: "spectator-fade 0.25s ease-out",
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold">
                  {event.type === "ultimate"
                    ? "Ultimate"
                    : event.type === "team_call"
                      ? "Team Call"
                      : (event.type ?? "Event")}
                </div>
                {highlightLabel && (
                  <div className="text-[10px] font-bold text-yellow-300">{highlightLabel}</div>
                )}
              </div>

              <div className="mt-1 text-sm">
                {label}
                {event.damage ? ` • ${event.damage} dmg` : ""}
                {event.crit ? " • CRIT" : ""}
              </div>

              <div className="mt-1 text-[11px] text-white/60">
                {event.esport?.tag ?? "standard"}
                {event.esport?.formation  ? ` • ${event.esport.formation}`  : ""}
                {event.esport?.teamFocus  ? " • team focus" : ""}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
