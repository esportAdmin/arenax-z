"use client";

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useRealtimeArena(refresh: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel("arena-live")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "season_xp",
        },
        () => refresh(),
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clubs",
        },
        () => refresh(),
      )

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "club_wars",
        },
        () => refresh(),
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);
}
