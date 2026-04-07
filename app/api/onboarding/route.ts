/**
 * app/api/onboarding/route.ts
 * ─────────────────────────────────────────────────────────────────────
 * POST /api/onboarding/step   — progresser dans l'onboarding
 * POST /api/onboarding/complete — finaliser l'onboarding
 * POST /api/profile/setup     — configurer le profil initial
 * ─────────────────────────────────────────────────────────────────────
 */

import { createServerClient } from "@supabase/ssr";
import { createClient }       from "@supabase/supabase-js";
import { cookies }            from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  ) as ReturnType<typeof createClient<any>>;
}

async function getUser(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );
  return supabase.auth.getUser();
}

// ─────────────────────────────────────────────
// POST /api/profile/setup
// Premier setup du profil (username, display_name, gdpr_consent)
// ─────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const { data: { user }, error: authError } = await getUser(cookieStore);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    username?:       string;
    display_name?:   string;
    gdpr_consent?:   boolean;
    marketing?:      boolean;
    locale?:         string;
  };

  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  // Validation username
  if (body.username) {
    if (!USERNAME_RE.test(body.username)) {
      return NextResponse.json(
        { error: "Username must be 3-20 chars, letters/numbers/underscore only" },
        { status: 422 },
      );
    }
  }

  if (!body.gdpr_consent) {
    return NextResponse.json({ error: "GDPR consent required" }, { status: 422 });
  }

  const supabase = getAdmin();

  // Vérifier unicité du username
  if (body.username) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", body.username.toLowerCase())
      .neq("id", user.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  // Upsert profil
  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert({
      id:               user.id,
      username:         body.username?.toLowerCase(),
      display_name:     body.display_name ?? body.username,
      gdpr_consent_at:  new Date().toISOString(),
      marketing_consent: body.marketing ?? false,
      locale:           body.locale ?? "en",
      onboarding_step:  1,
    });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // Initialiser les stats ranked
  await supabase
    .from("player_ranked_stats")
    .upsert({ player_id: user.id }, { onConflict: "player_id" });

  // Initialiser l'XP
  await supabase
    .from("player_xp")
    .upsert({ player_id: user.id }, { onConflict: "player_id" });

  // Analytics
  void supabase
    .rpc("track_event", {
      p_player_id: user.id,
      p_event_type: "profile_setup_completed",
      p_properties: { locale: body.locale ?? "en" },
    })
    .then(() => undefined, () => undefined);

  return NextResponse.json({ success: true });
}

// ─────────────────────────────────────────────
// PATCH /api/onboarding/step — progresser
// ─────────────────────────────────────────────
export async function PATCH(req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const { data: { user }, error: authError } = await getUser(cookieStore);

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { step?: number; tutorial_completed?: boolean; completed?: boolean };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const supabase = getAdmin();

  const update: Record<string, unknown> = {};
  if (body.step !== undefined)                update.onboarding_step        = body.step;
  if (body.tutorial_completed !== undefined)   update.tutorial_completed     = body.tutorial_completed;
  if (body.completed)                          update.onboarding_completed   = true;

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.completed) {
    void supabase
      .rpc("track_event", {
        p_player_id: user.id,
        p_event_type: "onboarding_completed",
        p_properties: { step: body.step ?? 0 },
      })
      .then(() => undefined, () => undefined);
  }

  return NextResponse.json({ success: true });
}
