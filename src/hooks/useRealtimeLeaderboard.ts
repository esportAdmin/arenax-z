"use client";

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useRealtimeLeaderboard(refresh: () => void) {
  useEffect(() => {
    const channel = supabase
      .channel("leaderboard-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_season_scores",
        },
        () => {
          refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);
}
