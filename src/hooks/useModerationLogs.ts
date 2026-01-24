// src/hooks/useModerationLogs.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ModerationLog {
  id: string;
  club_id: string;
  moderator_id: string;
  action_type: "delete" | "pin" | "unpin";
  target_message_id: string | null;
  target_user_id: string | null;
  message_content: string | null;
  message_author_name: string | null;
  created_at: string;
  moderator?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

type ModeratorProfile = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
};

/**
 * Type guard: keep only non-empty strings.
 *
 * @example
 * ["a", null].filter(isNonEmptyString); // ["a"]
 */
function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

export const useModerationLogs = (clubId: string | null) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<ModerationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    if (!clubId || !user) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("club_moderation_logs")
        .select("*")
        .eq("club_id", clubId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      const moderatorIds = Array.from(
        new Set(
          (data ?? [])
            .map((l: any) => l?.moderator_id)
            .filter(isNonEmptyString),
        ),
      );

      const { data: profiles } =
        moderatorIds.length > 0
          ? await supabase
              .from("profiles")
              .select("user_id, display_name, avatar_url")
              .in("user_id", moderatorIds)
          : { data: [] as ModeratorProfile[] };

      const profileMap = new Map<string, ModeratorProfile>(
        (profiles ?? []).map((p: any) => [
          p.user_id as string,
          p as ModeratorProfile,
        ]),
      );

      setLogs(
        (data ?? []).map((log: any) => ({
          ...log,
          action_type: log.action_type as ModerationLog["action_type"],
          moderator: profileMap.get(log.moderator_id) ?? undefined,
        })),
      );
    } catch (e) {
      console.error("Error fetching moderation logs:", e);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [clubId, user]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    refresh: fetchLogs,
  };
};
