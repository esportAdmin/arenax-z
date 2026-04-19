import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function normalizePair(a: string, b: string) {
  return a < b ? { requester_id: a, addressee_id: b } : { requester_id: b, addressee_id: a };
}

async function auth(jar: Awaited<ReturnType<typeof cookies>>) {
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies: { getAll: () => jar.getAll(), setAll: () => {} } });
  const { data: { user }, error } = await sb.auth.getUser();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  return { user: error ? null : user, admin };
}

export async function DELETE(req: NextRequest): Promise<Response> {
  const jar = await cookies();
  const { user, admin } = await auth(jar);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { friend_id?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.friend_id || !UUID_RE.test(body.friend_id))
    return NextResponse.json({ error: "friend_id required" }, { status: 400 });

  await admin.from("friendships").delete().match({ ...normalizePair(user.id, body.friend_id), status: "accepted" });
  return NextResponse.json({ success: true });
}
