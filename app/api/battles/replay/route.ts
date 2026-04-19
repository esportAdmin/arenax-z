import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const territoryId = String(body?.territoryId ?? "").trim();
    const limit       = Math.min(500, Math.max(1, Number(body?.limit ?? 200)));

    if (!territoryId) {
      return NextResponse.json(
        { success: false, message: "territoryId is required" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: logs, error } = await supabase
      .from("battle_logs")
      .select("round, payload, server_ts, units_snapshot")
      .eq("territory_id", territoryId)
      .order("round", { ascending: true })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    const frames = (logs ?? []).map((row: any) => {
      const events: any[] = Array.isArray(row.payload) ? row.payload : [];
      // units_snapshot : positions spatiales de chaque unité vivante après ce round
      const units: any[]  = Array.isArray(row.units_snapshot) ? row.units_snapshot : [];

      const totalDamage  = events.reduce((s: number, e: any) => s + Number(e.damage ?? 0), 0);
      const kills        = events.filter((e: any) => e.isKill === true).length;
      const ultimates    = events.filter((e: any) => e.type === "ultimate").length;
      const teamCalls    = events.filter((e: any) => e.type === "team_call").length;
      const crits        = events.filter((e: any) => e.crit === true).length;
      const formations   = [...new Set(events.map((e: any) => e.formationType).filter(Boolean))];
      const teamFocusIds = [...new Set(events.map((e: any) => e.teamFocusTargetId).filter(Boolean))];

      return {
        round:    Number(row.round ?? 0),
        serverTs: row.server_ts ?? null,
        events,
        units,
        meta: {
          totalDamage, kills, ultimates, teamCalls, crits,
          formations, teamFocusIds,
          // isHighlight : seuil plus élevé = highlights plus rares = plus impactants
          // (kills >= 2 OU ultimates >= 2 OU burst de dégâts > 100 en un round)
          isHighlight: kills >= 2 || ultimates >= 2 || totalDamage > 100,
        },
      };
    });

    return NextResponse.json({
      success: true,
      territoryId,
      frameCount: frames.length,
      frames,
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
