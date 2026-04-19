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
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) as ReturnType<typeof createClient<any>>;
  return { user: error ? null : user, admin };
}

export async function POST(req: NextRequest): Promise<Response> {
  const jar = await cookies();
  const { user, admin } = await auth(jar);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { target_id?: string; username?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  let targetId = body.target_id;
  if (!targetId && body.username) {
    const { data: p } = await admin.from("profiles").select("id").eq("username", body.username.toLowerCase()).maybeSingle();
    targetId = p?.id;
  }

  if (!targetId || !UUID_RE.test(targetId)) return NextResponse.json({ error: "Player not found" }, { status: 404 });
  if (targetId === user.id) return NextResponse.json({ error: "Cannot add yourself" }, { status: 422 });

  const pair = normalizePair(user.id, targetId);
  const { data: existing } = await admin.from("friendships").select("id, status").match(pair).maybeSingle();

  if (existing?.status === "accepted") return NextResponse.json({ error: "Already friends" }, { status: 409 });
  if (existing?.status === "blocked")  return NextResponse.json({ error: "Cannot send request" }, { status: 403 });
  if (existing?.status === "pending")  return NextResponse.json({ error: "Request already sent" }, { status: 409 });

  const { error } = await admin.from("friendships").insert({ ...pair, status: "pending" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  void admin
    .from("notifications")
    .insert({
      player_id: targetId,
      type: "friend_request",
      title: "Friend Request",
      body: "You have a new friend request.",
      data: { requester_id: user.id },
    })
    .then(() => undefined, () => undefined);
  return NextResponse.json({ success: true });
}
