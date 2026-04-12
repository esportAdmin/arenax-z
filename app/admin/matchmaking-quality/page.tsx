import { MatchmakingQualityHeatmap } from "@/components/admin/MatchmakingQualityHeatmap";
import { getMatchmakingQualityHeatmap } from "@/lib/matchmaking/qualityAnalytics";

/**
 * /admin/matchmaking-quality
 * Server Component — lit la vue matchmaking_quality_heatmap via service role.
 * Accessible uniquement en interne (à protéger via middleware si nécessaire).
 */
export default async function MatchmakingQualityPage() {
  const cells = await getMatchmakingQualityHeatmap();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-60 -top-60 h-[700px] w-[700px] rounded-full bg-cyan-500/4 blur-[120px]" />
        <div className="absolute -bottom-60 -right-60 h-[700px] w-[700px] rounded-full bg-violet-500/4 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/60">
            ArenaX Analytics
          </div>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Matchmaking Quality
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Pairing quality heatmap — average score, expected edge, same-region rate and rematch frequency.
          </p>
        </div>

        <MatchmakingQualityHeatmap cells={cells} />
      </div>
    </div>
  );
}
