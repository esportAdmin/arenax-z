import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const ownerClubId = String(body?.ownerClubId ?? "").trim();

    if (!name || !ownerClubId) {
      return NextResponse.json(
        { message: "name and ownerClubId are required" },
        { status: 400 },
      );
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

    const { data: season } = await supabase
      .from("seasons")
      .select("id")
      .eq("is_active", true)
      .maybeSingle();

    const { data, error } = await supabase.rpc("create_alliance", {
      p_name: name,
      p_description: description || null,
      p_owner_club_id: ownerClubId,
      p_season_id: season?.id ?? null,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      allianceId: data,
      name,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
