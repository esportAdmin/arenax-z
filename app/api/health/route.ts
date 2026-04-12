/**
 * GET /api/health
 * Public uptime probe for the web app and database.
 *
 * Worker heartbeat state is returned as telemetry, but stale workers should not
 * make Vercel preview checks fail while background jobs are not deployed yet.
 */

import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const HEALTHY_THRESHOLD_S = 60;

type WorkerHealth = "healthy" | "degraded" | "not_configured";

type HealthCheckRow = {
  service: string;
  status: string;
  last_ping_at: string | null;
  metadata: Record<string, unknown> | null;
};

export async function GET(): Promise<Response> {
  const start = Date.now();
  const supabase = getAdmin();

  const { data: services, error: dbError } = await supabase
    .from("health_checks")
    .select("service, status, last_ping_at, metadata")
    .returns<HealthCheckRow[]>();

  const dbLatencyMs = Date.now() - start;
  const timestamp = new Date().toISOString();

  if (dbError) {
    return NextResponse.json(
      {
        status: "down",
        app: "healthy",
        database: "down",
        workers: "unknown",
        error: "Database unreachable",
        db_latency_ms: dbLatencyMs,
        timestamp,
      },
      { status: 503 },
    );
  }

  const now = Date.now();
  const enriched = (services ?? []).map((s) => {
    const lastPing = s.last_ping_at ? new Date(s.last_ping_at).getTime() : 0;
    const ageS = Math.round((now - lastPing) / 1000);
    const isStale = ageS > HEALTHY_THRESHOLD_S;

    return {
      service: s.service,
      status: isStale ? "stale" : s.status,
      last_ping_s: ageS,
      metadata: s.metadata,
    };
  });

  const workers: WorkerHealth = enriched.length === 0
    ? "not_configured"
    : enriched.some((s) => s.status === "down" || s.status === "stale" || s.status === "degraded")
      ? "degraded"
      : "healthy";

  return NextResponse.json(
    {
      status: "healthy",
      app: "healthy",
      database: "healthy",
      workers,
      worker_status: workers === "not_configured" ? "degraded" : workers,
      db_latency_ms: dbLatencyMs,
      services: enriched,
      timestamp,
    },
    { status: 200 },
  );
}

// Worker heartbeat endpoint.
export async function POST(req: NextRequest): Promise<Response> {
  const secret = req.headers.get("x-worker-secret");
  const expected = process.env.WORKER_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { service?: string; status?: string; metadata?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.service) {
    return NextResponse.json({ error: "service required" }, { status: 400 });
  }

  const supabase = getAdmin();

  const { error } = await supabase
    .from("health_checks")
    .upsert({
      service: body.service,
      status: body.status ?? "healthy",
      last_ping_at: new Date().toISOString(),
      metadata: body.metadata ?? {},
      updated_at: new Date().toISOString(),
    }, { onConflict: "service" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
