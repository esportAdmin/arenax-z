"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalQaUser } from "@/lib/dev-auth";

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

const FALLBACK_TERRITORIES: Territory[] = [
  {
    id: "territory-us-east",
    name: "US East",
    region: "Americas",
    map_x: 28,
    map_y: 36,
    xp_bonus: 10,
    arena_bonus: 120,
    prestige_bonus: 15,
    controlling_club_id: "club-shadow-legion",
    controlling_club: { name: "Shadow Legion" },
    clubs: { name: "Shadow Legion" },
  },
  {
    id: "territory-us-west",
    name: "US West",
    region: "Americas",
    map_x: 14,
    map_y: 33,
    xp_bonus: 8,
    arena_bonus: 90,
    prestige_bonus: 12,
    controlling_club_id: "club-vanguard-elite",
    controlling_club: { name: "Vanguard Elite" },
    clubs: { name: "Vanguard Elite" },
  },
  {
    id: "territory-brazil",
    name: "Brazil",
    region: "Americas",
    map_x: 35,
    map_y: 63,
    xp_bonus: 7,
    arena_bonus: 70,
    prestige_bonus: 9,
    controlling_club_id: "club-phoenix-rising",
    controlling_club: { name: "Phoenix Rising" },
    clubs: { name: "Phoenix Rising" },
  },
  {
    id: "territory-uk",
    name: "United Kingdom",
    region: "Europe",
    map_x: 49,
    map_y: 26,
    xp_bonus: 11,
    arena_bonus: 140,
    prestige_bonus: 16,
    controlling_club_id: "club-storm-breakers",
    controlling_club: { name: "Storm Breakers" },
    clubs: { name: "Storm Breakers" },
  },
  {
    id: "territory-germany",
    name: "Germany",
    region: "Europe",
    map_x: 54,
    map_y: 31,
    xp_bonus: 12,
    arena_bonus: 160,
    prestige_bonus: 20,
    controlling_club_id: "club-titan-force",
    controlling_club: { name: "Titan Force" },
    clubs: { name: "Titan Force" },
  },
  {
    id: "territory-poland",
    name: "Poland",
    region: "Europe",
    map_x: 58,
    map_y: 30,
    xp_bonus: 9,
    arena_bonus: 100,
    prestige_bonus: 14,
    controlling_club_id: "club-iron-wolves",
    controlling_club: { name: "Iron Wolves" },
    clubs: { name: "Iron Wolves" },
  },
  {
    id: "territory-japan",
    name: "Japan",
    region: "Asia",
    map_x: 83,
    map_y: 34,
    xp_bonus: 10,
    arena_bonus: 130,
    prestige_bonus: 18,
    controlling_club_id: "club-celestial-guard",
    controlling_club: { name: "Celestial Guard" },
    clubs: { name: "Celestial Guard" },
  },
  {
    id: "territory-australia",
    name: "Australia",
    region: "Oceania",
    map_x: 84,
    map_y: 72,
    xp_bonus: 8,
    arena_bonus: 80,
    prestige_bonus: 10,
    controlling_club_id: "club-night-raiders",
    controlling_club: { name: "Night Raiders" },
    clubs: { name: "Night Raiders" },
  },
];

export function useGlobalWarMap(): WarMapState {
  const { user } = useAuth();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentCapture, setRecentCapture] = useState<string | null>(null);
  const isLocalQa = isLocalQaUser(user);

  const load = useCallback(async () => {
    if (isLocalQa) {
      setTerritories(FALLBACK_TERRITORIES);
      setLoading(false);
      return;
    }

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
      setTerritories(FALLBACK_TERRITORIES);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setTerritories(FALLBACK_TERRITORIES);
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
  }, [isLocalQa]);

  useEffect(() => {
    void load();

    if (isLocalQa) {
      return;
    }

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
  }, [isLocalQa, load]);

  return {
    territories: territories.length > 0 ? territories : FALLBACK_TERRITORIES,
    loading,
    recentCapture,
  };
}
