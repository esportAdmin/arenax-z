import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    /*
    START WAR
    */

    const { data, error } = await (supabase as any).rpc("start_territory_war", {
      p_attacker_club: clubId,
      p_territory: territoryId,
    });

    if (error) {
      console.error("Start war error:", error);

      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    /*
    RESOLVE WAR
    */

    const { data: resolveData, error: resolveError } = await (
      supabase as any
    ).rpc("resolve_territory_war", {
      p_war_id: data,
    });

    if (resolveError) {
      console.error("Resolve war error:", resolveError);

      return NextResponse.json({
        success: false,
        error: resolveError.message,
      });
    }

    return NextResponse.json({
      success: true,
      war_id: data,
      result: resolveData,
    });
  } catch (err) {
    console.error("Unexpected error:", err);

    return NextResponse.json(
      {
        success: false,
        error: "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
