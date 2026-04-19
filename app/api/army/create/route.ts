import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { unitIds, name, clubId } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: group } = await supabase
    .from("army_groups")
    .insert({ name, club_id: clubId })
    .select()
    .single();

  if (!group) {
    return NextResponse.json({ success: false });
  }

  const inserts = unitIds.map((u: string) => ({
    group_id: group.id,
    unit_id: u,
  }));

  await supabase.from("army_group_units").insert(inserts);

  return NextResponse.json({ success: true, group });
}
