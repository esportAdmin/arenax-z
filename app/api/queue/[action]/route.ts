/**
 * app/api/queue/join/route.ts    — POST rejoindre la queue
 * app/api/queue/leave/route.ts   — POST quitter la queue
 * app/api/queue/ready/route.ts   — POST accepter/refuser un match
 * app/api/queue/status/route.ts  — GET statut courant
 *
 * Toutes les opérations critiques passent par des RPCs atomiques.
 * Rate limiting : via check_and_increment_rate_limit (atomique).
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from "@supabase/ssr";
import { createClient }       from "@supabase/supabase-js";
import { cookies, headers }   from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function authAndAdmin(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  const { data: { user }, error } = await supabaseAuth.auth.getUser();
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  ) as ReturnType<typeof createClient<any>>;

  return { user: error ? null : user, admin };
}

async function getIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

// ─────────────────────────────────────────────
// POST /api/queue/join
// ─────────────────────────────────────────────
export async function POST_join(req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const { user, admin } = await authAndAdmin(cookieStore);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rate limit atomique
  const ip = await getIp();
  const { data: rl } = await admin.rpc("check_and_increment_rate_limit", {
    p_player_id:      user.id,
    p_ip_address:     ip,
    p_action:         "queue_join",
    p_max_per_player: 10,
    p_max_per_ip:     30,
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

  let body: { queue_type?: string; region?: string };
  try { body = await req.json(); }
  catch { body = {}; }

  const queueType = body.queue_type === "casual" ? "casual" : "ranked";

  // Join atomique — empêche le double join concurrent
  const { data: result, error: rpcError } = await admin.rpc("join_queue_atomic", {
    p_player_id:  user.id,
    p_queue_type: queueType,
    p_region:     body.region ?? null,
  });

  if (rpcError) {
    console.error("[queue/join] RPC error:", rpcError.message);
    return NextResponse.json({ error: "Failed to join queue" }, { status: 500 });
  }

  if (!result?.success) {
    return NextResponse.json(
      { error: "Already in queue", session_id: result?.session_id },
      { status: 409 },
    );
  }

  // Analytics
  void admin
    .rpc("track_event", {
      p_player_id: user.id,
      p_event_type: "queue_joined",
      p_properties: { queue_type: queueType, region: body.region ?? null },
    })
    .then(() => undefined, () => undefined);

  return NextResponse.json({
    success:          true,
    session_id:       result.session_id,
    estimated_wait_s: result.estimated_wait_s,
    queue_type:       result.queue_type,
  });
}

// ─────────────────────────────────────────────
// POST /api/queue/leave
// ─────────────────────────────────────────────
export async function POST_leave(req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const { user, admin } = await authAndAdmin(cookieStore);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { session_id?: string };
  try { body = await req.json(); }
  catch { body = {}; }

  const { data: result, error } = await admin.rpc("leave_queue_atomic", {
    p_player_id:  user.id,
    p_session_id: body.session_id ?? null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  void admin
    .rpc("track_event", {
      p_player_id: user.id,
      p_event_type: "queue_cancelled",
      p_properties: { waited_s: result?.waited_s ?? 0 },
    })
    .then(() => undefined, () => undefined);

  return NextResponse.json({ success: true, waited_s: result?.waited_s ?? 0 });
}

// ─────────────────────────────────────────────
// POST /api/queue/ready
// ─────────────────────────────────────────────
export async function POST_ready(req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const { user, admin } = await authAndAdmin(cookieStore);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { warId?: string; accept?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.warId) {
    return NextResponse.json({ error: "warId required" }, { status: 400 });
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(body.warId)) {
    return NextResponse.json({ error: "Invalid warId" }, { status: 400 });
  }

  // Réponse atomique via RPC (gère toute la logique)
  // Le RPC utilise auth.uid() — on passe via supabaseAuth (pas admin)
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  const { data: result, error } = await supabaseAuth.rpc("respond_ready_check_atomic", {
    p_war_id: body.warId,
    p_accept: body.accept ?? true,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  // Si tous ont accepté → déclencher le démarrage du match
  if (result?.all_accepted) {
    // Non-bloquant — le moteur RTS gère la suite
    void admin
      .rpc("track_event", {
        p_player_id: user.id,
        p_event_type: "match_started",
        p_properties: { war_id: body.warId },
      })
      .then(() => undefined, () => undefined);
  }

  return NextResponse.json({
    success:      true,
    all_accepted: result?.all_accepted ?? false,
    any_declined: result?.any_declined ?? false,
    accepted:     result?.accepted ?? body.accept,
    war_id:       body.warId,
  });
}

// ─────────────────────────────────────────────
// GET /api/queue/status
// ─────────────────────────────────────────────
export async function GET_status(_req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const { user, admin } = await authAndAdmin(cookieStore);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: session } = await admin
    .from("queue_sessions")
    .select("id, status, queue_type, estimated_wait_s, created_at, war_id, expires_at")
    .eq("player_id", user.id)
    .in("status", ["searching", "match_found"])
    .order("created_at", { ascending: false })
    .maybeSingle();

  if (!session) {
    return NextResponse.json({ in_queue: false });
  }

  const waited_s = Math.round(
    (Date.now() - new Date(session.created_at).getTime()) / 1000,
  );

  // Si match trouvé, récupérer le ready check
  let ready_check = null;
  if (session.status === "match_found" && session.war_id) {
    const { data: rc } = await admin
      .from("ready_checks")
      .select("status, expires_at")
      .eq("war_id",    session.war_id)
      .eq("player_id", user.id)
      .maybeSingle();
    ready_check = rc;
  }

  return NextResponse.json({
    in_queue:    true,
    session: {
      ...session,
      waited_s,
      ready_check,
    },
  });
}
