"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BattleEvent {
  attackerId: string;
  defenderId: string;
  damage: number;
  crit: boolean;
  skill: string;
}

export interface BattleLog {
  territory_id: string;
  round: number;
  payload: BattleEvent[];
}

export function useBattleLogs(territoryId?: string | null) {
  const [events, setEvents] = useState<BattleEvent[]>([]);

  useEffect(() => {
    if (!territoryId) return;

    const channel = supabase
      .channel(`battle-${territoryId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "battle_logs",
          filter: `territory_id=eq.${territoryId}`,
        },
        (payload: any) => {
          const log = payload.new as BattleLog;
          setEvents(log.payload ?? []);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [territoryId]);

  return { events };
}
