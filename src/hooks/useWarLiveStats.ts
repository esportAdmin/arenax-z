"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarLiveStats {
  war_id: string;
  challenger_id: string;
  defender_id: string;
  attacker_xp: number;
  defender_xp: number;
  total_xp: number;
}

function isWarLiveStats(value: unknown): value is WarLiveStats {
  const v = value as WarLiveStats;
  return (
    !!v &&
    typeof v.war_id === "string" &&
    typeof v.challenger_id === "string" &&
    typeof v.defender_id === "string" &&
    typeof v.attacker_xp === "number" &&
    typeof v.defender_xp === "number" &&
    typeof v.total_xp === "number"
  );
}

export function useWarLiveStats(warId: string | null) {
  const [stats, setStats] = useState<WarLiveStats | null>(null);

  useEffect(() => {
    if (!warId) {
      setStats(null);
      return;
    }

    let mounted = true;

    async function load() {
      const { data, error } = await (supabase as any)
        .from("war_live_stats")
        .select("*")
        .eq("war_id", warId)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error("[useWarLiveStats]", error);
        return;
      }

      if (isWarLiveStats(data)) {
        setStats(data);
      } else {
        setStats(null);
      }
    }

    load();

    const channel = supabase
      .channel(`war-live-stats-${warId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "war_contributions",
          filter: `war_id=eq.${warId}`,
        },
        () => {
          load();
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [warId]);

  return stats;
}
