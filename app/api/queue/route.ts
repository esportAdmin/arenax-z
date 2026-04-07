/**
 * app/api/queue/route.ts
 * ─────────────────────────────────────────────────────────────────────
 * GET  /api/queue        — statut de la queue du joueur courant
 * POST /api/queue/join   — rejoindre la queue
 * POST /api/queue/leave  — quitter la queue
 *
 * Rate limiting : 10 join/min par player, 30 join/min par IP.
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from "@supabase/ssr";
import { createClient }       from "@supabase/supabase-js";
import { cookies, headers }   from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function getUser(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  return supabase.auth.getUser();
}

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  ) as ReturnType<typeof createClient<any>>;
}

async function checkRateLimit(
  supabase: ReturnType<typeof getAdmin>,
  playerId: string,
  ip: string,
  action: string,
  maxPerPlayer: number,
  maxPerIp: number,
): Promise<{ allowed: boolean; reason?: string }> {
  const windowStart = new Date(Math.floor(Date.now() / 60_000) * 60_000).toISOString();

  // Check player
  const { data: playerRow } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("player_id", playerId)
    .eq("action",    action)
    .eq("window_start", windowStart)
    .maybeSingle();

  if ((playerRow?.count ?? 0) >= maxPerPlayer) {
    return { allowed: false, reason: "Rate limit exceeded — try again in a minute" };
  }

  // Check IP
  const { data: ipRow } = await supabase
    .from("rate_limits")
    .select("count")
    .eq("ip_address", ip)
    .eq("action",     action)
    .eq("window_start", windowStart)
    .maybeSingle();

  if ((ipRow?.count ?? 0) >= maxPerIp) {
    return { allowed: false, reason: "Too many requests from this IP" };
  }

  // Incrémenter
  void supabase
    .rpc("upsert_rate_limit", {
      p_player_id: playerId,
      p_ip_address: ip,
      p_action: action,
      p_window_start: windowStart,
    })
    .then(() => undefined, () => undefined);

  return { allowed: true };
}

// ─────────────────────────────────────────────
// GET /api/queue — statut courant
// ─────────────────────────────────────────────
export async function GET(_req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const { data: { user }, error } = await getUser(cookieStore);

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdmin();

  const { data: session } = await supabase
    .from("queue_sessions")
    .select("id, status, queue_type, estimated_wait_s, created_at, war_id")
    .eq("player_id", user.id)
    .in("status", ["searching", "match_found"])
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ inQueue: false });
  }

  const waitedS = Math.round((Date.now() - new Date(session.created_at).getTime()) / 1000);

  return NextResponse.json({
    inQueue:    true,
    session: {
      ...session,
      waited_s: waitedS,
    },
  });
}
