"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClubEconomyData {
  gold: number;
  energy: number;
}

export function useClubEconomy(clubId: string | null) {
  const [data, setData] = useState<ClubEconomyData | null>(null);

  useEffect(() => {
    if (!clubId) {
      setData(null);
      return;
    }

    async function load() {
      const { data, error } = await supabase
        .from("clubs")
        .select("gold, energy")
        .eq("id", clubId)
        .single();

      if (error) {
        console.error("[useClubEconomy]", error);
        return;
      }

      setData({
        gold: Number(data?.gold ?? 0),
        energy: Number(data?.energy ?? 0),
      });
    }

    load();
  }, [clubId]);

  return data;
}
