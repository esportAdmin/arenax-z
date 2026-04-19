"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ============================================================
// TYPES
// ============================================================

export interface SpectatorUnitPosition {
  id: string;
  x: number;
  y: number;
  hp?: number;
  maxHp?: number;
  clubId?: string | null;
}

export interface SpectatorReplayEvent {
  event_id?: string;
  server_ts?: string;
  type?: string;
  attackerId: string;
  defenderId: string;
  damage?: number;
  crit?: boolean;
  ability?: string;
  impactStyle?: string;
  splashRadius?: number;
  replayTag?: string;
  isKill?: boolean;
  killStreak?: number;
  /** "ultimate" ajouté vs versions précédentes (emis par tick_route) */
  highlight?: "clutch" | "ace" | "teamwipe" | "ultimate";
  projectileAimLng?: number;
  projectileAimLat?: number;
  projectileStartLng?: number;
  projectileStartLat?: number;
  esport?: {
    tag?: string | null;
    type?: string | null;
    teamFocus?: string | null;
    formation?: string | null;
  };
}

interface UseSpectatorCameraParams {
  units: SpectatorUnitPosition[];
  events: SpectatorReplayEvent[];
  enabled: boolean;
  width?: number;
  height?: number;
}

export interface SpectatorCameraState {
  offsetX: number;
  offsetY: number;
  zoom: number;
  focusUnitId: string | null;
  highlightKill: boolean;
  highlightClutch: boolean;
  shakeIntensity: number;
  /** Caméra figée ~140ms après kill (lerp = 0) */
  freezeFrame: boolean;
  /** Effets visuels ralentis ~260–420ms après kill / ultimate */
  slowMo: boolean;
  /** ≥ 6 unités dans un rayon de 120 + activité élevée */
  teamFight: boolean;
  /** Point de focus en coordonnées canvas (pour FX externe) */
  focusPoint: { x: number; y: number } | null;
  /** Label lisible du moment le plus important (ACE, KILL, ULT METEOR…) */
  focusLabel: string | null;
  /**
   * Momentum cumulé (0–300) — propagé aux consommateurs pour UI glow / audio boost.
   * Décroît de 20% par tick, injecté à 20% de l'intensité du tick courant.
   */
  momentum: number;
  /**
   * Vrai si la caméra est en mode "story hold" — elle garde le même focus
   * pendant une fenêtre narrativement importante (clutch 800ms, ace 1200ms).
   * Pendant ce temps la cible n'est pas re-évaluée même si un nouvel event arrive.
   */
  holdingFocus: boolean;
}

// ============================================================
// HELPERS
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function unitDistance(ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  return Math.sqrt(dx * dx + dy * dy);
}

function getEventWeight(event: SpectatorReplayEvent): number {
  let weight = Number(event.damage ?? 0);

  if (event.crit)                                weight += 18;
  if (event.isKill)                              weight += 50;
  if (event.highlight === "ace")                 weight += 80;
  if (event.highlight === "teamwipe")            weight += 70;
  if (event.highlight === "clutch")              weight += 45;
  if (event.killStreak && event.killStreak >= 2) weight += event.killStreak * 15;
  // killStreak >= 3 : boost supplémentaire pour priorité narrative absolue
  if (event.killStreak && event.killStreak >= 3) weight += 60;
  if (event.type === "ultimate")                 weight += 30;
  if (event.type === "team_call")                weight += 10;
  if (event.ability === "meteor")                weight += 26;
  if (event.ability === "blackhole")             weight += 28;
  if (event.ability === "dash_aoe")              weight += 22;
  if (event.esport?.tag === "ULT_BLACKHOLE")     weight += 10;
  if (event.esport?.tag === "ULT_METEOR")        weight += 10;

  return weight;
}

function chooseFocusEvent(events: SpectatorReplayEvent[]): SpectatorReplayEvent | null {
  if (!events.length) return null;
  return [...events]
    .map((e) => ({ event: e, weight: getEventWeight(e) + getNarrativePriority(e) * 2 }))
    .sort((a, b) => b.weight - a.weight)[0]?.event ?? null;
}

/**
 * Priorité narrative — séparée du poids de damage/crit.
 *
 * La caméra ne suit plus seulement le plus gros damage :
 * elle suit l'histoire du combat (ace > teamwipe > streak > clutch > kill > ultimate).
 * Multiplié par 2 dans chooseFocusEvent pour peser face à getEventWeight.
 */
function getNarrativePriority(event: SpectatorReplayEvent): number {
  if (event.highlight === "ace")                         return 100;
  if (event.highlight === "teamwipe")                    return 90;
  if (event.killStreak && event.killStreak >= 3)         return 80;
  if (event.highlight === "clutch")                      return 75;
  if (event.isKill)                                      return 60;
  if (event.type === "ultimate")                         return 50;
  if (event.type === "team_call")                        return 20;
  return 0;
}

function getEventFocusLabel(event: SpectatorReplayEvent | null): string | null {
  if (!event) return null;
  if (event.highlight === "ace")      return "ACE";
  if (event.highlight === "teamwipe") return "TEAMWIPE";
  if (event.highlight === "clutch")   return "CLUTCH";
  if (event.isKill)                   return "KILL";
  if (event.type === "ultimate")      return `ULT ${String(event.ability ?? "").toUpperCase()}`;
  if (event.type === "team_call")     return "TEAM CALL";
  if (event.crit)                     return "CRIT";
  return event.ability ? String(event.ability).toUpperCase() : null;
}

/**
 * Détecte un team fight.
 *
 * Le seuil 120 est en unités de coordonnées canvas (px pour WorldMap,
 * unités géo pour ReplayViewer snapshot). Le hook ne normalise pas — chaque
 * consommateur opère dans son propre espace de coordonnées.
 */
function detectTeamFight(
  units: SpectatorUnitPosition[],
  events: SpectatorReplayEvent[],
  focusPoint: { x: number; y: number } | null,
): boolean {
  if (!focusPoint || units.length < 6) return false;

  const nearby = units.filter(
    (u) => unitDistance(u.x, u.y, focusPoint.x, focusPoint.y) <= 120,
  );

  const highActivity =
    events.filter((e) => Number(e.damage ?? 0) > 0 || e.type === "ultimate").length >= 3;

  return nearby.length >= 6 && highActivity;
}

function computeShakeIntensity(event: SpectatorReplayEvent | null, teamFight: boolean): number {
  if (!event) return teamFight ? 2 : 0;
  if (event.highlight === "ace")                return 6;
  if (event.highlight === "teamwipe")           return 5;
  if (event.isKill)                             return 4;
  if (event.type === "ultimate")                return 4;
  if (event.crit || Number(event.damage ?? 0) >= 35) return 3;
  if (teamFight)                                return 2;
  if (Number(event.damage ?? 0) >= 15)          return 1.5;
  if (Number(event.damage ?? 0) > 0)            return 0.75;
  return 0;
}

function computeZoom(event: SpectatorReplayEvent | null, teamFight: boolean): number {
  let zoom = 1.02;

  if (!event) return teamFight ? 1.08 : zoom;

  if (teamFight)                       zoom = Math.max(zoom, 1.10);
  if (event.type === "team_call")      zoom = Math.max(zoom, 1.08);
  if (event.crit)                      zoom = Math.max(zoom, 1.14);
  if (Number(event.damage ?? 0) >= 18) zoom = Math.max(zoom, 1.12);
  if (event.type === "ultimate")       zoom = Math.max(zoom, 1.18);

  // Correction B : fusion des deux if séparés meteor/blackhole du doc 33
  if (event.ability === "meteor" || event.ability === "blackhole" || event.ability === "dash_aoe") {
    zoom = Math.max(zoom, 1.22);
  }

  if (event.highlight === "clutch")    zoom = Math.max(zoom, 1.20);
  if (event.isKill)                    zoom = Math.max(zoom, 1.24);
  if (event.highlight === "teamwipe")  zoom = Math.max(zoom, 1.26);
  if (event.highlight === "ace")       zoom = Math.max(zoom, 1.30);

  return clamp(zoom, 1, 1.32);
}

// ============================================================
// HOOK
// ============================================================

/**
 * useSpectatorCamera — caméra spectateur intelligente.
 *
 * Fonctionnalités :
 * - Focus automatique sur l'event le plus significatif du tick
 * - Kill cam : freezeFrame 140ms + slowMo 420ms
 * - Slow motion sur ultimate : 260ms
 * - Camera prediction : meteor / blackhole → aim point futur
 * - Team fight detection (≥ 6 unités proches + activité élevée)
 * - Labels dynamiques (ACE, KILL, TEAMWIPE, ULT METEOR…)
 * - Lerp 0.18 pour mouvement fluide, lerp 0 en freeze
 *
 * Path : @/hooks/useSpectatorCamera
 */
export function useSpectatorCamera({
  units,
  events,
  enabled,
  width = 900,
  height = 540,
}: UseSpectatorCameraParams): SpectatorCameraState {
  const [state, setState] = useState<SpectatorCameraState>({
    offsetX: 0, offsetY: 0, zoom: 1,
    focusUnitId: null, highlightKill: false, highlightClutch: false,
    shakeIntensity: 0, freezeFrame: false, slowMo: false,
    teamFight: false, focusPoint: null, focusLabel: null,
    momentum: 0, holdingFocus: false,
  });

  const previousHpRef      = useRef<Map<string, number>>(new Map());
  const freezeUntilRef     = useRef<number>(0);
  const slowMoUntilRef     = useRef<number>(0);
  /**
   * Momentum — intensité cumulée sur plusieurs ticks.
   * Formule : momentum = momentum * 0.8 + tickIntensity * 0.2
   * Résultat : boost zoom progressif lors d'un teamfight long.
   * Plafond 300 pour éviter un zoom infini.
   */
  const momentumRef        = useRef<number>(0);
  /**
   * holdFocusUntilRef — timestamp jusqu'auquel on maintient le même focus.
   * Pendant cette fenêtre, chooseFocusEvent est court-circuité.
   */
  const holdFocusUntilRef  = useRef<number>(0);
  const heldFocusEventRef  = useRef<SpectatorReplayEvent | null>(null);

  const unitsById = useMemo(() => {
    const map = new Map<string, SpectatorUnitPosition>();
    for (const unit of units) map.set(unit.id, unit);
    return map;
  }, [units]);

  const focusEvent = useMemo(() => chooseFocusEvent(events), [events]);

  useEffect(() => {
    if (!enabled) {
      setState({
        offsetX: 0, offsetY: 0, zoom: 1,
        focusUnitId: null, highlightKill: false, highlightClutch: false,
        shakeIntensity: 0, freezeFrame: false, slowMo: false,
        teamFight: false, focusPoint: null, focusLabel: null,
        momentum: 0, holdingFocus: false,
      });
      return;
    }

    const now     = Date.now();
    const centerX = width  / 2;
    const centerY = height / 2;

    // ── Story arc : hold focus narratif ──
    // Si un clutch/ace/kill est détecté, on verrouille le focus sur l'event
    // courant pendant une fenêtre définie — la caméra ne re-évalue pas.
    const isHolding = now < holdFocusUntilRef.current;
    const activeEvent: SpectatorReplayEvent | null = isHolding
      ? (heldFocusEventRef.current ?? focusEvent)
      : focusEvent;

    // Déclenche un hold focus sur les moments narratifs importants
    if (!isHolding && focusEvent) {
      let holdMs = 0;
      if (focusEvent.highlight === "ace")                         holdMs = 1200;
      else if (focusEvent.highlight === "teamwipe")               holdMs = 1000;
      else if ((focusEvent.killStreak ?? 0) >= 3)                holdMs = 900;
      else if (focusEvent.highlight === "clutch")                holdMs = 800;
      else if (focusEvent.isKill)                                holdMs = 400;
      else if (focusEvent.type === "ultimate")                   holdMs = 300;

      if (holdMs > 0) {
        holdFocusUntilRef.current = now + holdMs;
        heldFocusEventRef.current = focusEvent;
      }
    }

    let focusUnitId: string | null = null;
    let focusX = centerX;
    let focusY = centerY;

    const defender = activeEvent ? (unitsById.get(activeEvent.defenderId) ?? null) : null;
    const attacker = activeEvent ? (unitsById.get(activeEvent.attackerId) ?? null) : null;

    // ── Camera prediction : meteor / blackhole → aim point futur ──
    const isPredictiveAbility =
      activeEvent?.ability === "meteor" || activeEvent?.ability === "blackhole";

    if (
      isPredictiveAbility &&
      typeof activeEvent?.projectileAimLng === "number" &&
      typeof activeEvent?.projectileAimLat === "number"
    ) {
      focusX = activeEvent.projectileAimLng;
      focusY = activeEvent.projectileAimLat;
    } else if (defender) {
      focusX = defender.x; focusY = defender.y; focusUnitId = defender.id;
    } else if (attacker) {
      focusX = attacker.x; focusY = attacker.y; focusUnitId = attacker.id;
    } else if (units.length > 0) {
      focusX = units.reduce((s, u) => s + u.x, 0) / units.length;
      focusY = units.reduce((s, u) => s + u.y, 0) / units.length;
    }

    const focusPoint = { x: focusX, y: focusY };
    const teamFight  = detectTeamFight(units, events, focusPoint);

    // ── Kill / clutch detection depuis HP précédent ──
    let highlightKill   = false;
    let highlightClutch = false;

    for (const unit of units) {
      const prev  = previousHpRef.current.get(unit.id);
      const curr  = Number(unit.hp ?? 0);
      const maxHp = Math.max(1, Number(unit.maxHp ?? 100));
      if (prev != null && prev > 0 && curr <= 0) highlightKill   = true;
      if (curr > 0 && curr / maxHp <= 0.15)      highlightClutch = true;
    }

    // Propagation depuis event enrichi (tick_route) — utilise activeEvent (hold-aware)
    if (activeEvent?.isKill)                 highlightKill   = true;
    if (activeEvent?.highlight === "clutch") highlightClutch = true;

    // ── Timers slowMo / freezeFrame ──
    const isTripleKillPlus = (activeEvent?.killStreak ?? 0) >= 3;

    if (isTripleKillPlus) {
      freezeUntilRef.current = now + 200;
      slowMoUntilRef.current = now + 700;
    } else if (highlightKill || activeEvent?.isKill) {
      freezeUntilRef.current = now + 140;
      slowMoUntilRef.current = now + 420;
    } else if (activeEvent?.highlight === "clutch") {
      slowMoUntilRef.current = Math.max(slowMoUntilRef.current, now + 600);
    } else if (activeEvent?.type === "ultimate") {
      slowMoUntilRef.current = Math.max(slowMoUntilRef.current, now + 260);
    }

    // ── Momentum tracking ──
    const tickIntensity = events.reduce((sum, e) => sum + getEventWeight(e), 0);
    momentumRef.current = Math.min(300, momentumRef.current * 0.8 + tickIntensity * 0.2);

    const freezeFrame    = now < freezeUntilRef.current;
    const slowMo         = now < slowMoUntilRef.current;
    const shakeIntensity = computeShakeIntensity(activeEvent, teamFight);

    let zoom = computeZoom(activeEvent, teamFight);
    if (momentumRef.current > 200) zoom = Math.max(zoom, 1.28);
    else if (momentumRef.current > 100) zoom = Math.max(zoom, 1.20);
    if (isTripleKillPlus) zoom = Math.max(zoom, 1.30);

    const lerpT = freezeFrame ? 0 : 0.18;

    setState((prev) => ({
      offsetX:      lerp(prev.offsetX, centerX - focusX, lerpT),
      offsetY:      lerp(prev.offsetY, centerY - focusY, lerpT),
      zoom:         lerp(prev.zoom, zoom, lerpT),
      focusUnitId,
      highlightKill,
      highlightClutch,
      shakeIntensity,
      freezeFrame,
      slowMo,
      teamFight,
      focusPoint,
      focusLabel:   getEventFocusLabel(activeEvent),
      momentum:     momentumRef.current,
      holdingFocus: isHolding,
    }));
  }, [enabled, events, focusEvent, height, units, unitsById, width]);

  // Snapshot HP pour kill detection au prochain frame
  useEffect(() => {
    const next = new Map<string, number>();
    for (const unit of units) next.set(unit.id, Number(unit.hp ?? 0));
    previousHpRef.current = next;
  }, [units]);

  return state;
}
