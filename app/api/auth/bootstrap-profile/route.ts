import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  ) as ReturnType<typeof createClient<any>>;
}

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = String(user.app_metadata?.provider ?? "");
  if (provider !== "discord" && provider !== "twitch") {
    return NextResponse.json({ success: true, skipped: true });
  }

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.user_metadata?.preferred_username ??
    user.email?.split("@")[0] ??
    "Commander";

  const avatarUrl =
    user.user_metadata?.avatar_url ??
    user.user_metadata?.picture ??
    null;

  const providerId =
    user.user_metadata?.provider_id ??
    user.user_metadata?.sub ??
    null;

  const admin = getAdminClient();
  const { error: upsertError } = await admin.from("profiles").upsert(
    {
      id: user.id,
      display_name: String(displayName),
      avatar_url: avatarUrl ? String(avatarUrl) : null,
      discord_id:
        provider === "discord" && providerId ? String(providerId) : null,
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (upsertError) {
    return NextResponse.json(
      { error: upsertError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
