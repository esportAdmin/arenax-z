"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ArmyStack {
  club_id: string;
  club_name: string | null;
  club_color: string;
  territory_id: string;
  territory_name: string;
  lat: number | null;
  lng: number | null;
  unit_count: number;
  total_power: number;
}

export function useArmyStacks() {
  const [stacks, setStacks] = useState<ArmyStack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await (supabase as any)
        .from("army_stacks_live")
        .select("*");

      if (!mounted) return;

      if (error) {
        console.error("[useArmyStacks]", error);
        setLoading(false);
        return;
      }

      setStacks(
        ((data ?? []) as any[]).map((row) => ({
          club_id: row.club_id,
          club_name: row.club_name ?? null,
          club_color: row.club_color ?? "#00d9ff",
          territory_id: row.territory_id,
          territory_name: row.territory_name,
          lat: typeof row.lat === "number" ? row.lat : null,
          lng: typeof row.lng === "number" ? row.lng : null,
          unit_count: Number(row.unit_count ?? 0),
          total_power: Number(row.total_power ?? 0),
        })),
      );

      setLoading(false);
    }

    load();

    const channel = supabase
      .channel("army-stacks-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "club_units" },
        load,
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    stacks,
    loading,
  };
}
