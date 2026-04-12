"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AttackableTerritory = {
  territory_id: string;
};

export function useAttackableTerritories(clubId?: string) {
  const [territories, setTerritories] = useState<AttackableTerritory[]>([]);

  const load = useCallback(async () => {
    if (!clubId) {
      setTerritories([]);
      return;
    }

    const { data, error } = await (supabase as any).rpc(
      "get_attackable_territories",
      { p_club: clubId },
    );

    if (error) {
      console.error("Attackable territories error:", error);
      setTerritories([]);
      return;
    }

    setTerritories(data || []);
  }, [clubId]);

  useEffect(() => {
    void load();
  }, [clubId, load]);

  return territories;
}
