"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CombatFeedEvent } from "@/components/rts/CombatEventFeed";

interface BattleLogRow {
  id?: string;
  territory_id?: string | null;
  round?: number | null;
  payload?: CombatFeedEvent[] | null;
  created_at?: string | null;
}

export function useBattleEvents() {
  const [events, setEvents] = useState<CombatFeedEvent[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadLatest() {
      const { data, error } = await (supabase as any)
        .from("battle_logs")
        .select("id, territory_id, round, payload, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error("[useBattleEvents]", error);
        return;
      }

      const row = data as BattleLogRow | null;
      setEvents(Array.isArray(row?.payload) ? row!.payload! : []);
    }

    loadLatest();

    const channel = supabase
      .channel("battle-events-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "battle_logs",
        },
        (payload: any) => {
          const nextEvents = Array.isArray(payload?.new?.payload)
            ? payload.new.payload
            : [];

          setEvents(nextEvents);
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { events };
}
