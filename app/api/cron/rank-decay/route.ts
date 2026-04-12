import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/integrations/supabase/service-role";
import { applyDecayBatch } from "@/lib/ranked/rankProgression";

/**
 * POST /api/cron/rank-decay
 * ─────────────────────────────────────────────
 * Applique le decay MMR sur les joueurs Diamond inactifs.
 * À déclencher toutes les 24h (Vercel cron ou pg_cron).
 *
 * Protection : header x-cron-secret obligatoire.
 *
 * vercel.json :
 *   { "crons": [{ "path": "/api/cron/rank-decay", "schedule": "0 3 * * *" }] }
 */
export async function POST(req: Request): Promise<Response> {
  // ── Auth cron ──────────────────────────────────────────────────────
  const secret = req.headers.get("x-cron-secret") ?? "";
  const expected = process.env.CRON_SECRET ?? "";

  if (expected && secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();
    const now = Date.now();

    // Récupérer la saison active
    const { data: season, error: seasonError } = await supabase
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .maybeSingle();

    if (seasonError) throw seasonError;

    if (!season?.id) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: "no_active_season",
      });
    }

    const affected = await applyDecayBatch(season.id, now);

    console.log(`[rank-decay] cycle complete: ${affected} players affected`);

    return NextResponse.json({
      success: true,
      season_id: season.id,
      affected,
      timestamp: new Date(now).toISOString(),
    });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[rank-decay] failed:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
