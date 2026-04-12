"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalQaUser } from "@/lib/dev-auth";

export type ActiveWar = {
  id: string;
  status: string;
  territory: {
    id: string;
    name: string;
  } | null;
  challenger: {
    id: string;
    name: string;
  } | null;
  defender: {
    id: string;
    name: string;
  } | null;
  challenger_xp: number;
  defender_xp: number;
};

const FALLBACK_ACTIVE_WARS: ActiveWar[] = [
  {
    id: "war-france",
    status: "active",
    territory: { id: "territory-germany", name: "Germany" },
    challenger: { id: "club-shadow-legion", name: "Shadow Legion" },
    defender: { id: "club-titan-force", name: "Titan Force" },
    challenger_xp: 64,
    defender_xp: 58,
  },
  {
    id: "war-us-east",
    status: "active",
    territory: { id: "territory-us-east", name: "US East" },
    challenger: { id: "club-vanguard-elite", name: "Vanguard Elite" },
    defender: { id: "club-phoenix-rising", name: "Phoenix Rising" },
    challenger_xp: 49,
    defender_xp: 53,
  },
];

export function useActiveWars() {
  const { user } = useAuth();
  const [wars, setWars] = useState<ActiveWar[]>([]);
  const isLocalQa = isLocalQaUser(user);

  useEffect(() => {
    let isMounted = true;

    if (isLocalQa) {
      setWars(FALLBACK_ACTIVE_WARS);
      return;
    }

    const load = async () => {
      const { data, error } = await supabase
        .from("club_wars")
        .select(
          `
          id,
          status,
          challenger_xp,
          defender_xp,
          territory:club_territories!club_wars_territory_id_fkey (
            id,
            name
          ),
          challenger:clubs!club_wars_challenger_id_fkey (
            id,
            name
          ),
          defender:clubs!club_wars_defender_id_fkey (
            id,
            name
          )
        `,
        )
        .eq("status", "active");

      if (!isMounted) return;

      if (error || !data) {
        setWars(FALLBACK_ACTIVE_WARS);
        return;
      }

      if (data.length === 0) {
        setWars(FALLBACK_ACTIVE_WARS);
        return;
      }

      const cleaned: ActiveWar[] = data.map((war: any) => ({
        id: war.id,
        status: war.status,
        challenger_xp: war.challenger_xp ?? 0,
        defender_xp: war.defender_xp ?? 0,
        territory: war.territory
          ? {
              id: war.territory.id,
              name: war.territory.name,
            }
          : null,
        challenger: war.challenger
          ? {
              id: war.challenger.id,
              name: war.challenger.name,
            }
          : null,
        defender: war.defender
          ? {
              id: war.defender.id,
              name: war.defender.name,
            }
          : null,
      }));

      setWars(cleaned);
    };

    void load();

    const channel = supabase
      .channel("wars-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "club_wars",
        },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [isLocalQa]);

  return wars.length > 0 ? wars : FALLBACK_ACTIVE_WARS;
}
