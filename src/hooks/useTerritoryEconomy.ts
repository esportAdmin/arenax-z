"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TerritoryEconomy {
  id: string;
  name: string;
  controlling_club_id: string | null;
  gold_income: number;
  energy_income: number;
  upkeep_cost: number;
  net_gold: number;
}

export function useTerritoryEconomy() {
  const [territories, setTerritories] = useState<TerritoryEconomy[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);

    const { data, error } = await (supabase as any)
      .from("territory_economy")
      .select("*")
      .order("net_gold", { ascending: false });

    if (error) {
      console.error("[useTerritoryEconomy]", error);
      setTerritories([]);
      setLoading(false);
      return;
    }

    setTerritories(
      (data ?? []).map((row: any) => ({
        id: row.id,
        name: row.name,
        controlling_club_id: row.controlling_club_id ?? null,
        gold_income: Number(row.gold_income ?? 0),
        energy_income: Number(row.energy_income ?? 0),
        upkeep_cost: Number(row.upkeep_cost ?? 0),
        net_gold: Number(row.net_gold ?? 0),
      })),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    territories,
    loading,
    refetch: load,
  };
}
