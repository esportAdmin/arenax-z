"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarMapFull {
  territory_id: string;
  territory_name: string;
  lat: number;
  lng: number;

  club_id: string | null;
  club_name: string | null;
  club_color: string | null;

  war_id: string | null;
  status: string | null;

  total_xp: number;
}

export function useWarMapFull() {
  const [data, setData] = useState<WarMapFull[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        // 🔥 CAST SAFE
        .from("war_map_full" as any)
        .select("*");

      if (!error && data) {
        setData(data as unknown as WarMapFull[]);
      }

      setLoading(false);
    }

    load();
  }, []);

  return { data, loading };
}
