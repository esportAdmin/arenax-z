"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useClubTerritories() {
  const [territories, setTerritories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadTerritories() {
    const { data, error } = await (supabase as any)
      .from("club_territories")
      .select(
        `
        *,
        controlling_club:clubs (
          id,
          name,
          slug
        )
      `,
      )
      .order("name");

    if (error) {
      console.error("Territories error:", error);
      setLoading(false);
      return;
    }

    setTerritories(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadTerritories();

    const channel = supabase
      .channel("club-territories")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "club_territories",
        },
        () => {
          loadTerritories();
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
    refresh: loadTerritories,
  };
}
