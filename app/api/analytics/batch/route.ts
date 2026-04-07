/**
 * app/api/analytics/batch/route.ts
 * ─────────────────────────────────────────────────────────────────────
 * POST /api/analytics/batch
 * Reçoit des événements du hook useAnalytics() et les insère en DB.
 * Auth optionnelle — on track aussi les sessions anonymes.
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from "@supabase/ssr";
import { createClient }       from "@supabase/supabase-js";
import { cookies }            from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const MAX_EVENTS_PER_BATCH = 25;

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  // Auth optionnelle
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  const { data: { user } } = await supabaseAuth.auth.getUser();

  let body: { events?: unknown[] };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!Array.isArray(body.events) || body.events.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 });
  }

  // Limiter la taille du batch
  const events = body.events.slice(0, MAX_EVENTS_PER_BATCH);

  const rows = events
    .filter((e): e is { event_type: string; properties?: Record<string, unknown> } =>
      typeof (e as Record<string, unknown>).event_type === "string"
    )
    .map((e) => ({
      player_id:  user?.id ?? null,
      event_type: e.event_type,
      properties: e.properties ?? {},
    }));

  if (rows.length === 0) {
    return NextResponse.json({ ok: true, inserted: 0 });
  }

  const supabase = getAdmin();
  const { error } = await supabase.from("analytics_events").insert(rows);

  if (error) {
    // Non-bloquant — ne pas exposer l'erreur au client
    console.warn("[analytics/batch] insert error:", error.message);
  }

  return NextResponse.json({ ok: true, inserted: rows.length });
}
