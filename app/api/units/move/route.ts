import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const unitId = String(body?.unitId ?? "").trim();
    const toTerritoryId = String(body?.toTerritoryId ?? "").trim();

    if (!unitId || !toTerritoryId) {
      return NextResponse.json(
        { success: false, message: "unitId and toTerritoryId are required" },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data, error } = await supabase.rpc("move_unit", {
      p_unit_id: unitId,
      p_to_territory_id: toTerritoryId,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      movementId: data,
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
