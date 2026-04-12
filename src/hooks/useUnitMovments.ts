"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClubUnit {
  id: string;
  club_id: string;
  territory_id: string;
  unit_type: string;
  power: number;
  speed: number;
  status: string;
}

export interface UnitMovement {
  id: string;
  unit_id: string;
  from_territory_id: string;
  to_territory_id: string;
  status: string;
  started_at: string;
  arrival_at: string;
  completed_at: string | null;
  progress: number;
}

export function useUnitMovements(clubId: string | null) {
  const [units, setUnits] = useState<ClubUnit[]>([]);
  const [movements, setMovements] = useState<UnitMovement[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    if (!clubId) {
      setUnits([]);
      setMovements([]);
      setLoading(false);
      return;
    }

    const { data: unitsData, error: unitsError } = await supabase
      .from("club_units")
      .select("id, club_id, territory_id, unit_type, power, speed, status")
      .eq("club_id", clubId)
      .order("created_at", { ascending: true });

    if (unitsError) {
      console.error("[useUnitMovements][units]", {
        code: unitsError.code,
        message: unitsError.message,
        details: unitsError.details,
        hint: unitsError.hint,
      });
      setUnits([]);
      setMovements([]);
      setLoading(false);
      return;
    }

    const mappedUnits: ClubUnit[] = ((unitsData ?? []) as any[]).map((row) => ({
      id: String(row.id),
      club_id: String(row.club_id),
      territory_id: String(row.territory_id),
      unit_type: String(row.unit_type ?? "infantry"),
      power: Number(row.power ?? 0),
      speed: Number(row.speed ?? 0),
      status: String(row.status ?? "idle"),
    }));

    const unitIds = mappedUnits.map((unit) => unit.id);

    let mappedMovements: UnitMovement[] = [];

    if (unitIds.length > 0) {
      const { data: movesData, error: movesError } = await supabase
        .from("unit_movements")
        .select(
          "id, unit_id, from_territory_id, to_territory_id, status, started_at, arrival_at, completed_at, progress",
        )
        .in("unit_id", unitIds)
        .in("status", ["queued", "moving", "started"])
        .order("started_at", { ascending: false });

      if (movesError) {
        console.error("[useUnitMovements][movements]", {
          code: movesError.code,
          message: movesError.message,
          details: movesError.details,
          hint: movesError.hint,
        });
      } else {
        mappedMovements = ((movesData ?? []) as any[]).map((row) => ({
          id: String(row.id),
          unit_id: String(row.unit_id),
          from_territory_id: String(row.from_territory_id),
          to_territory_id: String(row.to_territory_id),
          status: String(row.status ?? "moving"),
          started_at: String(row.started_at),
          arrival_at: String(row.arrival_at),
          completed_at: row.completed_at ? String(row.completed_at) : null,
          progress: Number(row.progress ?? 0),
        }));
      }
    }

    setUnits(mappedUnits);
    setMovements(mappedMovements);
    setLoading(false);
  }, [clubId]);

  useEffect(() => {
    load();

    const channel = supabase
      .channel(`unit-movements-live-${clubId ?? "anonymous"}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "club_units",
        },
        () => {
          load();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "unit_movements",
        },
        () => {
          load();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, clubId]);

  return {
    units,
    movements,
    loading,
    refetch: load,
  };
}
