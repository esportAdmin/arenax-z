"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LiveWar {
  territory_id: string;
  territory_name: string;
  lat: number;
  lng: number;

  gold_income: number | null;
  energy_income: number | null;
  upkeep_cost: number | null;
  capture_progress: number | null;

  club_id: string | null;
  club_name: string | null;
  club_color: string | null;

  alliance_id: string | null;
  alliance_name: string | null;

  war_id: string | null;
  status: string | null;

  total_xp: number;
}

export function useLiveWars() {
  const [wars, setWars] = useState<LiveWar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await supabase
        .from("war_map_full" as any)
        .select("*");

      if (!mounted) return;

      if (error) {
        console.error("[useLiveWars]", error);
        setLoading(false);
        return;
      }

      setWars((data ?? []) as unknown as LiveWar[]);
      setLoading(false);
    }

    load();

    const channel = supabase
      .channel("live-wars-map")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "war_contributions" },
        load,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "club_wars" },
        load,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "club_territories" },
        load,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "club_units" },
        load,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "unit_movements" },
        load,
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    wars,
    loading,
  };
}
