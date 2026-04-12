import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const warId = String(body?.warId ?? "").trim();
    const amount = Number(body?.amount ?? 0);
    const clubId =
      body?.clubId !== undefined && body?.clubId !== null
        ? String(body.clubId)
        : null;
    const userId =
      body?.userId !== undefined && body?.userId !== null
        ? String(body.userId)
        : null;

    if (!warId || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload",
        },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error } = await supabase.from("war_contributions").insert({
      war_id: warId,
      user_id: userId,
      club_id: clubId,
      xp: amount,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contribution added",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
