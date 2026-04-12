"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UnitMovementLiveDisplay {
  movement_id: string;
  unit_id: string;
  club_id?: string | null;
  unit_type?: string | null;

  from_territory_id: string;
  to_territory_id: string;

  from_territory_name?: string;
  to_territory_name?: string;

  from_lat: number | null;
  from_lng: number | null;

  to_lat: number | null;
  to_lng: number | null;

  currentPosition: [number, number] | null;

  power: number;
  progress: number;
  etaLabel: string;
  status?: string;
}

interface UnitMovementRow {
  movement_id: string;
  unit_id: string;
  club_id: string | null;
  unit_type: string | null;

  from_territory_id: string;
  to_territory_id: string;

  from_territory_name: string | null;
  to_territory_name: string | null;

  from_lat: number | null;
  from_lng: number | null;

  to_lat: number | null;
  to_lng: number | null;

  power: number | null;
  progress: number | null;
  status: string | null;

  started_at: string | null;
  arrival_at: string | null;
  completed_at: string | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function computeMovementDisplay(
  rows: UnitMovementRow[],
  nowMs: number,
): UnitMovementLiveDisplay[] {
  return rows.map((row) => {
    const start    = row.started_at ? new Date(row.started_at).getTime() : 0;
    const end      = row.arrival_at ? new Date(row.arrival_at).getTime() : 0;
    const duration = Math.max(0, end - start);
    const elapsed  = Math.max(0, nowMs - start);

    const ratio =
      typeof row.progress === "number"
        ? clamp(row.progress > 1 ? row.progress / 100 : row.progress, 0, 1)
        : duration > 0
          ? clamp(elapsed / duration, 0, 1)
          : 0;

    let currentPosition: [number, number] | null = null;

    if (
      row.from_lat != null &&
      row.from_lng != null &&
      row.to_lat != null &&
      row.to_lng != null
    ) {
      const lat = row.from_lat + (row.to_lat - row.from_lat) * ratio;
      const lng = row.from_lng + (row.to_lng - row.from_lng) * ratio;
      currentPosition = [lng, lat];
    }

    const remainingMs  = Math.max(0, end - nowMs);
    const remainingSec = Math.ceil(remainingMs / 1000);

    return {
      movement_id: row.movement_id,
      unit_id: row.unit_id,
      club_id: row.club_id ?? null,
      unit_type: row.unit_type ?? null,

      from_territory_id: row.from_territory_id,
      to_territory_id: row.to_territory_id,

      from_territory_name: row.from_territory_name ?? "",
      to_territory_name: row.to_territory_name ?? "",

      from_lat: row.from_lat ?? null,
      from_lng: row.from_lng ?? null,

      to_lat: row.to_lat ?? null,
      to_lng: row.to_lng ?? null,

      currentPosition,

      power: Number(row.power ?? 0),
      progress: ratio,
      etaLabel: `${remainingSec}s`,
      status: row.status ?? "moving",
    };
  });
}

export function useUnitMovementsLive() {
  const [rawRows, setRawRows] = useState<UnitMovementRow[]>([]);
  const [clock, setClock]     = useState<number>(Date.now());

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await (supabase as any)
        .from("unit_movements_live")
        .select(`
          movement_id,
          unit_id,
          club_id,
          unit_type,
          from_territory_id,
          to_territory_id,
          from_territory_name,
          to_territory_name,
          from_lat,
          from_lng,
          to_lat,
          to_lng,
          power,
          progress,
          status,
          started_at,
          arrival_at,
          completed_at
        `);

      if (!mounted) return;

      if (error) {
        console.error("[useUnitMovementsLive]", error);
        setRawRows([]);
        return;
      }

      setRawRows((data as unknown as UnitMovementRow[]) ?? []);
      setClock(Date.now());
    }

    load();

    const channel = supabase
      .channel("unit-movements-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "unit_movements" },
        load,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "club_units" },
        load,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "club_territories" },
        load,
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Ticker 100ms — met à jour la position interpolée en continu
  useEffect(() => {
    const interval = window.setInterval(() => {
      setClock(Date.now());
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  const movements = useMemo(() => {
    return computeMovementDisplay(rawRows, clock);
  }, [rawRows, clock]);

  return { movements };
}
