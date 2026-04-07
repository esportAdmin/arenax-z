/**
 * app/api/queue/route.ts
 * GET /api/queue — statut de la queue du joueur courant.
 */

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

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

export async function GET(_req: NextRequest): Promise<Response> {
  const cookieStore = await cookies();
  const {
    data: { user },
    error,
  } = await getUser(cookieStore);

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

  const waitedS = Math.round(
    (Date.now() - new Date(session.created_at).getTime()) / 1000,
  );

  return NextResponse.json({
    inQueue: true,
    session: {
      ...session,
      waited_s: waitedS,
    },
  });
}
