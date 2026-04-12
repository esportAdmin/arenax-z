import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inviteId = String(body?.inviteId ?? "").trim();

    if (!inviteId) {
      return NextResponse.json(
        { message: "inviteId is required" },
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

    const { error } = await supabase.rpc("decline_alliance_invite", {
      p_invite_id: inviteId,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
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
