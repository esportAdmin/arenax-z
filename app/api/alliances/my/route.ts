import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clubId = searchParams.get("clubId");

  if (!clubId) {
    return NextResponse.json({ alliance: null });
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    },
  );

  // 🔥 GET ALLIANCE
  const { data: allianceData, error: allianceError } = await supabase
    .from("alliance_members")
    .select("alliance_id, alliances(name)")
    .eq("club_id", clubId)
    .maybeSingle();

  if (allianceError || !allianceData) {
    return NextResponse.json({ alliance: null });
  }

  // ⚠️ alliances = ARRAY
  const allianceName =
    Array.isArray(allianceData.alliances) && allianceData.alliances.length > 0
      ? allianceData.alliances[0].name
      : null;

  // 🔥 GET MEMBERS
  const { data: members } = await supabase
    .from("alliance_members")
    .select("club_id, clubs(name)")
    .eq("alliance_id", allianceData.alliance_id);

  const formattedMembers =
    members?.map((m: any) => ({
      club_id: m.club_id,
      club_name:
        Array.isArray(m.clubs) && m.clubs.length > 0 ? m.clubs[0].name : null,
    })) ?? [];

  return NextResponse.json({
    alliance: {
      id: allianceData.alliance_id,
      name: allianceName,
    },
    members: formattedMembers,
  });
}
