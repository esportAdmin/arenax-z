/**
 * app/api/gdpr/route.ts — version finale
 * Email de confirmation RGPD branché via sendDeletionConfirmationEmail.
 */

import { createServerClient } from "@supabase/ssr";
import { createClient }       from "@supabase/supabase-js";
import { cookies }            from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { sendDeletionConfirmationEmail, sendWelcomeEmail } from "@/lib/email/emailService";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  ) as ReturnType<typeof createClient<any>>;
}

async function getUser(jar: Awaited<ReturnType<typeof cookies>>) {
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => jar.getAll(), setAll: () => {} } },
  );
  return sb.auth.getUser();
}

// ─────────────────────────────────────────────
// POST /api/gdpr/delete-request
// POST /api/gdpr/cancel-deletion
// ─────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<Response> {
  const action = new URL(req.url).pathname.split("/").pop();
  const jar    = await cookies();
  const { data: { user }, error: authError } = await getUser(jar);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdmin();

  if (action === "delete-request") {
    const scheduledFor = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", user.id)
      .maybeSingle();

    const { error } = await supabase
      .from("profiles")
      .update({ data_deletion_requested_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    void supabase
      .rpc("track_event", {
        p_player_id: user.id,
        p_event_type: "gdpr_deletion_requested",
        p_properties: {},
      })
      .then(() => undefined, () => undefined);

    // Email de confirmation — légalement obligatoire RGPD Art. 17
    if (user.email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
      await sendDeletionConfirmationEmail({
        to:           user.email,
        username:     profile?.display_name ?? profile?.username ?? user.email.split("@")[0],
        scheduledFor,
        cancelUrl:    `${appUrl}/account-pending-deletion`,
      }).catch((err) => {
        // Non-bloquant — logguer mais ne pas faire échouer la requête
        console.warn("[gdpr] email send failed:", err);
      });
    }

    return NextResponse.json({
      success:       true,
      message:       "Deletion request received. Your account will be permanently deleted in 30 days.",
      scheduled_for: scheduledFor,
    });
  }

  if (action === "cancel-deletion") {
    const { error } = await supabase
      .from("profiles")
      .update({ data_deletion_requested_at: null })
      .eq("id", user.id)
      .not("data_deletion_requested_at", "is", null);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, message: "Deletion request cancelled." });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ─────────────────────────────────────────────
// GET /api/gdpr/export — portabilité des données (Art. 20)
// ─────────────────────────────────────────────
export async function GET(_req: NextRequest): Promise<Response> {
  const jar = await cookies();
  const { data: { user }, error: authError } = await getUser(jar);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdmin();

  const [
    { data: profile },
    { data: rankedStats },
    { data: mmrHistory },
    { data: matchHistory },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("player_ranked_stats").select("*").eq("player_id", user.id).maybeSingle(),
    supabase.from("player_mmr_history").select("*").eq("player_id", user.id).limit(1000),
    supabase.from("club_wars")
      .select("id, created_at, winner_club_id, mmr_delta_attacker, mmr_delta_defender")
      .or(`attacker_player_id.eq.${user.id},defender_player_id.eq.${user.id}`)
      .limit(500),
  ]);

  const safeProfile = profile
    ? { ...profile, gdpr_consent_at: !!profile.gdpr_consent_at }
    : null;

  return new Response(
    JSON.stringify({
      exported_at:   new Date().toISOString(),
      user_id:       user.id,
      email:         user.email,
      profile:       safeProfile,
      ranked_stats:  rankedStats,
      mmr_history:   mmrHistory ?? [],
      match_history: matchHistory ?? [],
    }, null, 2),
    {
      status:  200,
      headers: {
        "Content-Type":        "application/json",
        "Content-Disposition": `attachment; filename="arena-data-${user.id}.json"`,
      },
    },
  );
}
