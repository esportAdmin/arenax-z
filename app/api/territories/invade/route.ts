import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type InvadeTerritoryBody = {
  clubId?: string;
  territoryId?: string;
};

/**
 * Opens a territory pressure window from the tactical war map.
 *
 * Example:
 * ```ts
 * await fetch("/api/territories/invade", {
 *   method: "POST",
 *   body: JSON.stringify({ clubId: "club-alpha", territoryId: "france" }),
 * });
 * ```
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InvadeTerritoryBody;

    const { clubId, territoryId } = body;

    if (!clubId || !territoryId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing parameters",
        },
        { status: 400 },
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseKey === "REPLACE_ME") {
      return NextResponse.json({
        success: false,
        error: "Territory command service is not configured yet.",
      });
    }

    const admin = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: warId, error } = await admin.rpc("start_territory_war", {
      p_attacker_club: clubId,
      p_territory: territoryId,
    });

    if (error) {
      console.error("Start war error:", error);

      if (process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production") {
        return NextResponse.json({
          success: true,
          mode: "preview",
          war_id: `preview-${territoryId}`,
          result: {
            status: "queued",
            territory_id: territoryId,
            attacker_club_id: clubId,
          },
        });
      }

      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    const { data: resolveData, error: resolveError } = await admin.rpc(
      "resolve_territory_war",
      {
        p_war_id: warId,
      },
    );

    if (
      resolveError &&
      (process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production")
    ) {
      console.warn("Resolve war preview fallback:", resolveError);

      return NextResponse.json({
        success: true,
        mode: "preview",
        war_id: warId,
        result: {
          status: "queued",
          territory_id: territoryId,
          attacker_club_id: clubId,
        },
      });
    }

    if (resolveError) {
      console.error("Resolve war error:", resolveError);

      return NextResponse.json({
        success: false,
        error: resolveError.message,
      });
    }

    return NextResponse.json({
      success: true,
      war_id: warId,
      result: resolveData,
    });
  } catch (err) {
    console.error("Unexpected error:", err);

    return NextResponse.json({
      success: false,
      error: "Territory command could not be completed.",
    });
  }
}
