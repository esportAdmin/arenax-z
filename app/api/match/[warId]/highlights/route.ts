/**
 * app/api/match/[warId]/highlights/route.ts
 * GET — Highlight reel manifest. warStartedAt passé pour matchTime corrects.
 */
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getBattleInsights } from "@/lib/replay/battleLogsAdapter";
import { buildHighlightReelManifest } from "@/lib/replay/highlightReel";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ warId: string }> },
): Promise<Response> {
  const { warId } = await params;
  if (!UUID_RE.test(warId)) return NextResponse.json({ error: "Invalid war ID" }, { status: 400 });

  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: war, error: warError } = await supabaseAdmin
    .from("club_wars")
    .select("id, territory_id, created_at")
    .eq("id", warId)
    .maybeSingle();

  if (warError) return NextResponse.json({ error: "Database error" }, { status: 500 });
  if (!war)     return NextResponse.json({ error: "Match not found" }, { status: 404 });

  const insights = war.territory_id
    ? await getBattleInsights(war.territory_id, war.created_at ?? null)
    : null;

  const manifest = buildHighlightReelManifest({ warId: war.id, territoryId: war.territory_id, insights });

  return NextResponse.json({ warId: war.id, territoryId: war.territory_id, manifest });
}
