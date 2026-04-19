/**
 * app/api/replay/export/route.ts
 * POST — Crée un job d'export highlight reel.
 * Corps JSON : { warId: string }
 */
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getBattleInsights } from "@/lib/replay/battleLogsAdapter";
import { buildHighlightReelManifest } from "@/lib/replay/highlightReel";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: Request): Promise<Response> {
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { warId?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { warId } = body;
  if (!warId || !UUID_RE.test(warId)) return NextResponse.json({ error: "Valid warId required" }, { status: 400 });

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

  if (manifest.clips.length === 0) {
    return NextResponse.json({ error: "No highlight clips available for export" }, { status: 422 });
  }

  const { data: job, error: insertError } = await supabaseAdmin
    .from("replay_export_jobs")
    .insert({ war_id: war.id, requested_by: user.id, manifest, status: "pending" })
    .select("id, status, created_at")
    .maybeSingle();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ success: true, job, manifest });
}
