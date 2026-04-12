"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdjacencyDebugItem {
  territory_id: string;
  territory_name: string;
  adjacent_territory_id: string;
  adjacent_territory_name: string;
}

export function useAdjacencyDebug() {
  const [data, setData] = useState<AdjacencyDebugItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await (supabase as any)
        .from("territory_adjacency_debug")
        .select("*");

      if (error) {
        console.error("[useAdjacencyDebug]", error);
        setLoading(false);
        return;
      }

      setData(
        (data ?? []).map((row: any) => ({
          territory_id: row.territory_id,
          territory_name: row.territory_name,
          adjacent_territory_id: row.adjacent_territory_id,
          adjacent_territory_name: row.adjacent_territory_name,
        })),
      );

      setLoading(false);
    }

    load();
  }, []);

  return { data, loading };
}
