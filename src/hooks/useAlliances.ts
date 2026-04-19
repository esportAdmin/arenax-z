"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AllianceOverview {
  id: string;
  name: string;
  description: string | null;
  owner_club_id: string;
  owner_club_name: string | null;
  season_id: string | null;
  members_count: number;
  created_at: string;
  updated_at: string;
}

export function useAlliances() {
  const [alliances, setAlliances] = useState<AllianceOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlliances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await (supabase as any)
        .from("alliance_overview")
        .select("*")
        .order("members_count", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setAlliances(
        (data ?? []).map((row: any) => ({
          id: row.id,
          name: row.name,
          description: row.description ?? null,
          owner_club_id: row.owner_club_id,
          owner_club_name: row.owner_club_name ?? null,
          season_id: row.season_id ?? null,
          members_count: Number(row.members_count ?? 0),
          created_at: row.created_at,
          updated_at: row.updated_at,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch alliances",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlliances();
  }, [fetchAlliances]);

  useEffect(() => {
    const channel = supabase
      .channel("alliances-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alliances",
        },
        () => {
          fetchAlliances();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alliance_members",
        },
        () => {
          fetchAlliances();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAlliances]);

  return {
    alliances,
    loading,
    error,
    refetch: fetchAlliances,
  };
}
