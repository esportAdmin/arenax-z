import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  try {
    const supabase = createClient(
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
      return NextResponse.json({
        success: true,
        processed: 0,
      });
    }

    const results = await Promise.allSettled(
      territories.map(async (t: any) => {
        const territoryId = t.territory_id;

        // 🔒 lock
        const { data: locked } = await supabase.rpc("acquire_battle_lock", {
          p_territory_id: territoryId,
        });

        if (!locked) return false;

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/battles/tick`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ territoryId }),
            },
          );

          const json = await res.json();

          return json.success === true;
        } catch (err) {
          console.error("battle tick failed", err);
          return false;
        } finally {
          await supabase.rpc("release_battle_lock", {
            p_territory_id: territoryId,
          });
        }
      }),
    );

    const processed = results.filter(
      (r) => r.status === "fulfilled" && r.value === true,
    ).length;

    return NextResponse.json({
      success: true,
      processed,
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
