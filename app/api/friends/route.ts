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

  const { data: friendships, error } = await admin
    .from("friendships")
    .select("id, status, created_at, requester_id, addressee_id")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const otherIds = (friendships ?? []).map((f) => f.requester_id === user.id ? f.addressee_id : f.requester_id);
  const { data: profiles } = await admin.from("profiles").select("id, username, display_name, avatar_url")
    .in("id", otherIds.length > 0 ? otherIds : ["00000000-0000-0000-0000-000000000000"]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const enriched = (friendships ?? []).map((f) => {
    const otherId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
    return { id: f.id, status: f.status, direction: f.requester_id === user.id ? "sent" : "received", friend: profileMap.get(otherId) ?? { id: otherId }, created_at: f.created_at };
  });

  return NextResponse.json({
    friends: enriched.filter((f) => f.status === "accepted"),
    pending: enriched.filter((f) => f.status === "pending"),
    blocked: enriched.filter((f) => f.status === "blocked" && f.direction === "sent"),
  });
}
