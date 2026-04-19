"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TerritoryInfluence {
  territory_id: string;
  territory_name: string;
  club_id: string | null;
  lat: number | null;
  lng: number | null;
  influence_score: number;
}

export function useTerritoryInfluence() {
  const [data, setData] = useState<TerritoryInfluence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await (supabase as any)
        .from("territory_influence_map")
        .select("*");

      if (error) {
        console.error("[useTerritoryInfluence]", error);
        setLoading(false);
        return;
      }

      setData(
        ((data ?? []) as any[]).map((row) => ({
          territory_id: row.territory_id,
          territory_name: row.territory_name,
          club_id: row.club_id ?? null,
          lat: typeof row.lat === "number" ? row.lat : null,
          lng: typeof row.lng === "number" ? row.lng : null,
          influence_score: Number(row.influence_score ?? 0),
        })),
      );

      setLoading(false);
    }

    load();
  }, []);

  return { data, loading };
}
