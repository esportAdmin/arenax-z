"use client";

import type { MatchmakingQualityHeatmapCell } from "@/lib/matchmaking/qualityAnalytics";

interface Props {
  cells: MatchmakingQualityHeatmapCell[];
}

const MMR_BUCKETS  = ["0-49", "50-99", "100-199", "200-299", "300+"] as const;
const WAIT_BUCKETS = ["0-29s", "30-59s", "1-2m", "2-5m", "5m+"] as const;

function findCell(
  cells: MatchmakingQualityHeatmapCell[],
  mmr: string,
  wait: string,
): MatchmakingQualityHeatmapCell | null {
  return cells.find((c) => c.mmr_diff_bucket === mmr && c.wait_bucket === wait) ?? null;
}

function cellStyle(score: number | null): string {
  if (score == null) return "border-white/6 bg-white/3 text-white/25";
  if (score >= 80)   return "border-emerald-500/20 bg-emerald-500/8 text-emerald-300";
  if (score >= 60)   return "border-cyan-500/20 bg-cyan-500/8 text-cyan-300";
  if (score >= 40)   return "border-amber-500/20 bg-amber-500/8 text-amber-300";
  return "border-red-500/20 bg-red-500/8 text-red-300";
}

export function MatchmakingQualityHeatmap({ cells }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/8 bg-black/50 backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/6 px-5 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
          Matchmaking Quality Heatmap
        </div>
        <div className="mt-0.5 text-sm text-white/30">
          Rows: MMR diff · Columns: max queue wait
        </div>
      </div>

      <div className="overflow-x-auto p-5">
        <div className="grid min-w-[700px] grid-cols-[100px_repeat(5,1fr)] gap-2">
          {/* Headers colonnes */}
          <div />
          {WAIT_BUCKETS.map((wb) => (
            <div key={wb} className="px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-widest text-white/30">
              {wb}
            </div>
          ))}

          {/* Lignes */}
          {MMR_BUCKETS.map((mb) => (
            <div key={mb} className="contents">
              {/* Label ligne */}
              <div className="flex items-center px-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
                ±{mb}
              </div>

              {WAIT_BUCKETS.map((wb) => {
                const cell = findCell(cells, mb, wb);
                const score = cell?.avg_quality_score ?? null;

                return (
                  <div
                    key={`${mb}-${wb}`}
                    className={`rounded-xl border p-3 transition-colors ${cellStyle(score)}`}
                  >
                    {/* Score principal */}
                    <div className="text-lg font-black tabular-nums">
                      {score != null ? `${score}%` : "—"}
                    </div>

                    {/* Nombre de matchs */}
                    <div className="mt-1 text-[10px] text-white/35">
                      {cell?.matches_count ?? 0} matches
                    </div>

                    {/* Métriques secondaires */}
                    {cell && (
                      <div className="mt-2 space-y-0.5 text-[10px] text-white/30">
                        <div>Edge: {cell.avg_expected_edge}%</div>
                        <div>Same region: {Math.round(cell.same_region_rate * 100)}%</div>
                        <div>Rematch: {Math.round(cell.rematch_rate * 100)}%</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
