import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { message: "Season name is required" },
        { status: 400 },
      );
    }

    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      },
    );

    const { data, error } = await supabase.rpc("start_new_season", {
      p_name: name,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      seasonId: data,
      name,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
