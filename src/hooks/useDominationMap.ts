"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TerritoryDomination {
  id: string;
  name: string;
  controlling_club_id: string | null;
  club_name: string | null;
  club_color: string;
}

export function useDominationMap() {
  const [data, setData] = useState<TerritoryDomination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await (supabase as any)
          .from("territory_domination")
          .select("*");

        if (error) {
          console.error("Domination map error:", error);
          return;
        }

        setData(data ?? []);
      } catch (err) {
        console.error("Domination map crash:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { data, loading };
}
