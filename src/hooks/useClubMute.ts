// src/hooks/useClubMute.ts
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface MutedMember {
  id: string;
  club_id: string;
  user_id: string;
  muted_by: string;
  reason: string | null;
  muted_at: string;
  expires_at: string;
}

/**
 * Ensure RPC optional string params are `string | undefined` (never null),
 * to satisfy generated supabase types.
 *
 * @example
 * toOptionalString(null); // undefined
 * toOptionalString("hi"); // "hi"
 */
function toOptionalString(v: string | null | undefined): string | undefined {
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}

export const useClubMute = (clubId: string | null) => {
  const { user } = useAuth();
  const [mutedMembers, setMutedMembers] = useState<MutedMember[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [muteExpiresAt, setMuteExpiresAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMutedMembers = useCallback(async () => {
    if (!clubId) return;

    const { data, error } = await supabase
      .from("club_muted_members")
      .select("*")
      .eq("club_id", clubId)
      .gt("expires_at", new Date().toISOString());

    if (error) return;

    const rows = (data || []) as MutedMember[];
    setMutedMembers(rows);

    // Check if current user is muted
    if (!user) return;

    const myMute = rows.find((m) => m.user_id === user.id);
    if (myMute) {
      setIsMuted(true);
      setMuteExpiresAt(new Date(myMute.expires_at));
    } else {
      setIsMuted(false);
      setMuteExpiresAt(null);
    }
  }, [clubId, user]);

  useEffect(() => {
    void fetchMutedMembers();

    const interval = setInterval(() => {
      if (muteExpiresAt && new Date() >= muteExpiresAt) {
        setIsMuted(false);
        setMuteExpiresAt(null);
        void fetchMutedMembers();
      }
    }, 10_000);

    return () => clearInterval(interval);
  }, [fetchMutedMembers, muteExpiresAt]);

  const muteMember = async (
    targetUserId: string,
    durationMinutes: number,
    reason?: string,
  ) => {
    if (!clubId) return false;
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc("mute_club_member", {
        p_club_id: clubId,
        p_user_id: targetUserId,
        p_duration_minutes: durationMinutes,
        p_reason: toOptionalString(reason ?? undefined),
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        toast.error(result.error || "Erreur lors du mute");
        return false;
      }

      toast.success("Membre mute avec succès");
      await fetchMutedMembers();
      return true;
    } catch (error) {
      console.error("Error muting member:", error);
      toast.error("Erreur lors du mute");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unmuteMember = async (targetUserId: string) => {
    if (!clubId) return false;
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc("unmute_club_member", {
        p_club_id: clubId,
        p_user_id: targetUserId,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      if (!result.success) {
        toast.error(result.error || "Erreur lors du unmute");
        return false;
      }

      toast.success("Membre unmute avec succès");
      await fetchMutedMembers();
      return true;
    } catch (error) {
      console.error("Error unmuting member:", error);
      toast.error("Erreur lors du unmute");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isUserMuted = (userId: string) => {
    const mute = mutedMembers.find((m) => m.user_id === userId);
    return Boolean(mute && new Date(mute.expires_at) > new Date());
  };

  const getMuteInfo = (userId: string) => {
    return mutedMembers.find(
      (m) => m.user_id === userId && new Date(m.expires_at) > new Date(),
    );
  };

  return {
    mutedMembers,
    isMuted,
    muteExpiresAt,
    loading,
    muteMember,
    unmuteMember,
    isUserMuted,
    getMuteInfo,
    refresh: fetchMutedMembers,
  };
};
