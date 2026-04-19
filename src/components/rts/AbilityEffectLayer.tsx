"use client";

import { useEffect, useMemo, useState } from "react";

// ============================================================
// TYPES
// ============================================================

export type AbilityFxType =
  | "explosion"
  | "chain"
  | "dash"
  | "zone"
  | "aura"
  | "shield";

/** Alias de compatibilité avec useAbilityFx — identique à AbilityEffectInput. */
export type AbilityEffectType = AbilityFxType;

export interface AbilityEffectInput {
  id: string;
  type: AbilityFxType;
  x: number;
  y: number;
  delayMs?: number;
  durationMs?: number;
  radius?: number;
}

/**
 * Alias rétro-compatible pour useAbilityFx qui produit des AbilityFxEntry.
 * Les deux interfaces sont identiques — l'alias évite de modifier le hook.
 */
export type AbilityFxEntry = AbilityEffectInput;

interface RuntimeEffect extends AbilityEffectInput {
  startedAt: number;
}

interface Props {
  effects: AbilityEffectInput[];
}

// ============================================================
// HELPERS
// ============================================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getDefaultDuration(effect: AbilityEffectInput): number {
  if (typeof effect.durationMs === "number" && effect.durationMs > 0) {
    return effect.durationMs;
  }
  switch (effect.type) {
    case "explosion": return 650;
    case "chain":     return 420;
    case "dash":      return 280;
    case "zone":      return 1400;
    case "aura":      return 2200;
    case "shield":    return 900;
    default:          return 800;
  }
}

function getDefaultRadius(effect: AbilityEffectInput): number {
  if (typeof effect.radius === "number" && effect.radius > 0) {
    return effect.radius;
  }
  switch (effect.type) {
    case "explosion": return 44;
    case "zone":      return 64;
    case "aura":      return 52;
    case "shield":    return 26;
    case "dash":      return 20;
    case "chain":     return 18;
    default:          return 30;
  }
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// ============================================================
// RENDERERS — un par type d'effet
// ============================================================

function renderExplosion(effect: RuntimeEffect, progress: number) {
  const radius = getDefaultRadius(effect);
  const scale   = 0.55 + easeOutCubic(progress) * 1.35;
  const opacity = 1 - progress;

  return (
    <>
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: effect.x, top: effect.y,
          width: radius * 2, height: radius * 2,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(34,211,238,0.55) 35%, rgba(34,211,238,0.08) 70%, transparent 100%)",
          boxShadow: "0 0 32px rgba(34,211,238,0.45)",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full border"
        style={{
          left: effect.x, top: effect.y,
          width: radius * 2.2, height: radius * 2.2,
          transform: `translate(-50%, -50%) scale(${0.7 + progress * 1.2})`,
          opacity: Math.max(0, 0.9 - progress),
          borderColor: "rgba(255,255,255,0.8)",
        }}
      />
    </>
  );
}

function renderChain(effect: RuntimeEffect, progress: number) {
  const radius = getDefaultRadius(effect);
  const pulse   = 0.8 + Math.sin(progress * Math.PI * 4) * 0.15;
  const opacity = 1 - progress * 0.9;

  return (
    <>
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: effect.x, top: effect.y,
          width: radius * 2, height: radius * 2,
          transform: `translate(-50%, -50%) scale(${pulse})`,
          opacity,
          background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(217,70,239,0.55) 38%, rgba(217,70,239,0.08) 72%, transparent 100%)",
          boxShadow: "0 0 24px rgba(217,70,239,0.55)",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full border"
        style={{
          left: effect.x, top: effect.y,
          width: radius * 2.5, height: radius * 2.5,
          transform: `translate(-50%, -50%) scale(${0.9 + progress * 0.4})`,
          opacity: Math.max(0, 0.75 - progress),
          borderColor: "rgba(217,70,239,0.8)",
        }}
      />
    </>
  );
}

function renderDash(effect: RuntimeEffect, progress: number) {
  const width   = 54;
  const height  = 18;
  const stretch = 1 + (1 - progress) * 1.1;
  const opacity = 1 - progress;

  return (
    <>
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: effect.x, top: effect.y,
          width: width * stretch, height,
          transform: "translate(-50%, -50%)",
          opacity,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 35%, rgba(239,68,68,0.8) 60%, transparent 100%)",
          filter: "blur(2px)",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: effect.x, top: effect.y,
          width: 22, height: 22,
          transform: `translate(-50%, -50%) scale(${1 + (1 - progress) * 0.8})`,
          opacity: Math.max(0, 0.95 - progress),
          background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(239,68,68,0.7) 50%, transparent 100%)",
          boxShadow: "0 0 20px rgba(239,68,68,0.45)",
        }}
      />
    </>
  );
}

function renderZone(effect: RuntimeEffect, progress: number, waiting: boolean) {
  const radius      = getDefaultRadius(effect);
  const baseOpacity = waiting ? 0.32 : 0.65;
  const warningPulse = waiting
    ? 0.92 + Math.sin(progress * Math.PI * 6) * 0.08
    : 1 + progress * 0.28;

  return (
    <>
      <div
        className="pointer-events-none absolute rounded-full border-2"
        style={{
          left: effect.x, top: effect.y,
          width: radius * 2, height: radius * 2,
          transform: `translate(-50%, -50%) scale(${warningPulse})`,
          opacity: baseOpacity,
          borderColor: waiting ? "rgba(251,191,36,0.95)" : "rgba(239,68,68,0.95)",
          background: waiting
            ? "radial-gradient(circle, rgba(251,191,36,0.14) 0%, rgba(251,191,36,0.06) 58%, transparent 100%)"
            : "radial-gradient(circle, rgba(239,68,68,0.24) 0%, rgba(239,68,68,0.08) 60%, transparent 100%)",
          boxShadow: waiting
            ? "0 0 24px rgba(251,191,36,0.35)"
            : "0 0 28px rgba(239,68,68,0.4)",
        }}
      />
      {!waiting && (
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            left: effect.x, top: effect.y,
            width: radius * 1.4, height: radius * 1.4,
            transform: `translate(-50%, -50%) scale(${1 + progress * 1.2})`,
            opacity: Math.max(0, 0.7 - progress),
            background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(239,68,68,0.45) 40%, transparent 100%)",
          }}
        />
      )}
    </>
  );
}

/**
 * renderAura — debuff "weaken" appliqué aux ennemis (aura_field).
 * Couleur violet (#a78bfa) cohérente avec la config FX existante.
 * Le vert serait trompeur (suggère un buff allié).
 */
function renderAura(effect: RuntimeEffect, progress: number) {
  const radius  = getDefaultRadius(effect);
  const pulse   = 0.94 + Math.sin(progress * Math.PI * 4) * 0.06;
  const opacity = 0.42 + Math.sin(progress * Math.PI * 4) * 0.08;

  return (
    <>
      <div
        className="pointer-events-none absolute rounded-full border"
        style={{
          left: effect.x, top: effect.y,
          width: radius * 2, height: radius * 2,
          transform: `translate(-50%, -50%) scale(${pulse})`,
          opacity,
          borderColor: "rgba(167,139,250,0.85)",
          background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, rgba(167,139,250,0.08) 55%, transparent 100%)",
          boxShadow: "0 0 26px rgba(167,139,250,0.35)",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          left: effect.x, top: effect.y,
          width: radius * 0.7, height: radius * 0.7,
          transform: "translate(-50%, -50%)",
          opacity: 0.45,
          background: "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(167,139,250,0.4) 55%, transparent 100%)",
        }}
      />
    </>
  );
}

function renderShield(effect: RuntimeEffect, progress: number) {
  const radius  = getDefaultRadius(effect);
  const scale   = 0.85 + easeOutCubic(progress) * 0.5;
  const opacity = 0.8 - progress * 0.55;

  return (
    <div
      className="pointer-events-none absolute rounded-full border-2"
      style={{
        left: effect.x, top: effect.y,
        width: radius * 2, height: radius * 2,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        borderColor: "rgba(96,165,250,0.95)",
        background: "radial-gradient(circle, rgba(96,165,250,0.12) 0%, rgba(96,165,250,0.05) 60%, transparent 100%)",
        boxShadow: "0 0 22px rgba(96,165,250,0.35)",
      }}
    />
  );
}

// ============================================================
// NŒUD D'EFFET — sélectionne le renderer selon le type et le progress
// ============================================================

function EffectNode({ effect, now }: { effect: RuntimeEffect; now: number }) {
  const delayMs    = Math.max(0, effect.delayMs ?? 0);
  const durationMs = Math.max(1, getDefaultDuration(effect));
  const elapsed    = now - effect.startedAt;
  const waiting    = elapsed < delayMs;
  const progress   = clamp((elapsed - delayMs) / durationMs, 0, 1);

  switch (effect.type) {
    case "explosion": return renderExplosion(effect, progress);
    case "chain":     return renderChain(effect, progress);
    case "dash":      return renderDash(effect, progress);
    case "zone":      return renderZone(effect, progress, waiting);
    case "aura":      return renderAura(effect, progress);
    case "shield":    return renderShield(effect, progress);
    default:          return null;
  }
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/**
 * AbilityEffectLayer
 *
 * Affiche les FX d'ability via un ticker 33ms (≈30fps) plutôt que Web Animations API,
 * ce qui permet de lire `progress` à tout moment et de gérer le délai (zone/meteor).
 *
 * Types supportés :
 * - explosion : arcane_burst, impacts AoE
 * - chain     : chain_lightning
 * - dash      : dash_strike, execute
 * - zone      : meteor_zone (anneau jaune → rouge après delayMs)
 * - aura      : aura_field (debuff weaken, violet, persistant)
 * - shield    : global_shield (anneau bleu)
 *
 * Export : AbilityFxEntry = AbilityEffectInput (alias pour useAbilityFx).
 *
 * Path : @/components/rts/AbilityEffectLayer
 */
export default function AbilityEffectLayer({ effects }: Props) {
  const [runtimeEffects, setRuntimeEffects] = useState<RuntimeEffect[]>([]);
  const [clock, setClock] = useState<number>(Date.now());

  // Ajout des nouveaux effets en évitant les doublons
  useEffect(() => {
    if (!effects.length) return;
    const now = Date.now();
    setRuntimeEffects((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const next = effects
        .filter((effect) => !existingIds.has(effect.id))
        .map((effect) => ({ ...effect, startedAt: now }));
      return next.length > 0 ? [...prev, ...next] : prev;
    });
  }, [effects]);

  // Ticker 33ms — avance le clock et purge les effets expirés
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = Date.now();
      setClock(now);
      setRuntimeEffects((prev) =>
        prev.filter((effect) => {
          const totalLifetime = Math.max(0, effect.delayMs ?? 0) + getDefaultDuration(effect);
          return now - effect.startedAt <= totalLifetime;
        }),
      );
    }, 33);
    return () => window.clearInterval(interval);
  }, []);

  const orderedEffects = useMemo(
    () => [...runtimeEffects].sort((a, b) => a.startedAt - b.startedAt),
    [runtimeEffects],
  );

  if (!orderedEffects.length) return null;

  return (
    <>
      {orderedEffects.map((effect) => (
        <EffectNode key={effect.id} effect={effect} now={clock} />
      ))}
    </>
  );
}
