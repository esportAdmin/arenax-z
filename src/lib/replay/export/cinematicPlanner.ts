/**
 * cinematicPlanner.ts
 * ─────────────────────────────────────────────────────────────────────
 * Transforme une liste de HighlightClip en CinematicClipPlan.
 * Module pur — aucune dépendance IO, testable unitairement.
 *
 * Décide pour chaque clip :
 *   - transition entrée / sortie
 *   - fenêtre slow-motion (tag-dépendant)
 *   - traitement audio
 *   - titre overlay broadcast
 *   - accentuation visuelle
 * ─────────────────────────────────────────────────────────────────────
 */

import type { HighlightClip } from "@/lib/replay/highlightReel";

// ─────────────────────────────────────────────
// TYPES EXPORTÉS
// ─────────────────────────────────────────────

export type TransitionType  = "cut" | "fade" | "dip_black";
export type AudioTreatment  = "normal" | "duck_ambience" | "impact_boost";
export type PlaybackCurve   = "linear" | "ease_out";
export type OverlayAccent   = "neutral" | "accent" | "danger" | "success";

export interface SlowMotionWindow {
  /** Offset de début du ralenti dans le replay (ms) */
  startOffsetMs: number;
  /** Offset de fin du ralenti (ms) */
  endOffsetMs:   number;
  /** Vitesse de lecture : 0.3 = 30% speed */
  playbackRate:  number;
}

export interface CinematicClipPlan {
  clip:           HighlightClip;
  transitionIn:   TransitionType;
  transitionOut:  TransitionType;
  playbackRate:   number;
  playbackCurve:  PlaybackCurve;
  /** Null si le tag ne mérite pas de ralenti */
  slowMotion:     SlowMotionWindow | null;
  audio:          AudioTreatment;
  overlayTitle:   string;
  overlayAccent:  OverlayAccent;
}

// ─────────────────────────────────────────────
// TAGS QUI MÉRITENT UN RALENTI
// ─────────────────────────────────────────────

const SLOW_MOTION_TAGS = new Set([
  "ace", "teamwipe", "clutch", "triple_kill", "ultimate",
]);

/** Playback rate par tag — les rares moments méritent plus de slo-mo */
const SLOW_MOTION_RATE: Record<string, number> = {
  ace:         0.30,
  teamwipe:    0.30,
  clutch:      0.40,
  triple_kill: 0.45,
  ultimate:    0.50,
};

/** Durée du pre-roll ralenti avant le focus point (ms) */
const SLOW_PRE_MS  = 1_200;
/** Durée du post-roll ralenti après le focus point (ms) */
const SLOW_POST_MS = 1_600;

// ─────────────────────────────────────────────
// HELPERS PRIVÉS
// ─────────────────────────────────────────────

function titleFromTag(tag: string, label: string): string {
  const t = tag.toLowerCase();
  const MAP: Record<string, string> = {
    ace:         "ACE MOMENT",
    teamwipe:    "TEAM WIPE",
    clutch:      "CLUTCH PLAY",
    triple_kill: "TRIPLE KILL",
    double_kill: "DOUBLE KILL",
    multi_kill:  "MULTI KILL",
    ultimate:    "ULTIMATE IMPACT",
    kill:        "KILL",
  };
  return MAP[t] ?? label.toUpperCase();
}

function accentFromTag(tag: string): OverlayAccent {
  const t = tag.toLowerCase();
  if (t === "ace" || t === "teamwipe")                return "danger";
  if (t === "clutch")                                  return "accent";
  if (["kill", "double_kill", "triple_kill", "multi_kill"].includes(t)) return "success";
  return "neutral";
}

function buildSlowMotion(clip: HighlightClip): SlowMotionWindow | null {
  const tag = clip.tag.toLowerCase();
  if (!SLOW_MOTION_TAGS.has(tag)) return null;

  const rate  = SLOW_MOTION_RATE[tag] ?? 0.45;
  const start = Math.max(clip.startOffsetMs, clip.focusOffsetMs - SLOW_PRE_MS);
  const end   = Math.min(clip.endOffsetMs,   clip.focusOffsetMs + SLOW_POST_MS);

  // Sécurité : la fenêtre doit être cohérente
  if (end <= start) return null;

  return { startOffsetMs: start, endOffsetMs: end, playbackRate: rate };
}

// ─────────────────────────────────────────────
// API PUBLIQUE
// ─────────────────────────────────────────────

/**
 * Construit le plan cinématique complet du reel.
 *
 * Règles de transition :
 *   - Premier clip     → fade in (plus doux qu'un cut brutal)
 *   - Dernier clip     → fade out si pas de slow-mo, dip_black si slow-mo
 *   - Clips intermédiaires → cut (rythme)
 *   - Post slow-motion  → dip_black (impact maximal)
 */
export function buildCinematicPlan(clips: HighlightClip[]): CinematicClipPlan[] {
  return clips.map((clip, i) => {
    const isFirst     = i === 0;
    const isLast      = i === clips.length - 1;
    const slowMotion  = buildSlowMotion(clip);
    const tag         = clip.tag.toLowerCase();

    const transitionIn:  TransitionType = isFirst    ? "fade"      : "cut";
    const transitionOut: TransitionType = slowMotion  ? "dip_black"
      : isLast                                        ? "fade"
      : "cut";

    const audio: AudioTreatment = slowMotion
      ? "impact_boost"
      : tag === "kill" ? "duck_ambience"
      : "normal";

    return {
      clip,
      transitionIn,
      transitionOut,
      playbackRate:  1,
      playbackCurve: "ease_out",
      slowMotion,
      audio,
      overlayTitle:  titleFromTag(clip.tag, clip.label),
      overlayAccent: accentFromTag(clip.tag),
    };
  });
}
