import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  buildFormationOffsets,
  buildFormationPriority,
  findWeightedPath,
  type FormationMode,
} from "@/lib/rts/pathfinding";

interface TerritoryRow {
  id: string;
  terrain_type: string | null;
  move_cost: number | null;
  controlling_club_id: string | null;
  lat: number | null;
  lng: number | null;
}

interface AdjacencyRow {
  territory_id?: string;
  adjacent_territory_id?: string;
  from_territory_id?: string;
  to_territory_id?: string;
}

interface UnitRow {
  id: string;
  club_id: string;
  territory_id: string | null;
  speed: number | null;
  status: string | null;
}

type CommandMode = "move" | "attack" | "hold";

function normalizeCommandMode(value: string): CommandMode {
  if (value === "attack") return "attack";
  if (value === "hold") return "hold";
  return "move";
}

function normalizeFormation(value: string): FormationMode {
  if (value === "column") return "column";
  return "line";
}

function dedupePath(path: string[]): string[] {
  const result: string[] = [];
  let previous: string | null = null;

  for (const territoryId of path) {
    if (!territoryId || territoryId === previous) {
      continue;
    }

    result.push(territoryId);
    previous = territoryId;
  }

  return result;
}

function computeSegmentDurationSeconds(params: {
  moveCost: number;
  unitSpeed: number;
  commandMode: CommandMode;
}): number {
  const moveCost = Math.max(1, Number(params.moveCost || 1));
  const unitSpeed = Math.max(1, Number(params.unitSpeed || 1));

  let baseSeconds = moveCost * 60;

  if (params.commandMode === "attack") {
    baseSeconds *= 1.15;
  }

  if (params.commandMode === "hold") {
    baseSeconds *= 0.9;
  }

  const duration = Math.round(baseSeconds / unitSpeed);

  return Math.max(8, duration);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const unitId = String(body?.unitId ?? "").trim();
    const targetTerritoryId = String(body?.targetTerritoryId ?? "").trim();

    const commandMode = normalizeCommandMode(
      String(body?.commandMode ?? body?.command ?? "move"),
    );
    const formation = normalizeFormation(String(body?.formation ?? "line"));

    const formationIndex = Math.max(0, Number(body?.formationIndex ?? 0));
    const formationSize = Math.max(1, Number(body?.formationSize ?? 1));
    const requestedPriority = Number(body?.priority ?? 1);

    if (!unitId || !targetTerritoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "unitId and targetTerritoryId are required",
        },
        { status: 400 },
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: unit, error: unitError } = await supabase
      .from("club_units")
      .select("id, club_id, territory_id, speed, status")
      .eq("id", unitId)
      .single<UnitRow>();

    if (unitError || !unit) {
      return NextResponse.json(
        {
          success: false,
          message: unitError?.message ?? "Unit not found",
        },
        { status: 404 },
      );
    }

    if (!unit.territory_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unit has no current territory",
        },
        { status: 400 },
      );
    }

    if (unit.territory_id === targetTerritoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unit is already on target territory",
        },
        { status: 400 },
      );
    }

    const { data: activeMovement, error: activeMovementError } = await supabase
      .from("unit_movements")
      .select("id, status")
      .eq("unit_id", unitId)
      .in("status", ["queued", "moving", "started"])
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeMovementError) {
      return NextResponse.json(
        {
          success: false,
          message: activeMovementError.message,
        },
        { status: 500 },
      );
    }

    const [
      { data: territories, error: territoriesError },
      { data: edges, error: edgesError },
    ] = await Promise.all([
      supabase
        .from("club_territories")
        .select("id, terrain_type, move_cost, controlling_club_id, lat, lng"),
      supabase.from("territory_adjacency").select("*"),
    ]);

    if (territoriesError) {
      return NextResponse.json(
        {
          success: false,
          message: territoriesError.message,
        },
        { status: 500 },
      );
    }

    if (edgesError) {
      return NextResponse.json(
        {
          success: false,
          message: edgesError.message,
        },
        { status: 500 },
      );
    }

    const nodes: Record<
      string,
      {
        id: string;
        moveCost: number;
        terrainType: string;
        ownerClubId: string | null;
        lat: number | null;
        lng: number | null;
      }
    > = {};

    const adjacency: Record<string, string[]> = {};

    ((territories ?? []) as TerritoryRow[]).forEach((row) => {
      nodes[row.id] = {
        id: row.id,
        moveCost: Number(row.move_cost ?? 1),
        terrainType: row.terrain_type ?? "plains",
        ownerClubId: row.controlling_club_id ?? null,
        lat: row.lat ?? null,
        lng: row.lng ?? null,
      };
    });

    ((edges ?? []) as AdjacencyRow[]).forEach((row) => {
      const from = row.territory_id ?? row.from_territory_id;
      const to = row.adjacent_territory_id ?? row.to_territory_id;

      if (!from || !to) {
        return;
      }

      if (!adjacency[from]) {
        adjacency[from] = [];
      }

      if (!adjacency[from].includes(to)) {
        adjacency[from].push(to);
      }
    });

    const rawPath = findWeightedPath(unit.territory_id, targetTerritoryId, {
      adjacency,
      nodes,
      myClubId: unit.club_id,
      avoidEnemyWeight: commandMode === "attack" ? 2 : 8,
      blockedTerrain: ["water"],
    });

    const path = dedupePath(rawPath);

    if (path.length === 0) {
      return NextResponse.json(
        { success: false, message: "No path found" },
        { status: 400 },
      );
    }

    if (path[0] !== unit.territory_id) {
      path.unshift(unit.territory_id);
    }

    if (!path.includes(targetTerritoryId)) {
      path.push(targetTerritoryId);
    }

    const initialOrderStatus =
      activeMovement || unit.status === "moving" ? "queued" : "started";

    const computedPriority =
      requestedPriority +
      buildFormationPriority(formation, formationIndex, formationSize);

    const formationOffsets = buildFormationOffsets(
      formation,
      formationSize,
      0.35,
    );

    const serializedFormationOffsets = formationOffsets.map(
      (offset, index) => ({
        unit_id: index === formationIndex ? unitId : `slot-${index}`,
        x: offset.x,
        y: offset.y,
      }),
    );

    const unitFormationOffset = formationOffsets[formationIndex] ?? {
      x: 0,
      y: 0,
    };

    const { data: createdOrder, error: orderError } = await supabase
      .from("unit_orders")
      .insert({
        unit_id: unitId,
        target_territory_id: targetTerritoryId,
        priority: computedPriority,
        command_mode: commandMode,
        formation,
        formation_offsets: serializedFormationOffsets,
        path,
        status: initialOrderStatus,
      })
      .select("id")
      .single();

    if (orderError || !createdOrder) {
      return NextResponse.json(
        {
          success: false,
          message: orderError?.message ?? "Failed to create order",
        },
        { status: 500 },
      );
    }

    let startedMovementId: string | null = null;

    const canStartImmediately =
      !activeMovement &&
      unit.status !== "moving" &&
      path.length >= 2 &&
      initialOrderStatus === "started";

    if (canStartImmediately) {
      const fromTerritoryId = path[0];
      const toTerritoryId = path[1];

      const destinationNode = nodes[toTerritoryId];
      const durationSeconds = computeSegmentDurationSeconds({
        moveCost: Number(destinationNode?.moveCost ?? 1),
        unitSpeed: Number(unit.speed ?? 1),
        commandMode,
      });

      const startedAt = new Date();
      const arrivalAt = new Date(startedAt.getTime() + durationSeconds * 1000);

      const { data: createdMovement, error: movementError } = await supabase
        .from("unit_movements")
        .insert({
          unit_id: unitId,
          from_territory_id: fromTerritoryId,
          to_territory_id: toTerritoryId,
          status: "moving",
          started_at: startedAt.toISOString(),
          arrival_at: arrivalAt.toISOString(),
          progress: 0,
        })
        .select("id")
        .single();

      if (movementError) {
        return NextResponse.json(
          {
            success: false,
            message: movementError.message,
          },
          { status: 500 },
        );
      }

      startedMovementId = createdMovement?.id ?? null;

      const fromNode = nodes[fromTerritoryId];
      const { error: updateUnitError } = await supabase
        .from("club_units")
        .update({
          status: "moving",
          lat:
            fromNode?.lat != null ? fromNode.lat + unitFormationOffset.y : null,
          lng:
            fromNode?.lng != null ? fromNode.lng + unitFormationOffset.x : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", unitId);

      if (updateUnitError) {
        return NextResponse.json(
          {
            success: false,
            message: updateUnitError.message,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      orderId: createdOrder.id,
      movementStarted: Boolean(startedMovementId),
      movementId: startedMovementId,
      path,
      formation,
      formationIndex,
      formationSize,
      formationPriority: computedPriority,
      formationOffset: unitFormationOffset,
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
