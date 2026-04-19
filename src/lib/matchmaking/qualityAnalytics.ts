/**
 * qualityAnalytics.ts
 * ─────────────────────────────────────────────
 * Lecture serveur de la vue matchmaking_quality_heatmap.
 * Utilisé par app/admin/matchmaking-quality/page.tsx (Server Component).
 */
import { createServiceRoleClient } from "@/integrations/supabase/service-role";

export interface MatchmakingQualityHeatmapCell {
  mmr_diff_bucket:   string;
  wait_bucket:       string;
  matches_count:     number;
  avg_quality_score: number;
  avg_expected_edge: number;
  same_region_rate:  number;
  rematch_rate:      number;
}

export async function getMatchmakingQualityHeatmap(): Promise<MatchmakingQualityHeatmapCell[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("matchmaking_quality_heatmap")
    .select("*");

  if (error) {
    throw new Error(`Failed to load matchmaking quality heatmap: ${error.message}`);
  }

  return (data ?? []) as MatchmakingQualityHeatmapCell[];
}
