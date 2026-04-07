import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function auth(jar: Awaited<ReturnType<typeof cookies>>) {
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => jar.getAll(), setAll: () => {} } });
  const { data: { user }, error } = await sb.auth.getUser();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) as ReturnType<typeof createClient<any>>;
  return { user: error ? null : user, admin, sb };
}

export async function POST(req: NextRequest): Promise<Response> {
  const jar = await cookies();
  const { user, admin, sb } = await auth(jar);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { warId?: string; accept?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.warId || !UUID_RE.test(body.warId)) return NextResponse.json({ error: "Valid warId required" }, { status: 400 });

  // RPC via sb (anon) pour que auth.uid() fonctionne
  const { data: result, error } = await sb.rpc("respond_ready_check_atomic", { p_war_id: body.warId, p_accept: body.accept ?? true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (result?.error) return NextResponse.json({ error: result.error }, { status: 404 });

  if (result?.all_accepted) {
    void admin
      .rpc("track_event", {
        p_player_id: user.id,
        p_event_type: "match_started",
        p_properties: { war_id: body.warId },
      })
      .then(() => undefined, () => undefined);
  }

  return NextResponse.json({ success: true, all_accepted: result?.all_accepted ?? false, any_declined: result?.any_declined ?? false, war_id: body.warId });
}
