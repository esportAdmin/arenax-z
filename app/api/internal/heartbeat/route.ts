/**
 * app/api/internal/heartbeat/route.ts
 * Endpoint dédié pour les heartbeats des workers.
 * Référencé par : worker/matchmakingWorker.ts:213
 *
 * Alternative à /api/health — permet de séparer
 * le monitoring public (GET /api/health) des pings workers (POST ici).
 */

import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  const secret   = req.headers.get("x-worker-secret");
  const expected = process.env.WORKER_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { service?: string; status?: string; metadata?: Record<string, unknown> };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.service) {
    return NextResponse.json({ error: "service required" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase
    .from("health_checks")
    .upsert({
      service:      body.service,
      status:       body.status ?? "healthy",
      last_ping_at: new Date().toISOString(),
      metadata:     body.metadata ?? {},
      updated_at:   new Date().toISOString(),
    }, { onConflict: "service" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
