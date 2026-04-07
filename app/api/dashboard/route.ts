import { NextResponse } from "next/server";
import { createClient } from "@/integrations/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return NextResponse.json({
      club: null,
      leaderboard: [],
      matches: [],
    });
  }

  const { data, error } = await supabase.rpc("get_dashboard_data", {
    p_user_id: user.id,
  });

  if (error) {
    console.error(error);
    return NextResponse.json(
      {
        club: null,
        leaderboard: [],
        matches: [],
        error: error.message,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(data);
}
