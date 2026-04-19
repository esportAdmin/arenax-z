import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

async function auth(jar: Awaited<ReturnType<typeof cookies>>) {
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => jar.getAll(), setAll: () => {} } });
  const { data: { user }, error } = await sb.auth.getUser();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  return { user: error ? null : user, admin };
}

export async function GET(_req: NextRequest): Promise<Response> {
  const jar = await cookies();
  const { user, admin } = await auth(jar);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: session } = await admin
    .from("queue_sessions")
    .select("id, status, queue_type, estimated_wait_s, created_at, war_id, expires_at")
    .eq("player_id", user.id)
    .in("status", ["searching", "match_found"])
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (!session) return NextResponse.json({ in_queue: false });

  const waited_s = Math.round((Date.now() - new Date(session.created_at).getTime()) / 1000);

  let ready_check = null;
  if (session.status === "match_found" && session.war_id) {
    const { data: rc } = await admin.from("ready_checks").select("status, expires_at").eq("war_id", session.war_id).eq("player_id", user.id).maybeSingle();
    ready_check = rc;
  }

  return NextResponse.json({ in_queue: true, session: { ...session, waited_s, ready_check } });
}
