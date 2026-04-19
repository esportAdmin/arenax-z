"use client";

import { useCallback, useEffect, useRef } from "react";

// ============================================================
// TYPES
// ============================================================

export type AudioEvent =
  | "kill"
  | "multi_kill"    // 2+ kills consécutifs ce tick
  | "ultimate"
  | "meteor"
  | "blackhole"
  | "clutch_start"  // unité à ≤ 20% HP détectée
  | "clutch_end"    // heartbeat arrêté
  | "ace"           // dernier ennemi éliminé
  | "teamwipe";

interface UseAudioParams {
  /** Active/désactive complètement le système audio */
  enabled?: boolean;
  /** Volume global 0–1 (default: 0.35 pour ne pas surprendre l'utilisateur) */
  volume?: number;
}

// ============================================================
// SYNTHÈSE AUDIO — Web Audio API
//
// Pas de fichiers externes. Tous les sons sont générés par synthèse
// directe (oscillateurs, bruit blanc) pour être 100% autonomes.
// Chaque fonction retourne immédiatement — pas d'async, pas d'await.
// ============================================================

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

/** Sinus court avec decay — kill click / hit confirmation */
function synthKill(ctx: AudioContext, volume: number): void {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.18);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.25);
}

/** Multi-kill — double beep ascendant */
function synthMultiKill(ctx: AudioContext, volume: number): void {
  [0, 0.12].forEach((delay, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "square";
    osc.frequency.setValueAtTime(660 + i * 220, ctx.currentTime + delay);

    gain.gain.setValueAtTime(volume * 0.7, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.2);
  });
}

/** Ultimate — sweep grave→aigu + decay */
function synthUltimate(ctx: AudioContext, volume: number): void {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(110, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.55);

  gain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.65);
}

/** Meteor — grondement grave + impact */
function synthMeteor(ctx: AudioContext, volume: number): void {
  // Bruit blanc (impact)
  const bufferSize = ctx.sampleRate * 0.4;
  const buffer     = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data       = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise  = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain   = ctx.createGain();
  noise.buffer = buffer;
  filter.type  = "lowpass";
  filter.frequency.setValueAtTime(400, ctx.currentTime);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(volume * 0.8, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.45);

  // Sinus grave
  const osc  = ctx.createOscillator();
  const og   = ctx.createGain();
  osc.connect(og);
  og.connect(ctx.destination);
  osc.frequency.setValueAtTime(55, ctx.currentTime);
  og.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
  og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

/** Blackhole — spiral descendant */
function synthBlackhole(ctx: AudioContext, volume: number): void {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.7);
  gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.8);
}

/**
 * Clutch heartbeat — battement LFO grave.
 * Retourne un cleanup function (stopHeartbeat).
 */
function startHeartbeat(ctx: AudioContext, volume: number): () => void {
  let active = true;
  let timer: ReturnType<typeof setTimeout>;

  function beat() {
    if (!active) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    gain.gain.setValueAtTime(volume * 0.45, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
    timer = setTimeout(beat, 600);
  }

  beat();
  return () => { active = false; clearTimeout(timer); };
}

/** Ace / teamwipe — fanfare triple */
function synthAce(ctx: AudioContext, volume: number): void {
  [0, 0.18, 0.36].forEach((delay, i) => {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime([523, 659, 784][i], ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume * 0.55, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.22);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.25);
  });
}

// ============================================================
// HOOK
// ============================================================

/**
 * useAudio
 *
 * Hook audio esport basé sur Web Audio API (synthèse, zéro fichiers).
 *
 * Usage :
 * ```ts
 * const { play, startClutch, stopClutch } = useAudio({ enabled: true });
 *
 * // Dans un useEffect sur les events
 * if (event.isKill)          play("kill");
 * if (event.type === "ultimate") play("ultimate");
 * if (highlightClutch)       startClutch();
 * else                       stopClutch();
 * ```
 *
 * Path : @/hooks/useAudio
 */
export function useAudio({ enabled = true, volume = 0.35 }: UseAudioParams = {}) {
  const ctxRef             = useRef<AudioContext | null>(null);
  const stopHeartbeatRef   = useRef<(() => void) | null>(null);
  const heartbeatActiveRef = useRef(false);

  // Création paresseuse du contexte (doit être déclenché par un geste utilisateur)
  const getOrCreateCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) ctxRef.current = getCtx();
    if (ctxRef.current?.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, [enabled]);

  const play = useCallback((event: AudioEvent): void => {
    const ctx = getOrCreateCtx();
    if (!ctx) return;

    switch (event) {
      case "kill":       synthKill(ctx, volume);       break;
      case "multi_kill": synthMultiKill(ctx, volume);  break;
      case "ultimate":   synthUltimate(ctx, volume);   break;
      case "meteor":     synthMeteor(ctx, volume);     break;
      case "blackhole":  synthBlackhole(ctx, volume);  break;
      case "ace":
      case "teamwipe":   synthAce(ctx, volume);        break;
      case "clutch_start":
      case "clutch_end": break; // géré via startClutch / stopClutch
    }
  }, [getOrCreateCtx, volume]);

  /** Démarre le heartbeat clutch. Idempotent — ne démarre pas deux fois. */
  const startClutch = useCallback((): void => {
    if (heartbeatActiveRef.current) return;
    const ctx = getOrCreateCtx();
    if (!ctx) return;
    heartbeatActiveRef.current = true;
    stopHeartbeatRef.current   = startHeartbeat(ctx, volume);
  }, [getOrCreateCtx, volume]);

  /** Arrête le heartbeat clutch. */
  const stopClutch = useCallback((): void => {
    if (!heartbeatActiveRef.current) return;
    stopHeartbeatRef.current?.();
    stopHeartbeatRef.current   = null;
    heartbeatActiveRef.current = false;
  }, []);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      stopHeartbeatRef.current?.();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return { play, startClutch, stopClutch };
}
