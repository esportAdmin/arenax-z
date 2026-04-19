"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface FrontlineEdge {
  from_territory_id: string;
  from_territory_name: string;
  from_lat: number | null;
  from_lng: number | null;
  from_club_id: string | null;
  to_territory_id: string;
  to_territory_name: string;
  to_lat: number | null;
  to_lng: number | null;
  to_club_id: string | null;
}

export function useFrontlineEdges() {
  const [edges, setEdges] = useState<FrontlineEdge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await (supabase as any)
        .from("frontline_edges")
        .select("*");

      if (error) {
        console.error("[useFrontlineEdges]", error);
        setLoading(false);
        return;
      }

      setEdges((data ?? []) as FrontlineEdge[]);
      setLoading(false);
    }

    load();
  }, []);

  return {
    edges,
    loading,
  };
}
