import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { recordTick } from "@/lib/rts/engineMetrics";
import { resolveWarMmr } from "@/lib/ranked/resolveWarMmr";

export async function POST() {
  const start = Date.now();

  try {
    const supabase: ReturnType<typeof createClient<any>> = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: territories, error } = await supabase.rpc(
      "get_active_battle_territories",
    );

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    if (!territories || territories.length === 0) {
      recordTick(Date.now() - start, {
        activeTerritories: 0,
        activeBattles: 0,
      });

      return NextResponse.json({
        success: true,
        message: "No battles",
      });
    }

    let processed = 0;
    const tickedTerritoryIds: string[] = [];

    for (const t of territories) {
      const territoryId = t.territory_id;

      const { data: locked } = await supabase.rpc("acquire_battle_lock", {
        p_territory_id: territoryId,
      });

      if (!locked) continue;

      try {
        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/battles/tick`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ territoryId }),
        });

        tickedTerritoryIds.push(territoryId);
        processed++;
      } catch (err) {
        console.error("battle tick failed", err);
      } finally {
        await supabase.rpc("release_battle_lock", {
          p_territory_id: territoryId,
        });
      }
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/battles/projectile-impact`,
      { method: "POST" },
    );

    if (tickedTerritoryIds.length > 0) {
      const { data: resolvedWars, error: warsError } = await supabase
        .from("club_wars")
        .select("id")
        .in("territory_id", tickedTerritoryIds)
        .not("winner_club_id", "is", null)
        .eq("mmr_resolved", false)
        .not("attacker_player_id", "is", null)
        .not("defender_player_id", "is", null);

      if (warsError) {
        console.error("[MMR] Failed to fetch resolved wars:", warsError.message);
      } else if (resolvedWars && resolvedWars.length > 0) {
        const batchSize = 10;

        for (let i = 0; i < resolvedWars.length; i += batchSize) {
          const batch = resolvedWars.slice(i, i + batchSize) as { id: string }[];

          await Promise.all(
            batch.map(async (war) => {
              const result = await resolveWarMmr(war.id);

              if (result.status === "error") {
                console.error(`[MMR] Failed for war ${war.id}:`, result.message);
                return;
              }

              if (result.status === "resolved") {
                const { elo } = result;
                console.log(
                  `[MMR] War ${war.id} resolved -`,
                  `Winner: ${elo.attackerWon ? "attacker" : "defender"} |`,
                  `Attacker: ${elo.attackerOld}->${elo.attackerNew}`,
                  `(${elo.attackerDelta >= 0 ? "+" : ""}${elo.attackerDelta}) |`,
                  `Defender: ${elo.defenderOld}->${elo.defenderNew}`,
                  `(${elo.defenderDelta >= 0 ? "+" : ""}${elo.defenderDelta})`,
                );
              }
            }),
          );
        }
      }
    }

    const duration = Date.now() - start;

    recordTick(duration, {
      activeTerritories: territories.length,
      activeBattles: processed,
    });

    return NextResponse.json({
      success: true,
      processed,
      duration,
    });
  } catch (error) {
    const duration = Date.now() - start;

    recordTick(duration);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
