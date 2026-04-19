"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FrontlineTerritory {
  territory_id: string;
  territory_name: string;
  club_id: string | null;
  club_name: string | null;
  club_color: string;
  lat: number | null;
  lng: number | null;
  is_frontline: number;
}

export function useFrontlineMap() {
  const [data, setData] = useState<FrontlineTerritory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await (supabase as any)
        .from("frontline_territories")
        .select("*");

      if (error) {
        console.error("[useFrontlineMap]", error);
        setLoading(false);
        return;
      }

      setData(
        ((data ?? []) as any[]).map((row) => ({
          territory_id: row.territory_id,
          territory_name: row.territory_name,
          club_id: row.club_id ?? null,
          club_name: row.club_name ?? null,
          club_color: row.club_color ?? "#00d9ff",
          lat: typeof row.lat === "number" ? row.lat : null,
          lng: typeof row.lng === "number" ? row.lng : null,
          is_frontline: Number(row.is_frontline ?? 0),
        })),
      );

      setLoading(false);
    }

    load();
  }, []);

  return { data, loading };
}
