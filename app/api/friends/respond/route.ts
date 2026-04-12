import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function auth(jar: Awaited<ReturnType<typeof cookies>>) {
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => jar.getAll(), setAll: () => {} } });
  const { data: { user }, error } = await sb.auth.getUser();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  return { user: error ? null : user, admin };
}

export async function PATCH(req: NextRequest): Promise<Response> {
  const jar = await cookies();
  const { user, admin } = await auth(jar);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { friendship_id?: string; accept?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.friendship_id || !UUID_RE.test(body.friendship_id))
    return NextResponse.json({ error: "friendship_id required" }, { status: 400 });

  if (body.accept) {
    const { error } = await admin.from("friendships")
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", body.friendship_id)
      .eq("addressee_id", user.id)
      .eq("status", "pending");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    await admin.from("friendships").delete()
      .eq("id", body.friendship_id)
      .or(`addressee_id.eq.${user.id},requester_id.eq.${user.id}`)
      .eq("status", "pending");
  }

  return NextResponse.json({ success: true });
}
