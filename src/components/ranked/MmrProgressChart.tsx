"use client";

/**
 * MmrProgressChart
 * ─────────────────────────────────────────────────────────────────────
 * Améliorations vs version précédente :
 *
 *  Fix B — ResizeObserver : les coordonnées SVG sont calculées depuis
 *    la largeur réelle du conteneur DOM, pas une constante CHART_W = 600.
 *    Les points sont recalculés à chaque resize.
 *
 *  Bonus — Binary search O(log n) dans handleMouseMove :
 *    Les points px sont triés par définition (gauche → droite).
 *    On peut donc bisect au lieu d'une boucle O(n).
 *    Gain imperceptible à 30 points, mais correct à 100+.
 *
 *  Fix C (chart) — 1 point : rendu comme point isolé centré,
 *    avec un arc symbolique au lieu d'une ligne plate invisible.
 * ─────────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlayerMmrHistory } from "@/hooks/usePlayerMmrHistory";
import { getRankTier, type RankTier } from "@/lib/ranked/mmr";

// ─────────────────────────────────────────────
// CONSTANTES — indépendantes de la largeur
// ─────────────────────────────────────────────

const CHART_H    = 160;
const PAD_X      = 8;
const PAD_Y      = 16;
const INNER_H    = CHART_H - PAD_Y * 2;
const MMR_MARGIN = 30;

const TIER_COLOR: Record<RankTier, string> = {
  bronze:   "#f59e0b",
  silver:   "#cbd5e1",
  gold:     "#fbbf24",
  platinum: "#67e8f9",
  diamond:  "#c4b5fd",
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" })
      .format(new Date(iso));
  } catch { return ""; }
}

/**
 * Courbe de Bézier cubique sur les points fournis.
 * Cas 1 point : rendu comme un arc léger centré (visible et lisible).
 * smooth = false → lignes droites (fallback performance).
 */
function buildPath(
  points: { px: number; py: number }[],
  smooth = true,
): string {
  if (points.length === 0) return "";

  // Cas 1 point — arc symbolique plutôt qu'une ligne plate
  if (points.length === 1) {
    const { px, py } = points[0];
    const r = 12;
    return `M ${px - r} ${py} Q ${px} ${py - r * 1.5} ${px + r} ${py}`;
  }

  if (!smooth) {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.px.toFixed(2)} ${p.py.toFixed(2)}`)
      .join(" ");
  }

  let d = `M ${points[0].px.toFixed(2)} ${points[0].py.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx  = (prev.px + curr.px) / 2;
    d += ` C ${cpx.toFixed(2)} ${prev.py.toFixed(2)}, ${cpx.toFixed(2)} ${curr.py.toFixed(2)}, ${curr.px.toFixed(2)} ${curr.py.toFixed(2)}`;
  }
  return d;
}

/**
 * Binary search O(log n) — trouve l'index du point le plus proche de mouseX.
 * Valide uniquement car les px sont strictement croissants (gauche → droite).
 */
function findClosestIdx(points: { px: number }[], mouseX: number): number {
  if (points.length === 0) return -1;
  if (points.length === 1) return 0;

  let lo = 0;
  let hi = points.length - 1;

  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid].px < mouseX) lo = mid + 1;
    else hi = mid;
  }

  // lo est maintenant l'index >= mouseX le plus proche
  // comparer avec lo-1 pour trouver le vrai plus proche
  if (lo > 0 && Math.abs(points[lo - 1].px - mouseX) < Math.abs(points[lo].px - mouseX)) {
    return lo - 1;
  }
  return lo;
}

// ─────────────────────────────────────────────
// HOOK RESIZE OBSERVER
// ─────────────────────────────────────────────

/**
 * Retourne la largeur réelle du conteneur référencé.
 * Se met à jour à chaque resize via ResizeObserver.
 * Fallback à 600 avant le premier paint (SSR safe).
 */
function useContainerWidth(ref: React.RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(600);

  useEffect(() => {
    if (!ref.current) return;

    // Lecture immédiate
    setWidth(ref.current.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/50 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/8" />
        <div className="h-3 w-16 animate-pulse rounded-full bg-white/6" />
      </div>
      <div className="h-44 animate-pulse rounded-xl bg-white/4" />
      <div className="mt-4 flex gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 flex-1 animate-pulse rounded-lg bg-white/4" />
        ))}
      </div>
    </div>
  );
}

function SummaryPill({
  label, value, color,
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg border border-white/6 bg-white/3 px-3 py-2">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-white/30">
        {label}
      </div>
      <div className={`text-sm font-black tabular-nums ${color ?? "text-white/80"}`}>
        {value}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────

interface ChartPoint {
  px: number; py: number;
  mmr: number; delta: number;
  result: "win" | "loss"; date: string;
}

function Tooltip({ point, chartW }: { point: ChartPoint; chartW: number }) {
  const showRight = point.px < chartW / 2;
  return (
    <g>
      <line
        x1={point.px} y1={PAD_Y}
        x2={point.px} y2={CHART_H - PAD_Y}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <foreignObject
        x={showRight ? point.px + 8 : point.px - 108}
        y={Math.max(PAD_Y, point.py - 40)}
        width="100"
        height="64"
      >
        <div
          style={{
            background: "rgba(0,0,0,0.88)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px",
            padding: "6px 8px",
            fontSize: "11px",
            color: "white",
            lineHeight: "1.5",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: "14px" }}>
            {point.mmr.toLocaleString()} MMR
          </div>
          <div style={{ color: point.delta >= 0 ? "#67e8f9" : "#f87171", fontWeight: 600 }}>
            {point.delta >= 0 ? "+" : ""}{point.delta}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}>
            {point.date}
          </div>
        </div>
      </foreignObject>
    </g>
  );
}

// ─────────────────────────────────────────────
// CHART
// ─────────────────────────────────────────────

export function MmrProgressChart({ limit = 30 }: { limit?: number }) {
  const { data, summary, loading, error } = usePlayerMmrHistory(limit);
  const [hoveredIdx, setHoveredIdx]       = useState<number | null>(null);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef       = useRef<SVGSVGElement>(null);

  // Fix B — largeur réelle du conteneur
  const chartW = useContainerWidth(containerRef);
  const innerW = Math.max(1, chartW - PAD_X * 2);

  // Points SVG — recalculés si data ou chartW change
  const { points, minMmr, maxMmr, linePath, areaPath } = useMemo(() => {
    if (data.length === 0) {
      return { points: [] as ChartPoint[], minMmr: 0, maxMmr: 0, linePath: "", areaPath: "" };
    }

    const allMmr = data.map((p) => p.mmr_after);
    const minMmr = Math.max(0, Math.min(...allMmr) - MMR_MARGIN);
    const maxMmr = Math.max(...allMmr) + MMR_MARGIN;
    const range  = Math.max(1, maxMmr - minMmr);

    const pts: ChartPoint[] = data.map((p, i) => {
      const px =
        data.length === 1
          ? PAD_X + innerW / 2
          : PAD_X + (i / (data.length - 1)) * innerW;
      const py = PAD_Y + INNER_H - ((p.mmr_after - minMmr) / range) * INNER_H;
      return {
        px, py,
        mmr:    p.mmr_after,
        delta:  p.mmr_delta,
        result: p.result,
        date:   formatDate(p.created_at),
      };
    });

    const linePath = buildPath(pts, true);

    const lastPt  = pts[pts.length - 1];
    const firstPt = pts[0];
    const bottom  = CHART_H - PAD_Y;
    const areaPath =
      linePath +
      ` L ${lastPt.px.toFixed(2)} ${bottom}` +
      ` L ${firstPt.px.toFixed(2)} ${bottom} Z`;

    return { points: pts, minMmr, maxMmr, linePath, areaPath };
  }, [data, innerW]);

  const tierColor = summary
    ? (TIER_COLOR[getRankTier(summary.currentMmr)] ?? "#67e8f9")
    : "#67e8f9";

  // Bonus — Binary search O(log n)
  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current || points.length === 0) return;
    const rect   = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * chartW;
    const idx    = findClosestIdx(points, mouseX);
    if (idx >= 0) setHoveredIdx(idx);
  }

  // ── Render ──

  if (loading) return <ChartSkeleton />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-300">
        <span className="font-semibold">MMR history unavailable:</span> {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-white/8 bg-black/50 p-8 text-center backdrop-blur-xl">
        <div className="text-3xl">📈</div>
        <div className="mt-3 text-sm font-semibold text-white/40">
          No MMR history yet
        </div>
        <div className="mt-1 text-xs text-white/25">
          Complete ranked matches to build your progression curve
        </div>
      </div>
    );
  }

  const hoveredPoint = hoveredIdx !== null ? points[hoveredIdx] ?? null : null;
  const mmrRange     = Math.max(1, maxMmr - minMmr);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/50 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/6 px-5 py-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
            MMR Progression
          </div>
          <div className="mt-0.5 text-sm text-white/35">
            Last {data.length} ranked {data.length === 1 ? "result" : "results"}
          </div>
        </div>
        {summary && (
          <div
            className={`text-lg font-black tabular-nums ${
              summary.netDelta >= 0 ? "text-cyan-300" : "text-red-400"
            }`}
          >
            {summary.netDelta >= 0 ? "+" : ""}
            {summary.netDelta} MMR
          </div>
        )}
      </div>

      {/* SVG Chart — Fix B : containerRef mesure la largeur réelle */}
      <div ref={containerRef} className="relative px-5 pt-4">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${chartW} ${CHART_H}`}
          className="h-44 w-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id="mmrAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={tierColor} stopOpacity="0.18" />
              <stop offset="100%" stopColor={tierColor} stopOpacity="0.01" />
            </linearGradient>
            <filter id="mmrGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ligne de référence MMR courant */}
          {summary && (
            <line
              x1={PAD_X}
              y1={PAD_Y + INNER_H - ((summary.currentMmr - minMmr) / mmrRange) * INNER_H}
              x2={chartW - PAD_X}
              y2={PAD_Y + INNER_H - ((summary.currentMmr - minMmr) / mmrRange) * INNER_H}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          )}

          {/* Zone remplie */}
          <path d={areaPath} fill="url(#mmrAreaGrad)" />

          {/* Ligne principale */}
          <path
            d={linePath}
            fill="none"
            stroke={tierColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#mmrGlow)"
          />

          {/* Points win/loss */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.px}
              cy={p.py}
              r={hoveredIdx === i ? 5 : 3}
              fill={p.result === "win" ? "#34d399" : "#f87171"}
              stroke="rgba(0,0,0,0.6)"
              strokeWidth="1.5"
              style={{ transition: "r 0.1s ease" }}
            />
          ))}

          {/* Tooltip */}
          {hoveredPoint !== null && (
            <Tooltip point={hoveredPoint} chartW={chartW} />
          )}
        </svg>

        {/* Labels min/max */}
        <div className="mb-2 flex items-end justify-between text-[10px] tabular-nums text-white/20">
          <span>{minMmr}</span>
          <span>{maxMmr}</span>
        </div>
      </div>

      {/* Summary pills */}
      {summary && (
        <div className="grid grid-cols-4 gap-2 border-t border-white/6 px-5 py-4">
          <SummaryPill
            label="Current"
            value={summary.currentMmr.toLocaleString()}
            color="text-white"
          />
          <SummaryPill
            label="Peak"
            value={summary.peakMmr.toLocaleString()}
            color="text-amber-400"
          />
          <SummaryPill
            label="Win rate"
            value={`${summary.winRate}%`}
            color={summary.winRate >= 50 ? "text-emerald-400" : "text-red-400/80"}
          />
          <SummaryPill
            label="W / L"
            value={`${summary.wins} / ${summary.losses}`}
          />
        </div>
      )}
    </div>
  );
}
