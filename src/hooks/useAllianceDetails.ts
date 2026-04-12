"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AllianceMemberDetail {
  id: string;
  alliance_id: string;
  club_id: string;
  role: string;
  joined_at: string;
  club_name: string;
  logo_url: string | null;
}

export function useAllianceDetails(allianceId: string | null) {
  const [members, setMembers] = useState<AllianceMemberDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!allianceId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await (supabase as any)
        .from("alliance_member_details")
        .select("*")
        .eq("alliance_id", allianceId)
        .order("joined_at", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      setMembers(
        (data ?? []).map((row: any) => ({
          id: row.id,
          alliance_id: row.alliance_id,
          club_id: row.club_id,
          role: row.role,
          joined_at: row.joined_at,
          club_name: row.club_name,
          logo_url: row.logo_url ?? null,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch alliance details",
      );
    } finally {
      setLoading(false);
    }
  }, [allianceId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    if (!allianceId) return;

    const channel = supabase
      .channel(`alliance-details-${allianceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "alliance_members",
          filter: `alliance_id=eq.${allianceId}`,
        },
        () => {
          fetchMembers();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [allianceId, fetchMembers]);

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
  };
}
