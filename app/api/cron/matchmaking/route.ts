import { NextResponse } from "next/server";
import { runAutomaticMatchmaking } from "@/lib/matchmaking/automatic";

function isAuthorized(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return true;
  }

  const provided =
    req.headers.get("x-cron-secret") ?? req.headers.get("X-Cron-Secret");

  return provided === expected;
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    let body: { limit?: number; triggerBattleLoop?: boolean } = {};

    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const summary = await runAutomaticMatchmaking({
      limit: body.limit,
      triggerBattleLoop: body.triggerBattleLoop,
    });

    return NextResponse.json({
      success: true,
      ...summary,
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
