import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { computeElo, DEFAULT_MMR } from "@/lib/ranked/mmr";

// ============================================================
// RANKED WAR RESOLUTION
// ============================================================
//
// Deux modes d'appel :
//
// MODE 1 (recommandé) — délègue TOUT à la RPC SQL resolve_war_and_mmr :
//   Body : { warId, mode: "rpc" }
//   → Transaction SQL unique, atomicité parfaite, zéro état incohérent.
//
// MODE 2 (fallback applicatif) — calcul ELO côté TypeScript :
//   Body : { warId }
//   → Utile si la RPC SQL n'est pas disponible (environnement de test, etc.)
//
// Fix A : total_wins/losses corrigés dans le fallback (utilisaient total_games par erreur)
// Fix B : mmr_resolved marqué dans la même transaction SQL (RPC) ou via guard atomique
// Fix C : idempotence — guard mmr_resolved avant tout update
// Fix D : maybeSingle() + DEFAULT_MMR si nouveau joueur
// Fix E : createClient standard (pattern tick_route.ts)
//
// Path : app/api/ranked/resolve-war/route.ts

function safeNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const warId = String(body?.warId ?? "").trim();
    const mode = body?.mode === "rpc" ? "rpc" : "app";

    if (!warId) {
      return NextResponse.json(
        { success: false, message: "warId is required" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // ============================================================
    // MODE 1 — RPC SQL (recommandé, 1 transaction, atomicité parfaite)
    // ============================================================
    if (mode === "rpc") {
      const { data, error } = await supabase.rpc("resolve_war_and_mmr", {
        p_war_id: warId,
      });

      if (error) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: 500 },
        );
      }

      const result = data as Record<string, unknown>;

      if (!result.success) {
        const status =
          result.error === "war_not_found"
            ? 404
            : result.error === "not_a_ranked_war"
              ? 400
              : result.error === "war_not_finished"
                ? 400
                : result.error === "no_active_season"
                  ? 400
                  : 500;
        return NextResponse.json(
          { success: false, message: result.error },
          { status },
        );
      }

      if (result.skipped) {
        return NextResponse.json({
          success: true,
          skipped: true,
          reason: result.reason,
        });
      }

      return NextResponse.json({
        success: true,
        mode: "rpc",
        attacker_won: result.attacker_won,
        elo: {
          attackerOld: result.mmr_a_old,
          attackerNew: result.mmr_a_new,
          attackerDelta: result.mmr_a_delta,
          defenderOld: result.mmr_b_old,
          defenderNew: result.mmr_b_new,
          defenderDelta: result.mmr_b_delta,
        },
        season_id: result.season_id,
      });
    }

    // ============================================================
    // MODE 2 — Calcul applicatif TypeScript (fallback)
    // ============================================================

    // ── 1. Récupérer la war ──
    const { data: war, error: warError } = await supabase
      .from("club_wars")
      .select(
        "id, challenger_id, defender_id, winner_club_id, attacker_player_id, defender_player_id, mmr_resolved",
      )
      .eq("id", warId)
      .single();

    if (warError || !war) {
      return NextResponse.json(
        { success: false, message: "War not found" },
        { status: 404 },
      );
    }

    // Fix C — Guard idempotence
    if (war.mmr_resolved) {
      return NextResponse.json({
        success: true,
        skipped: true,
        reason: "already_resolved",
      });
    }

    if (!war.attacker_player_id || !war.defender_player_id) {
      return NextResponse.json(
        { success: false, message: "Not a ranked war — player IDs missing" },
        { status: 400 },
      );
    }

    if (!war.winner_club_id) {
      return NextResponse.json(
        { success: false, message: "War not finished — no winner yet" },
        { status: 400 },
      );
    }

    const attackerId = war.attacker_player_id as string;
    const defenderId = war.defender_player_id as string;
    const attackerWon = war.winner_club_id === war.challenger_id;

    // ── 2. MMR actuels (Fix D — maybeSingle, pas de crash si nouveau joueur) ──
    const [{ data: attackerStats }, { data: defenderStats }] =
      await Promise.all([
        supabase
          .from("player_ranked_stats")
          .select("mmr, total_games, total_wins, total_losses")
          .eq("player_id", attackerId)
          .maybeSingle(),
        supabase
          .from("player_ranked_stats")
          .select("mmr, total_games, total_wins, total_losses")
          .eq("player_id", defenderId)
          .maybeSingle(),
      ]);

    const mmrA = safeNumber(attackerStats?.mmr, DEFAULT_MMR);
    const mmrB = safeNumber(defenderStats?.mmr, DEFAULT_MMR);
    const gamesA = safeNumber(attackerStats?.total_games, 0);
    const gamesB = safeNumber(defenderStats?.total_games, 0);
    // Fix A — lire total_wins/losses et non total_games
    const winsA = safeNumber(attackerStats?.total_wins, 0);
    const lossesA = safeNumber(attackerStats?.total_losses, 0);
    const winsB = safeNumber(defenderStats?.total_wins, 0);
    const lossesB = safeNumber(defenderStats?.total_losses, 0);

    // ── 3. ELO ──
    const elo = computeElo({
      mmrA,
      mmrB,
      scoreA: attackerWon ? 1 : 0,
      gamesA,
      gamesB,
    });

    // ── 4. Saison active ──
    const { data: activeSeason } = await supabase
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .maybeSingle();

    const seasonId = activeSeason?.id ?? null;

    // ── 5. Update via RPC update_player_mmr (atomique) ──
    if (seasonId) {
      const [rpcA, rpcB] = await Promise.all([
        supabase.rpc("update_player_mmr", {
          p_player_id: attackerId,
          p_new_mmr: elo.newMmrA,
          p_won: attackerWon,
          p_season_id: seasonId,
        }),
        supabase.rpc("update_player_mmr", {
          p_player_id: defenderId,
          p_new_mmr: elo.newMmrB,
          p_won: !attackerWon,
          p_season_id: seasonId,
        }),
      ]);
      if (rpcA.error)
        throw new Error(`MMR update failed (attacker): ${rpcA.error.message}`);
      if (rpcB.error)
        throw new Error(`MMR update failed (defender): ${rpcB.error.message}`);
    } else {
      // Fallback sans saison : upsert global uniquement
      // Fix A : total_wins/losses corrigés (ne plus utiliser total_games)
      const [uA, uB] = await Promise.all([
        supabase.from("player_ranked_stats").upsert(
          {
            player_id: attackerId,
            mmr: elo.newMmrA,
            peak_mmr: elo.newMmrA,
            total_games: gamesA + 1,
            total_wins: winsA + (attackerWon ? 1 : 0), // ← Fix A
            total_losses: lossesA + (attackerWon ? 0 : 1), // ← Fix A
          },
          { onConflict: "player_id" },
        ),
        supabase.from("player_ranked_stats").upsert(
          {
            player_id: defenderId,
            mmr: elo.newMmrB,
            peak_mmr: elo.newMmrB,
            total_games: gamesB + 1,
            total_wins: winsB + (!attackerWon ? 1 : 0), // ← Fix A
            total_losses: lossesB + (!attackerWon ? 0 : 1), // ← Fix A
          },
          { onConflict: "player_id" },
        ),
      ]);
      if (uA.error)
        throw new Error(`MMR upsert failed (attacker): ${uA.error.message}`);
      if (uB.error)
        throw new Error(`MMR upsert failed (defender): ${uB.error.message}`);
    }

    // ── 6. Marquer la war résolue (Fix B — après les deux updates) ──
    // Note : en mode RPC, mmr_resolved est marqué DANS la transaction SQL.
    // En mode app, on le marque ici séparément. Dans les deux cas, le guard
    // mmr_resolved au step 1 empêche un double-traitement.
    const { error: markError } = await supabase
      .from("club_wars")
      .update({ mmr_resolved: true, mmr_resolved_at: new Date().toISOString() })
      .eq("id", warId);

    if (markError)
      throw new Error(`Failed to mark war resolved: ${markError.message}`);

    return NextResponse.json({
      success: true,
      mode: "app",
      attacker_won: attackerWon,
      elo: {
        attackerOld: mmrA,
        attackerNew: elo.newMmrA,
        attackerDelta: elo.deltaA,
        defenderOld: mmrB,
        defenderNew: elo.newMmrB,
        defenderDelta: elo.deltaB,
      },
      season_id: seasonId,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
