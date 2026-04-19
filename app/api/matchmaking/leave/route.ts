import { NextResponse } from "next/server";
import { createClient } from "@/integrations/supabase/server";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const playerId = user.id;

  const { error } = await supabase
    .from("matchmaking_queue")
    .update({ status: "cancelled" })
    .eq("player_id", playerId)
    .eq("status", "searching");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
