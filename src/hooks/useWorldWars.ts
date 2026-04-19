"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface War {
  id: string;
  territory_name: string;
  coordinates: [number, number];
  attacker_club: string;
  defender_club: string;
  status: string;
  created_at: string;
}

export function useWorldWars() {
  const [wars, setWars] = useState<War[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWars() {
      try {
        // Requ￪te adapt￩e ￠ ta structure
        const { data, error } = await supabase
          .from("club_wars")
          .select(
            `
            id,
            status,
            start_date,
            territory_name,
            coordinates,
            challenger:challenger_id(name),
            defender:defender_id(name)
          `,
          )
          .eq("status", "active")
          .order("start_date", { ascending: false });

        if (error) {
          console.error("Error loading wars:", error);
          setWars(getMockWars());
          setLoading(false);
          return;
        }

        console.log("Wars from Supabase:", data);

        // Si les colonnes territory_name et coordinates n'existent pas encore
        // utilise les mock data
        if (!data || data.length === 0) {
          setWars(getMockWars());
          setLoading(false);
          return;
        }

        const formattedWars = data.map((war: any) => ({
          id: war.id,
          territory_name: war.territory_name || "Unknown Territory",
          coordinates: war.coordinates || [0, 0],
          attacker_club: war.challenger?.name || "Challenger",
          defender_club: war.defender?.name || "Defender",
          status: war.status,
          created_at: war.start_date || new Date().toISOString(),
        }));

        setWars(formattedWars);
      } catch (error) {
        console.error("Error loading wars:", error);
        setWars(getMockWars());
      } finally {
        setLoading(false);
      }
    }

    loadWars();

    // Real-time subscription
    const channel = supabase
      .channel("wars-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "club_wars",
        },
        () => {
          loadWars();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { wars, loading };
}

// Mock data fallback (utilis￩ si la table n'a pas encore les colonnes coordinates)
function getMockWars(): War[] {
  return [
    {
      id: "1",
      territory_name: "Paris",
      coordinates: [2.3522, 48.8566],
      attacker_club: "Dragons",
      defender_club: "Phoenix",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      territory_name: "New York",
      coordinates: [-74.006, 40.7128],
      attacker_club: "Titans",
      defender_club: "Warriors",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      territory_name: "Tokyo",
      coordinates: [139.6917, 35.6895],
      attacker_club: "Samurai",
      defender_club: "Ninjas",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      territory_name: "London",
      coordinates: [-0.1276, 51.5074],
      attacker_club: "Knights",
      defender_club: "Vikings",
      status: "active",
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      territory_name: "Sydney",
      coordinates: [151.2093, -33.8688],
      attacker_club: "Sharks",
      defender_club: "Kangaroos",
      status: "active",
      created_at: new Date().toISOString(),
    },
  ];
}
