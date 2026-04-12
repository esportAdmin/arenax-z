import { NextResponse } from "next/server";
import { createClient } from "@/integrations/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const playerId = user.id;

  // Ensure player stats exist
  await supabase.rpc("ensure_player_ranked_stats", {
    p_player_id: playerId,
  });

  // Get current MMR
  const { data: stats, error: statsError } = await supabase
    .from("player_ranked_stats")
    .select("mmr")
    .eq("player_id", playerId)
    .single();

  if (statsError) {
    return NextResponse.json({ error: statsError.message }, { status: 500 });
  }

  const mmr = stats.mmr;

  // Insert into queue
  const { error: insertError } = await supabase
    .from("matchmaking_queue")
    .insert({
      player_id: playerId,
      mmr,
      search_mmr_min: mmr - 100,
      search_mmr_max: mmr + 100,
      status: "searching",
    });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
