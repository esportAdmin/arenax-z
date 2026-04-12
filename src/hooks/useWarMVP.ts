"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarMVP {
  user_id: string;
  username: string;
  total_xp: number;
}

export function useWarMVP(warId: string | null) {
  const [mvp, setMvp] = useState<WarMVP | null>(null);

  useEffect(() => {
    if (!warId) return;

    async function load() {
      const { data } = await (supabase as any)
        .from("war_mvp_top")
        .select("*")
        .eq("war_id", warId)
        .order("total_xp", { ascending: false })
        .limit(1)
        .single();

      setMvp(data || null);
    }

    load();
  }, [warId]);

  return mvp;
}
