/**
 * highlightReel.ts - scoring + merge clips + manifest
 */
import type {
  BattleHighlight,
  BattleInsights,
} from "@/lib/replay/battleLogsAdapter";

export interface HighlightClip {
  id: string;
  label: string;
  tag: string;
  score: number;
  startOffsetMs: number;
  endOffsetMs: number;
  focusOffsetMs: number;
  matchTime: string;
  focusX: number | null;
  focusY: number | null;
}

export interface HighlightReelManifest {
  warId: string;
  territoryId: string | null;
  generatedAt: string;
  totalDurationMs: number;
  clips: HighlightClip[];
}

const PRE_ROLL_MS = 4_000;
const POST_ROLL_MS = 5_000;
const MAX_CLIPS = 5;
const MAX_TOTAL_DURATION_MS = 90_000;

const TAG_SCORES: Readonly<Record<string, number>> = {
  ace: 100,
  teamwipe: 90,
  clutch: 85,
  triple_kill: 75,
  double_kill: 60,
  multi_kill: 55,
  ultimate: 40,
  kill: 25,
};

function scoreHighlight(h: BattleHighlight): number {
  return TAG_SCORES[h.tag.toLowerCase()] ?? 20;
}

function computeOffsetMs(
  highlightTs: string,
  warStartedAt: string | null,
): number {
  if (!warStartedAt) return 0;
  const delta =
    new Date(highlightTs).getTime() - new Date(warStartedAt).getTime();
  return Math.max(0, Number.isFinite(delta) ? delta : 0);
}

function clipsOverlap(a: HighlightClip, b: HighlightClip): boolean {
  return a.startOffsetMs <= b.endOffsetMs && b.startOffsetMs <= a.endOffsetMs;
}

function mergeClips(a: HighlightClip, b: HighlightClip): HighlightClip {
  const dominant = a.score >= b.score ? a : b;
  return {
    id: `${a.id}+${b.id}`,
    label: dominant.label,
    tag: dominant.tag,
    score: Math.max(a.score, b.score),
    startOffsetMs: Math.min(a.startOffsetMs, b.startOffsetMs),
    endOffsetMs: Math.max(a.endOffsetMs, b.endOffsetMs),
    focusOffsetMs: dominant.focusOffsetMs,
    matchTime: dominant.matchTime,
    focusX: dominant.focusX,
    focusY: dominant.focusY,
  };
}

function normalizeClips(raw: HighlightClip[]): HighlightClip[] {
  if (raw.length === 0) return [];
  const sorted = [...raw].sort((a, b) => a.startOffsetMs - b.startOffsetMs);
  const merged: HighlightClip[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    if (clipsOverlap(last, current)) {
      merged[merged.length - 1] = mergeClips(last, current);
    } else {
      merged.push(current);
    }
  }

  return merged;
}

export function buildHighlightReelManifest(params: {
  warId: string;
  territoryId: string | null;
  insights: BattleInsights | null;
}): HighlightReelManifest {
  const { warId, territoryId, insights } = params;

  const empty: HighlightReelManifest = {
    warId,
    territoryId,
    generatedAt: new Date().toISOString(),
    totalDurationMs: 0,
    clips: [],
  };

  if (!insights?.hasData || insights.highlights.length === 0) return empty;

  const rawClips: HighlightClip[] = insights.highlights.map((h, i) => {
    const offsetMs = computeOffsetMs(h.timestamp, insights.warStartedAt);

    return {
      id: `${h.tag}-${i}`,
      label: h.label,
      tag: h.tag,
      score: scoreHighlight(h),
      startOffsetMs: Math.max(0, offsetMs - PRE_ROLL_MS),
      endOffsetMs: offsetMs + POST_ROLL_MS,
      focusOffsetMs: offsetMs,
      matchTime: h.matchTime,
      focusX: null,
      focusY: null,
    };
  });

  const topClips = normalizeClips(rawClips)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CLIPS)
    .sort((a, b) => a.startOffsetMs - b.startOffsetMs);

  const limited: HighlightClip[] = [];
  let totalDurationMs = 0;

  for (const clip of topClips) {
    const duration = clip.endOffsetMs - clip.startOffsetMs;
    if (totalDurationMs + duration > MAX_TOTAL_DURATION_MS && limited.length > 0) {
      break;
    }
    limited.push(clip);
    totalDurationMs += duration;
  }

  return {
    warId,
    territoryId,
    generatedAt: new Date().toISOString(),
    totalDurationMs,
    clips: limited,
  };
}
