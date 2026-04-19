import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

async function auth(jar: Awaited<ReturnType<typeof cookies>>) {
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => jar.getAll(), setAll: () => {} } });
  const { data: { user }, error } = await sb.auth.getUser();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) as ReturnType<typeof createClient<any>>;
  return { user: error ? null : user, admin };
}

export async function POST(req: NextRequest): Promise<Response> {
  const jar = await cookies();
  const { user, admin } = await auth(jar);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { session_id?: string | null } = {};
  try { body = await req.json(); } catch { /* default */ }

  const { data: result, error } = await admin.rpc("leave_queue_atomic", { p_player_id: user.id, p_session_id: body.session_id ?? null });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  void admin
    .rpc("track_event", {
      p_player_id: user.id,
      p_event_type: "queue_cancelled",
      p_properties: { waited_s: result?.waited_s ?? 0 },
    })
    .then(() => undefined, () => undefined);
  return NextResponse.json({ success: true, waited_s: result?.waited_s ?? 0 });
}
