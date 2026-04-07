import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

async function auth(jar: Awaited<ReturnType<typeof cookies>>) {
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => jar.getAll(), setAll: () => {} } },
  );
  const { data: { user }, error } = await sb.auth.getUser();
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!) as ReturnType<typeof createClient<any>>;
  return { user: error ? null : user, admin };
}

export async function POST(req: NextRequest): Promise<Response> {
  const jar = await cookies();
  const { user, admin } = await auth(jar);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const { data: rl } = await admin.rpc("check_and_increment_rate_limit", {
    p_player_id: user.id, p_ip_address: ip,
    p_action: "queue_join", p_max_per_player: 10, p_max_per_ip: 30,
  });

  if (rl && !rl.allowed) {
    return NextResponse.json(
      { error: rl.reason === "player_rate_limit"
          ? "Too many queue requests. Try again in a minute."
          : "Too many requests from this IP.",
        retry_after_s: rl.retry_after_s },
      { status: 429 },
    );
  }

  let body: { queue_type?: string; region?: string; party_id?: string | null } = {};
  try { body = await req.json(); } catch { /* default */ }

  const queueType = body.queue_type === "casual" ? "casual" : "ranked";

  const { data: result, error: rpcError } = await admin.rpc("join_queue_atomic", {
    p_player_id: user.id, p_queue_type: queueType,
    p_region: body.region ?? null, p_party_id: body.party_id ?? null,
  });

  if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 });
  if (!result?.success) return NextResponse.json({ error: "Already in queue", session_id: result?.session_id ?? null }, { status: 409 });

  void admin
    .rpc("track_event", {
      p_player_id: user.id,
      p_event_type: "queue_joined",
      p_properties: { queue_type: queueType },
    })
    .then(() => undefined, () => undefined);

  return NextResponse.json({ success: true, session_id: result.session_id, estimated_wait_s: result.estimated_wait_s, queue_type: result.queue_type });
}
