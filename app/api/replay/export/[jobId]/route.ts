/**
 * app/api/replay/export/[jobId]/route.ts
 * ─────────────────────────────────────────────────────────────────────
 * GET — Statut d'un job d'export + URL de téléchargement signée.
 *
 * Réponse :
 *   { job: { id, status, created_at, started_at, completed_at },
 *     downloadUrl: string | null }
 *
 * downloadUrl est une URL Supabase Storage signée (1h) générée
 * uniquement si status = "completed" et output_path est renseigné.
 *
 * Sécurité :
 *   - Auth vérifiée avant tout accès
 *   - Le job doit avoir été créé par l'utilisateur courant (requested_by)
 *     OU l'utilisateur est participant de la war (attacker/defender)
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Bucket Supabase Storage où le worker dépose les exports */
const EXPORT_BUCKET = process.env.REPLAY_EXPORT_BUCKET ?? "replay-exports";

/** Durée de validité de l'URL signée en secondes */
const SIGNED_URL_TTL_S = 3600; // 1h

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<Response> {
  const { jobId } = await params;

  if (!UUID_RE.test(jobId)) {
    return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
  }

  // ── Auth ──────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // ── Lecture du job ────────────────────────────────────────────────
  const { data: job, error: jobError } = await supabaseAdmin
    .from("replay_export_jobs")
    .select("id, war_id, requested_by, status, output_path, created_at, started_at, completed_at, error_message")
    .eq("id", jobId)
    .maybeSingle();

  if (jobError) {
    console.error("[export/job] DB error:", jobError.message);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  // ── Vérification accès — créateur OU participant à la war ─────────
  const isCreator = job.requested_by === user.id;

  if (!isCreator) {
    // Vérifier si l'utilisateur est participant à la war liée
    const { data: war } = await supabaseAdmin
      .from("club_wars")
      .select("attacker_player_id, defender_player_id")
      .eq("id", job.war_id)
      .maybeSingle();

    const isParticipant = war && (
      war.attacker_player_id === user.id ||
      war.defender_player_id === user.id
    );

    if (!isParticipant) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // ── URL signée si completed ───────────────────────────────────────
  let downloadUrl: string | null = null;

  if (job.status === "completed" && job.output_path) {
    const { data: signed, error: signError } = await supabaseAdmin
      .storage
      .from(EXPORT_BUCKET)
      .createSignedUrl(job.output_path, SIGNED_URL_TTL_S);

    if (signError) {
      // Non-bloquant : le job est completed même si l'URL échoue
      console.warn("[export/job] signed URL error:", signError.message);
    } else {
      downloadUrl = signed?.signedUrl ?? null;
    }
  }

  return NextResponse.json({
    job: {
      id:           job.id,
      status:       job.status,
      created_at:   job.created_at,
      started_at:   job.started_at,
      completed_at: job.completed_at,
      error_message: job.status === "failed" ? job.error_message : null,
    },
    downloadUrl,
  });
}
