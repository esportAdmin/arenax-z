import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function GET() {
  const { data: players } = await supabase.rpc("get_player_leaderboard");

  const { data: clubs } = await supabase.rpc("get_club_leaderboard");

  return NextResponse.json({
    players,
    clubs,
  });
}
