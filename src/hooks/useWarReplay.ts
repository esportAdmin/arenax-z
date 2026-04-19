"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarReplayEvent {
  id: string;
  war_id: string;
  user_id: string | null;
  club_id: string | null;
  xp: number;
  created_at: string;
  username: string;
  avatar_url: string | null;
}

export function useWarReplay(warId: string | null) {
  const [events, setEvents] = useState<WarReplayEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!warId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("war_contributions")
      .select(
        `
        id,
        war_id,
        user_id,
        club_id,
        xp,
        created_at,
        profiles(display_name, username, avatar_url)
      `,
      )
      .eq("war_id", warId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[useWarReplay]", error);
      setEvents([]);
      setLoading(false);
      return;
    }

    const mapped: WarReplayEvent[] = (data ?? []).map((row: any) => {
      const profile = Array.isArray(row.profiles)
        ? row.profiles[0]
        : row.profiles;

      return {
        id: row.id,
        war_id: row.war_id,
        user_id: row.user_id ?? null,
        club_id: row.club_id ?? null,
        xp: Number(row.xp ?? 0),
        created_at: row.created_at,
        username:
          profile?.display_name ??
          profile?.username ??
          (row.user_id ? row.user_id.slice(0, 6) : "AI"),
        avatar_url: profile?.avatar_url ?? null,
      };
    });

    setEvents(mapped);
    setLoading(false);
  }, [warId]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    events,
    loading,
    refetch: load,
  };
}
