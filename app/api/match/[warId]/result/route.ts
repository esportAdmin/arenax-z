/**
 * app/api/match/[warId]/result/route.ts
 * ─────────────────────────────────────────────────────────────────────
 * Route API dédiée à la lecture des données post-game.
 *
 * Avantages vs createClient(SERVICE_ROLE_KEY) inline dans la page :
 *   - Le service role key ne transite JAMAIS dans le bundle Next.js
 *     (même en Server Component, un import dynamique peut fuir en edge)
 *   - La route est testable indépendamment (curl, Postman, tests)
 *   - Séparation auth / data claire : la page ne fait qu'un fetch
 *   - Réutilisable par d'autres surfaces (mobile, broadcast overlay)
 *
 * Sécurité :
 *   - Auth vérifiée via cookie Supabase avant lecture des données
 *   - Données filtrées : on ne retourne que ce dont l'UI a besoin
 *   - Pas d'exposition de données d'autres joueurs
 *
 * Next.js 15 — params est une Promise.
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getBattleInsights } from "@/lib/replay/battleLogsAdapter";

// Colonnes retournées — seules celles nécessaires au breakdown
const WAR_SELECT = `
  id,
  territory_id,
  challenger_id,
  defender_id,
  winner_club_id,
  attacker_player_id,
  defender_player_id,
  mmr_delta_attacker,
  mmr_delta_defender,
  attacker_mmr_before,
  attacker_mmr_after,
  defender_mmr_before,
  defender_mmr_after,
  win_probability_attacker,
  win_probability_defender,
  match_quality_score,
  match_quality_label,
  mmr_diff_at_match,
  created_at
` as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ warId: string }> },
): Promise<Response> {
  const { warId } = await params;

  // ── 1. Auth — vérifier la session via cookie ──────────────────────
  const cookieStore = await cookies();

  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll:  () => cookieStore.getAll(),
        setAll:  () => {},
      },
    },
  );

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── 2. Lecture war — service role isolé dans la route ────────────
  // SUPABASE_SERVICE_ROLE_KEY est une variable serveur uniquement.
  // Elle ne figure jamais dans NEXT_PUBLIC_* → hors bundle client.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: war, error: warError } = await supabaseAdmin
    .from("club_wars")
    .select(WAR_SELECT)
    .eq("id", warId)
    .maybeSingle();

  if (warError) {
    console.error("[api/match/result] DB error:", warError.message);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!war) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  // ── 3. Vérification accès ────────────────────────────────────────
  // On retourne les données même aux spectateurs — mais on valide
  // que le warId est bien un UUID valide (évite les scans en prod).
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(warId)) {
    return NextResponse.json({ error: "Invalid war ID" }, { status: 400 });
  }

  // ── 4. Battle insights — non-bloquant ───────────────────────────
  // getBattleInsights retourne hasData=false si vide ou erreur.
  // Le panel ne s'affiche que si hasData=true.
  let insights = null;
  if (war.territory_id) {
    insights = await getBattleInsights(war.territory_id, war.created_at ?? null);
    if (!insights.hasData) insights = null;
  }

  // ── 5. Retour des données + identité du viewer ───────────────────
  return NextResponse.json({
    war,
    viewerId: user.id,
    insights,
  });
}
