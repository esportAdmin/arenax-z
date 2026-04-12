"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Pause, Play, SkipBack, SkipForward } from "lucide-react";

import {
  useSpectatorCamera,
  type SpectatorReplayEvent,
  type SpectatorUnitPosition,
} from "@/hooks/useSpectatorCamera";
import { useAudio } from "@/hooks/useAudio";

import BroadcastScoreboard  from "@/components/rts/BroadcastScoreboard";
import BroadcastMiniMap     from "@/components/rts/BroadcastMiniMap";
import BroadcastCasterDesk  from "@/components/rts/BroadcastCasterDesk";
import MatchSummary         from "@/components/rts/MatchSummary";

import { buildReplayMontage, getMontageLabel } from "@/lib/esport/replayMontage";

// ============================================================
// TYPES
// ============================================================

interface ReplayEvent extends SpectatorReplayEvent {
  skill?: string;
  result?: "hit" | "miss" | "blocked";
  rangeType?: "melee" | "ranged";
  damageKind?: "physical" | "magic" | "true";
  impactStyle?: "impact" | "explosion" | "chain" | "blackhole";
  targetPriority?: string;
  note?: string;
  formationType?: string;
  teamFocusTargetId?: string | null;
}

interface ReplayRoundMeta {
  totalDamage: number;
  kills: number;
  ultimates: number;
  teamCalls: number;
  crits: number;
  formations: string[];
  teamFocusIds: string[];
  isHighlight: boolean;
}

interface ReplayRound {
  round: number;
  serverTs: string;
  events: ReplayEvent[];
  units?: SpectatorUnitPosition[];
  meta?: ReplayRoundMeta;
}

interface Props {
  territoryId: string;
  onClose?: () => void;
  mapWidth?: number;
  mapHeight?: number;
}

type PovMode = "auto" | "red" | "blue";

// ============================================================
// CONFIG
// ============================================================

const EVENT_COLOR: Record<string, string> = {
  attack:         "#22d3ee",
  cast_start:     "#a78bfa",
  cast_interrupt: "#ef4444",
  ultimate:       "#facc15",
  team_call:      "#34d399",
};

const RESULT_BADGE: Record<string, { label: string; color: string }> = {
  hit:     { label: "HIT",  color: "#22c55e" },
  miss:    { label: "MISS", color: "#6b7280" },
  blocked: { label: "BLK",  color: "#f59e0b" },
};

const KIND_ICON: Record<string, string> = {
  physical: "⚔️",
  magic:    "✨",
  true:     "💀",
};

const REPLAY_TAG_COLOR: Record<string, string> = {
  ULT_BLACKHOLE:  "#8b5cf6",
  ULT_METEOR:     "#f97316",
  ULT_DASH_AOE:   "#ef4444",
  ACTIVE_BLINK:   "#06b6d4",
  TEAM_FOCUS:     "#34d399",
  TEAM_REGROUP:   "#f59e0b",
  CAST_INTERRUPT: "#ef4444",
};

// ============================================================
// HELPERS
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getRoundHeadline(round: ReplayRound | null): string {
  if (!round) return "No round selected";
  const m = round.meta;
  if (!m) return `Round ${round.round}`;
  if (m.kills > 0)       return `Round ${round.round} • ${m.kills} kill${m.kills > 1 ? "s" : ""}`;
  if (m.ultimates > 0)   return `Round ${round.round} • ${m.ultimates} ultimate${m.ultimates > 1 ? "s" : ""}`;
  if (m.teamCalls > 0)   return `Round ${round.round} • team coordination`;
  if (m.totalDamage > 0) return `Round ${round.round} • ${m.totalDamage} damage`;
  return `Round ${round.round}`;
}

function getRoundSubheadline(round: ReplayRound | null): string {
  if (!round?.meta) return "";
  const m = round.meta;
  if (m.isHighlight)   return "Highlight round";
  if (m.ultimates > 0) return "Ultimate power spike";
  if (m.kills > 0)     return "Fight resolution";
  if (m.teamCalls > 0) return "Macro coordination";
  return "Standard round";
}

function eventPriority(event: ReplayEvent): number {
  let score = Number(event.damage ?? 0);
  if (event.type === "ultimate")       score += 30;
  if (event.isKill)                    score += 50;
  if (event.highlight === "ace")       score += 80;
  if (event.highlight === "teamwipe")  score += 70;
  if (event.highlight === "clutch")    score += 45;
  if (event.crit)                      score += 10;
  return score;
}

// ============================================================
// DATA LOADER
// ============================================================

function useReplayData(territoryId: string) {
  const [rounds, setRounds]   = useState<ReplayRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!territoryId) return;
    setLoading(true);
    setError(null);

    try {
      const res  = await fetch("/api/battles/replay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ territoryId, limit: 500 }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.message ?? "Replay loading failed");
        setLoading(false);
        return;
      }

      setRounds(
        Array.isArray(data.frames)
          ? data.frames.map((frame: any) => ({
              round:    Number(frame.round ?? 0),
              serverTs: String(frame.serverTs ?? ""),
              events:   Array.isArray(frame.events) ? frame.events : [],
              units:    Array.isArray(frame.units)  ? frame.units  : undefined,
              meta:     frame.meta,
            }))
          : [],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Replay loading failed");
    } finally {
      setLoading(false);
    }
  }, [territoryId]);

  useEffect(() => { load(); }, [load]);

  return { rounds, loading, error, reload: load };
}

// ============================================================
// SUBCOMPONENTS
// ============================================================

function EventRow({ event, isHighlighted }: { event: ReplayEvent; isHighlighted?: boolean }) {
  const typeColor = EVENT_COLOR[event.type ?? "attack"] ?? "#22d3ee";
  const badge     = event.result ? RESULT_BADGE[event.result] : null;
  const kindIcon  = KIND_ICON[event.damageKind ?? "physical"] ?? "";
  const isUlt     = event.type === "ultimate";
  const isCast    = event.type === "cast_start" || event.type === "cast_interrupt";
  const tagColor  = event.replayTag ? REPLAY_TAG_COLOR[event.replayTag] : null;

  return (
    <div
      className="flex items-center gap-2 rounded px-2 py-1 text-xs"
      style={{
        borderLeft: `2px solid ${typeColor}`,
        background: isHighlighted ? "rgba(250,204,21,0.06)" : undefined,
      }}
    >
      <span
        className="w-16 shrink-0 rounded px-1 py-0.5 text-center font-mono font-semibold"
        style={{ background: `${typeColor}22`, color: typeColor }}
      >
        {event.type ?? "attack"}
      </span>

      <span className="min-w-0 flex-1 truncate">
        {kindIcon} {event.ability ?? event.skill ?? "attack"}
        {event.damage  ? ` • ${event.damage}` : ""}
        {event.crit    ? " • CRIT"  : ""}
        {event.isKill  ? " • KILL"  : ""}
      </span>

      {event.highlight && (
        <span className="rounded bg-yellow-400/10 px-1.5 py-0.5 text-[10px] font-bold text-yellow-300">
          {event.highlight.toUpperCase()}
        </span>
      )}

      {badge && (
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-bold"
          style={{ background: `${badge.color}22`, color: badge.color }}
        >
          {badge.label}
        </span>
      )}

      {(isUlt || isCast || tagColor) && (
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-bold"
          style={{ background: `${tagColor ?? typeColor}22`, color: tagColor ?? typeColor }}
        >
          {event.replayTag ?? (isUlt ? "ULT" : "CAST")}
        </span>
      )}
    </div>
  );
}

function RoundSummary({
  round, active, onSelect,
}: { round: ReplayRound; active: boolean; onSelect: () => void }) {
  const m = round.meta;
  return (
    <button
      type="button" onClick={onSelect}
      className={`w-full rounded border px-3 py-2 text-left transition ${
        active ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Round {round.round}</span>
        <span className="text-xs text-white/50">
          {round.serverTs ? new Date(round.serverTs).toLocaleTimeString() : "--:--"}
        </span>
      </div>
      {m && (
        <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-white/70">
          <span>{m.totalDamage} dmg</span>
          <span>{m.kills} kills</span>
          <span>{m.ultimates} ult</span>
          <span>{m.teamCalls} calls</span>
          {m.isHighlight && <span className="font-semibold text-yellow-300">highlight</span>}
        </div>
      )}
    </button>
  );
}

// ============================================================
// COMPONENT — BROADCAST MODE
// ============================================================

/**
 * ReplayViewer — mode broadcast complet.
 *
 * Fonctionnalités :
 * - BroadcastCasterDesk : headline + subheadline narratif + POV label
 * - BroadcastScoreboard : stats par équipe (kills, damage, hp, ultimates)
 * - BroadcastMiniMap    : vue aérienne + focus caméra spectateur
 * - POV switch          : auto / team A / team B
 * - Cinematic timeline  : cliquable, markers kill (rouge) / ultimate (jaune)
 * - Canvas 3 layers     : MAP (unités+shake) / FX (floats stables) / UI (overlays)
 * - Audio               : useAudio branché (kill, ultimate, clutch heartbeat)
 * - Camera spectateur   : kill cam, slowMo, team fight, focus label
 *
 * Path : @/components/rts/ReplayViewer
 */
export default function ReplayViewer({
  territoryId,
  onClose,
  mapWidth  = 900,
  mapHeight = 540,
}: Props) {
  const { rounds, loading, error, reload } = useReplayData(territoryId);

  const [index,       setIndex]       = useState(0);
  const [playing,     setPlaying]     = useState(false);
  const [speed,       setSpeed]       = useState(1);
  const [spectator,   setSpectator]   = useState(true);
  const [povMode,     setPovMode]     = useState<PovMode>("auto");
  const [showSummary, setShowSummary] = useState(false);

  // ── Replay montage — top 10 best moments du match ──
  const montage = useMemo(() => buildReplayMontage(rounds), [rounds]);

  const currentRound = rounds[index] ?? null;

  const currentUnits = useMemo<SpectatorUnitPosition[]>(
    () => currentRound?.units ?? [],
    [currentRound],
  );

  const priorityEvents = useMemo(
    () => [...(currentRound?.events ?? [])].sort((a, b) => eventPriority(b) - eventPriority(a)),
    [currentRound],
  );

  // ── POV filter — détermine les clubs par index d'apparition ──
  const clubOrder = useMemo(() => {
    const seen: string[] = [];
    for (const u of currentUnits) {
      const id = u.clubId ?? "unknown";
      if (!seen.includes(id)) seen.push(id);
    }
    return seen; // [0] = team A (cyan), [1] = team B (red)
  }, [currentUnits]);

  const filteredUnits = useMemo(() => {
    if (povMode === "auto") return currentUnits;
    const targetClub = povMode === "blue" ? clubOrder[0] : clubOrder[1];
    if (!targetClub) return currentUnits;
    return currentUnits.filter((u) => (u.clubId ?? "unknown") === targetClub);
  }, [currentUnits, povMode, clubOrder]);

  // ── Spectator camera (suit filteredUnits pour le POV) ──
  const camera = useSpectatorCamera({
    units:   filteredUnits,
    events:  priorityEvents,
    enabled: spectator && filteredUnits.length > 0,
    width:   mapWidth,
    height:  mapHeight,
  });

  // ── Audio esport (synthèse Web Audio API) ──
  const { play, startClutch, stopClutch } = useAudio({ enabled: spectator, volume: 0.35 });

  useEffect(() => {
    if (!spectator) return;
    const hasKill     = priorityEvents.some((e) => e.isKill);
    const hasUltimate = priorityEvents.some((e) => e.type === "ultimate");
    const hasClutch   = priorityEvents.some((e) => e.highlight === "clutch");
    const top         = priorityEvents[0];

    if (hasKill) {
      const isAce      = top?.highlight === "ace" || top?.highlight === "teamwipe";
      const isMultiKill = (top?.killStreak ?? 0) >= 2;
      if (isAce)           play("ace");
      else if (isMultiKill) play("multi_kill");
      else                  play("kill");
    }
    if (hasUltimate) {
      const ult = priorityEvents.find((e) => e.type === "ultimate");
      if (ult?.ability === "meteor")     play("meteor");
      else if (ult?.ability === "blackhole") play("blackhole");
      else                               play("ultimate");
    }
    if (hasClutch) startClutch(); else stopClutch();
  }, [play, priorityEvents, spectator, startClutch, stopClutch]);

  // ── Autoplay ──
  useEffect(() => {
    if (!playing || rounds.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev >= rounds.length - 1 ? prev : prev + 1));
    }, Math.max(120, 650 / speed));
    return () => window.clearInterval(timer);
  }, [playing, rounds.length, speed]);

  // ── Loading / error / empty ──
  if (loading) return (
    <div className="rounded-xl border border-white/10 bg-[#050816] p-4 text-white">Loading replay...</div>
  );
  if (error) return (
    <div className="rounded-xl border border-red-400/20 bg-[#050816] p-4 text-white">
      <div className="font-semibold text-red-300">Replay error</div>
      <div className="mt-1 text-sm text-white/70">{error}</div>
      <button type="button" onClick={reload} className="mt-3 rounded bg-white/10 px-3 py-1 text-sm">Retry</button>
    </div>
  );
  if (!rounds.length) return (
    <div className="rounded-xl border border-white/10 bg-[#050816] p-4 text-white">No replay available.</div>
  );

  return (
    <div className="rounded-xl border border-white/10 bg-[#050816] p-3 text-white">

      {/* ── Header ── */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Replay Viewer — Broadcast Mode</div>
          <div className="text-xs text-white/60">{getRoundHeadline(currentRound)}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button" onClick={() => setSpectator((v) => !v)}
            className={`rounded px-3 py-1 text-xs ${spectator ? "bg-cyan-500 text-black" : "bg-white/10 text-white"}`}
          >
            {spectator
              ? <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4" />Spectator</span>
              : <span className="inline-flex items-center gap-2"><EyeOff className="h-4 w-4" />Static</span>}
          </button>

          {/* Bouton Highlights — saute au meilleur moment du match
              Fix D : navigation par round number (findIndex) pas par round - 1 */}
          <button
            type="button"
            disabled={!montage.length}
            onClick={() => {
              const best = montage[0];
              if (!best) return;
              const roundIdx = rounds.findIndex((r) => r.round === best.round);
              setIndex(Math.max(0, roundIdx));
              setShowSummary(false);
            }}
            title={montage[0] ? getMontageLabel(montage[0]) : "No highlights yet"}
            className="rounded bg-yellow-400 px-3 py-1 text-xs font-semibold text-black disabled:opacity-40"
          >
            🎬 Highlights
          </button>

          {/* Bouton Match Summary */}
          <button
            type="button"
            onClick={() => setShowSummary((v) => !v)}
            className={`rounded px-3 py-1 text-xs ${showSummary ? "bg-purple-500 text-white" : "bg-white/10 text-white"}`}
          >
            📊 Summary
          </button>

          {/* POV switch */}
          <select
            value={povMode}
            onChange={(e) => setPovMode(e.target.value as PovMode)}
            className="rounded bg-white/10 px-3 py-1 text-xs"
          >
            <option value="auto">POV Auto</option>
            <option value="blue">POV Team A</option>
            <option value="red">POV Team B</option>
          </select>

          {onClose && (
            <button type="button" onClick={onClose} className="rounded bg-white/10 px-3 py-1 text-xs">Close</button>
          )}
        </div>
      </div>

      {/* ── Caster desk ── */}
      <div className="mb-3">
        <BroadcastCasterDesk
          headline={getRoundHeadline(currentRound)}
          subheadline={getRoundSubheadline(currentRound)}
          povLabel={povMode === "auto" ? "AUTO" : povMode === "blue" ? "TEAM A" : "TEAM B"}
          round={currentRound?.round}
          kills={currentRound?.meta?.kills ?? 0}
          ultimates={currentRound?.meta?.ultimates ?? 0}
          momentum={camera.momentum}
        />
      </div>

      {/* ── Scoreboard + Minimap ── */}
      <div className="mb-3 grid gap-3 lg:grid-cols-[1fr_260px]">
        {/* currentUnits (toutes équipes) pour le scoreboard — pas filtrées par POV */}
        <BroadcastScoreboard units={currentUnits} events={priorityEvents} />
        <BroadcastMiniMap
          units={currentUnits.map((u) => ({ id: u.id, x: u.x, y: u.y, clubId: u.clubId }))}
          focusPoint={camera.focusPoint}
        />
      </div>

      {/* ── Cinematic timeline cliquable ── */}
      <div className="mb-3">
        <div
          className="relative flex h-5 w-full cursor-pointer overflow-hidden rounded bg-white/10"
          title="Click to jump to round"
        >
          {rounds.map((round, i) => {
            const hasKill = (round.meta?.kills ?? 0) >= 1;
            const hasUlt  = (round.meta?.ultimates ?? 0) >= 1;
            const isHL    = round.meta?.isHighlight ?? false;
            const isActive = i === index;
            return (
              <div
                key={i}
                onClick={() => setIndex(i)}
                title={`Round ${round.round}${hasKill ? " • Kill" : ""}${hasUlt ? " • Ult" : ""}`}
                className="relative h-full transition-opacity hover:opacity-90"
                style={{
                  width: `${100 / rounds.length}%`,
                  background: hasKill
                    ? "rgba(239,68,68,0.75)"
                    : hasUlt
                      ? "rgba(250,204,21,0.65)"
                      : isHL
                        ? "rgba(34,211,238,0.3)"
                        : "transparent",
                  outline: isActive ? "2px solid rgba(255,255,255,0.8)" : "none",
                  zIndex:  isActive ? 2 : 1,
                }}
              />
            );
          })}
          {/* Playhead */}
          <div
            className="pointer-events-none absolute top-0 h-full w-[2px] bg-white/90"
            style={{ left: `${rounds.length > 1 ? (index / (rounds.length - 1)) * 100 : 0}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-white/40">
          <span>R1</span>
          <span className="flex items-center gap-3">
            <span><span className="inline-block h-1.5 w-3 rounded-sm bg-red-400/75 mr-1" />Kill</span>
            <span><span className="inline-block h-1.5 w-3 rounded-sm bg-yellow-400/65 mr-1" />Ultimate</span>
          </span>
          <span>R{rounds.length}</span>
        </div>
      </div>

      {/* ── Main grid : round list + canvas ── */}
      <div className="grid gap-3 lg:grid-cols-[280px,1fr]">

        {/* Round list */}
        <div className="max-h-[620px] space-y-2 overflow-auto pr-1">
          {rounds.map((round, i) => (
            <RoundSummary key={round.round} round={round} active={i === index} onSelect={() => setIndex(i)} />
          ))}
        </div>

        <div>
          {/* Canvas */}
          <div
            className="relative overflow-hidden rounded-lg border border-white/10 bg-black"
            style={{ width: mapWidth, height: mapHeight }}
          >
            {filteredUnits.length > 0 ? (
              <>
                {/* ── MAP LAYER — unités + shake caméra ── */}
                <div
                  className="absolute inset-0"
                  style={{
                    transform: spectator
                      ? (() => {
                          // Shake UI-only (Math.random acceptable hors moteur)
                          const shakeX = camera.shakeIntensity > 0 ? (Math.random() - 0.5) * camera.shakeIntensity * 2 : 0;
                          const shakeY = camera.shakeIntensity > 0 ? (Math.random() - 0.5) * camera.shakeIntensity * 2 : 0;
                          return `translate(${camera.offsetX + shakeX}px, ${camera.offsetY + shakeY}px) scale(${camera.zoom})`;
                        })()
                      : "translate(0px, 0px) scale(1)",
                    transition: camera.freezeFrame ? "transform 0.05s linear"
                      : camera.slowMo ? "transform 0.2s ease-out"
                      : "transform 0.12s ease-out",
                    filter: camera.slowMo ? "brightness(1.08) saturate(0.9)" : "none",
                  }}
                >
                  {filteredUnits.map((unit) => (
                    <div
                      key={unit.id}
                      className="absolute"
                      style={{ left: unit.x, top: unit.y, transform: "translate(-50%, -50%)" }}
                    >
                      <div
                        className="rounded-full border"
                        style={{
                          width:       camera.focusUnitId === unit.id ? 18 : 12,
                          height:      camera.focusUnitId === unit.id ? 18 : 12,
                          borderColor: camera.focusUnitId === unit.id ? "#fde047" : "rgba(255,255,255,0.4)",
                          boxShadow:   camera.focusUnitId === unit.id ? "0 0 18px rgba(253,224,71,0.55)" : "none",
                          // Couleur par index de club (cohérent avec BroadcastMiniMap)
                          background: (unit.clubId ?? "unknown") === (clubOrder[1] ?? "__none__")
                            ? "rgba(239,68,68,0.9)"
                            : "rgba(34,211,238,0.9)",
                        }}
                      />
                      <div className="absolute left-1/2 top-[13px] h-[3px] w-10 -translate-x-1/2 overflow-hidden rounded bg-white/10">
                        <div className="h-full bg-green-400" style={{ width: `${clamp(Number(unit.hp ?? 0), 0, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── FX LAYER — damage floats avec aim point réel, sans shake ── */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    transform: spectator
                      ? `translate(${camera.offsetX}px, ${camera.offsetY}px) scale(${camera.zoom})`
                      : "translate(0px, 0px) scale(1)",
                    transition: "transform 0.12s ease-out",
                  }}
                >
                  {priorityEvents.slice(0, 6).map((event, i) => {
                    const def    = filteredUnits.find((u) => u.id === event.defenderId);
                    // Fix : aim point réel pour AOE/meteor/blackhole
                    const floatX = typeof event.projectileAimLng === "number" ? event.projectileAimLng : def?.x;
                    const floatY = typeof event.projectileAimLat === "number" ? event.projectileAimLat : def?.y;
                    if (floatX == null || floatY == null) return null;
                    return (
                      <div
                        key={event.event_id ?? `${i}-${event.ability}`}
                        className="pointer-events-none absolute text-xs font-bold"
                        style={{
                          left: floatX, top: floatY - 24 - i * 14,
                          transform: "translate(-50%, -50%)",
                          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                          color: event.type === "ultimate" ? "#facc15"
                            : event.isKill ? "#ef4444"
                            : event.crit   ? "#fde047" : "#ffffff",
                        }}
                      >
                        {event.type === "ultimate" ? `ULT ${event.ability}`
                          : event.isKill ? "KILL"
                          : event.damage ? `-${event.damage}`
                          : event.ability}
                      </div>
                    );
                  })}
                </div>

                {/* ── UI LAYER — overlays kill/clutch/teamFight/focusLabel ── */}
                <div className="pointer-events-none absolute inset-0 z-10">
                  {camera.highlightKill && (
                    <div className="absolute inset-0 border-2 border-red-400/70" />
                  )}
                  {camera.highlightClutch && !camera.highlightKill && (
                    <div className="absolute inset-0 border-2 border-yellow-300/60" />
                  )}
                  {camera.teamFight && (
                    <div className="absolute left-3 top-3 rounded bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-300">
                      Team Fight
                    </div>
                  )}
                  {camera.focusLabel && (
                    <div className="absolute right-3 top-3 rounded bg-black/55 px-2 py-1 text-xs font-semibold text-cyan-200">
                      {camera.focusLabel}
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 rounded bg-black/55 px-2 py-1 text-xs">
                    Round {currentRound?.round ?? 0}
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-center text-sm text-white/55">
                <div>
                  <div className="font-semibold text-white/75">Log replay mode</div>
                  <div className="mt-1 text-xs">
                    Snapshot spatial activé dès que tick_route persiste units_snapshot dans battle_logs.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Playback controls */}
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={() => setIndex((v) => Math.max(0, v - 1))} className="rounded bg-white/10 p-2">
              <SkipBack className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setPlaying((v) => !v)} className="rounded bg-cyan-500 p-2 text-black">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => setIndex((v) => Math.min(rounds.length - 1, v + 1))} className="rounded bg-white/10 p-2">
              <SkipForward className="h-4 w-4" />
            </button>
            <input
              type="range" min={0} max={Math.max(0, rounds.length - 1)} value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              className="ml-2 flex-1"
            />
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded bg-white/10 px-2 py-1 text-xs">
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>

          {/* Event timeline */}
          <div className="mt-3 rounded border border-white/10 bg-white/5 p-2">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">
              Event Timeline
            </div>
            <div className="max-h-[220px] space-y-1 overflow-auto">
              {priorityEvents.length > 0
                ? priorityEvents.map((event, i) => (
                    <EventRow key={event.event_id ?? `${i}-${event.ability}`} event={event} isHighlighted={i === 0} />
                  ))
                : <div className="text-xs text-white/50">No events on this round.</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ── Match Summary (toggle via bouton 📊) ── */}
      {showSummary && (
        <div className="mt-3">
          <MatchSummary rounds={rounds} />
        </div>
      )}

      {/* ── Montage list — top 10 moments cliquables (masqués si Summary ouvert) ── */}
      {montage.length > 0 && !showSummary && (
        <div className="mt-3 rounded border border-white/10 bg-white/5 p-2">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-yellow-300">
            🎬 Best Moments
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {montage.map((seg, i) => {
              const roundIdx = rounds.findIndex((r) => r.round === seg.round);
              const isActive = roundIdx === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(Math.max(0, roundIdx))}
                  className={`rounded px-2 py-1 text-left text-xs transition ${
                    isActive
                      ? "bg-yellow-400/20 text-yellow-200"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  {getMontageLabel(seg)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
