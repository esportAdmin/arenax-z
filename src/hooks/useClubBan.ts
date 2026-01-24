import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BannedMember {
  id: string;
  club_id: string;
  user_id: string;
  banned_by: string;
  reason: string | null;
  banned_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export const useClubBan = (clubId: string | null) => {
  const [bannedMembers, setBannedMembers] = useState<BannedMember[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBannedMembers = useCallback(async () => {
    if (!clubId) return;

    const { data, error } = await supabase
      .from("club_banned_members")
      .select("*")
      .eq("club_id", clubId)
      .order("banned_at", { ascending: false });

    if (!error && data) {
      // Fetch profiles for banned members
      const userIds = data.map((b) => b.user_id);
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name, avatar_url")
          .in("user_id", userIds);

        const enrichedData = data.map((ban) => ({
          ...ban,
          profile:
            profiles?.find((p) => p.user_id === ban.user_id) || undefined,
        }));
        setBannedMembers(enrichedData);
      } else {
        setBannedMembers([]);
      }
    }
  }, [clubId]);

  useEffect(() => {
    fetchBannedMembers();
  }, [fetchBannedMembers]);

  const banMember = async (targetUserId: string, reason?: string) => {
    if (!clubId) return false;
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc("ban_club_member", {
        p_club_id: clubId,
        p_user_id: targetUserId,
        p_reason: reason ?? undefined,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        toast.error(result.error || "Erreur lors du bannissement");
        return false;
      }

      toast.success("Membre banni avec succès");
      await fetchBannedMembers();
      return true;
    } catch (error) {
      console.error("Error banning member:", error);
      toast.error("Erreur lors du bannissement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unbanMember = async (targetUserId: string) => {
    if (!clubId) return false;
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc("unban_club_member", {
        p_club_id: clubId,
        p_user_id: targetUserId,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        toast.error(result.error || "Erreur lors du débannissement");
        return false;
      }

      toast.success("Membre débanni avec succès");
      await fetchBannedMembers();
      return true;
    } catch (error) {
      console.error("Error unbanning member:", error);
      toast.error("Erreur lors du débannissement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isUserBanned = (userId: string) => {
    return bannedMembers.some((b) => b.user_id === userId);
  };

  return {
    bannedMembers,
    loading,
    banMember,
    unbanMember,
    isUserBanned,
    refresh: fetchBannedMembers,
  };
};
