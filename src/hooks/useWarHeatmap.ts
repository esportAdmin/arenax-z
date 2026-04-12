"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarHeatPoint {
  war_id: string;
  territory_id: string | null;
  territory_name: string | null;
  longitude: number | null;
  latitude: number | null;
  total_xp: number;
  contributions_count: number;
  intensity: number;
}

export function useWarHeatmap() {
  const [points, setPoints] = useState<WarHeatPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const { data, error } = await (supabase as any)
      .from("war_heatmap")
      .select("*");

    if (error) {
      console.error("[useWarHeatmap]", error);
      setPoints([]);
      setLoading(false);
      return;
    }

    setPoints(
      (data ?? []).map((row: any) => ({
        war_id: row.war_id,
        territory_id: row.territory_id ?? null,
        territory_name: row.territory_name ?? null,
        longitude: typeof row.longitude === "number" ? row.longitude : null,
        latitude: typeof row.latitude === "number" ? row.latitude : null,
        total_xp: Number(row.total_xp ?? 0),
        contributions_count: Number(row.contributions_count ?? 0),
        intensity: Number(row.intensity ?? 0),
      })),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const channel = supabase
      .channel("war-heatmap-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "war_contributions",
        },
        () => {
          load();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return {
    points,
    loading,
    refetch: load,
  };
}
