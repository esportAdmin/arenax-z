/**
 * replaySync.ts
 * ─────────────────────────────────────────────────────────────────────
 * Source de vérité pour :
 *   - Deep links replay (/wars/:id/replay?tms=offsetMs)
 *   - Dispatch d'événement seek in-page (pour le ReplayTimestampBridge)
 *
 * Utilisé par :
 *   - MatchBreakdownPanel → buildReplayHref (deep link)
 *   - ReplayTimestampBridge → dispatchReplaySeek (event)
 *   - useReplaySeekListener → REPLAY_SEEK_EVENT (listener)
 * ─────────────────────────────────────────────────────────────────────
 */

export const REPLAY_SEEK_EVENT = "arena:replay-seek" as const;

export interface ReplayFocus {
  x:      number | null;
  y:      number | null;
  unitId: string | null;
}

export interface ReplaySeekDetail {
  offsetMs: number;
  source:   "url" | "highlight";
  focus:    ReplayFocus | null;
}

declare global {
  interface Window {
    __arenaReplaySeekMs?: number;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function parseReplaySeekMs(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return clamp(Math.round(parsed), 0, 24 * 60 * 60 * 1000);
}

export function buildReplayHref(params: {
  territoryId: string | null;
  warId:       string;
  offsetMs?:   number | null;
}): string {
  const base = params.territoryId
    ? `/wars/${params.territoryId}/replay`
    : `/replay/${params.warId}`;

  if (params.offsetMs == null || params.offsetMs < 0) return base;

  const search = new URLSearchParams({
    tms: String(Math.round(params.offsetMs)),
  });

  return `${base}?${search.toString()}`;
}

export function dispatchReplaySeek(
  offsetMs: number,
  source:   ReplaySeekDetail["source"] = "highlight",
  focus:    ReplayFocus | null = null,
): void {
  if (typeof window === "undefined") return;

  const detail: ReplaySeekDetail = {
    offsetMs: Math.max(0, Math.round(offsetMs)),
    source,
    focus,
  };

  window.__arenaReplaySeekMs = detail.offsetMs;

  window.dispatchEvent(
    new CustomEvent<ReplaySeekDetail>(REPLAY_SEEK_EVENT, {
      detail,
      bubbles:    false,
      cancelable: false,
    }),
  );
}
