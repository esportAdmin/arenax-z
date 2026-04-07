import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

export async function POST(req: Request) {
  const body = await req.json();

  const { error } = await (supabase as any).from("predictions").insert({
    match_id: body.match_id,
    selected_team: body.predicted_winner,
  });

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ success: true });
}
