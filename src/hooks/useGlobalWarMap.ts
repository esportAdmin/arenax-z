"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Territory = {
  id: string;
  name: string;
  map_x: number | null;  // null possible depuis Supabase
  map_y: number | null;  // null possible depuis Supabase
  controlling_club_id: string | null;
  region?: string | null;
  xp_bonus?: number | null;
  arena_bonus?: number | null;
  prestige_bonus?: number | null;
  controlling_club?: {
    name: string;
  } | null;
  clubs?: {
    name: string;
  } | null;
};

type WarMapState = {
  territories: Territory[];
  loading: boolean;
  recentCapture: string | null;
};

export function useGlobalWarMap(): WarMapState {
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentCapture, setRecentCapture] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("club_territories").select(`
        id,
        name,
        region,
        map_x,
        map_y,
        xp_bonus,
        arena_bonus,
        prestige_bonus,
        controlling_club_id,
        controlling_club:clubs!club_territories_controlling_club_id_fkey(name),
        clubs(name)
      `);

    if (error) {
      console.error("Map load error:", error);
      setLoading(false);
      return;
    }

    setTerritories(
      ((data as any[]) ?? []).map((territory) => ({
        ...territory,
        controlling_club: Array.isArray(territory.controlling_club)
          ? territory.controlling_club[0] ?? null
          : territory.controlling_club ?? null,
        clubs: Array.isArray(territory.clubs)
          ? territory.clubs[0] ?? null
          : territory.clubs ?? null,
      })),
    );
    setLoading(false);
  }

  useEffect(() => {
    load();

    const channel = supabase
      .channel("territories-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "club_territories",
        },
        (payload) => {
          const updated = payload.new as {
            id: string;
            controlling_club_id: string | null;
          };

          setRecentCapture(updated.id);

          setTerritories((prev) =>
            prev.map((t) =>
              t.id === updated.id
                ? {
                    ...t,
                    controlling_club_id: updated.controlling_club_id,
                  }
                : t,
            ),
          );

          setTimeout(() => {
            setRecentCapture(null);
          }, 2000);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    territories,
    loading,
    recentCapture,
  };
}
