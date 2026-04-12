import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await supabase.from("predictions").insert({
    match_id: body.match_id,
    selected_team: body.selected_team ?? body.predicted_winner,
    stake_amount: body.activity_commitment,
    potential_winnings: body.projected_impact,
    odds: body.signal_weight,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ success: true });
}
