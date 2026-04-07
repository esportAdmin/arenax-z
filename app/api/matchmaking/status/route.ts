import { NextResponse } from "next/server";
import { createClient } from "@/integrations/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("matchmaking_queue")
    .select("*")
    .eq("player_id", user.id)
    .eq("status", "searching")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    inQueue: !!data,
    queue: data || null,
  });
}
