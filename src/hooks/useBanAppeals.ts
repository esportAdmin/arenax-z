import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface BanAppeal {
  id: string;
  club_id: string;
  user_id: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  admin_response: string | null;
  responded_by: string | null;
  responded_at: string | null;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export const useBanAppeals = (clubId: string | null) => {
  const { user } = useAuth();
  const [appeals, setAppeals] = useState<BanAppeal[]>([]);
  const [myAppeal, setMyAppeal] = useState<BanAppeal | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAppeals = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("club_ban_appeals")
        .select("*")
        .eq("club_id", clubId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        // Fetch profiles
        const userIds = [...new Set(data.map((a) => a.user_id))];
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("user_id, display_name, avatar_url")
            .in("user_id", userIds);

          const enrichedData = data.map((appeal) => ({
            ...appeal,
            status: appeal.status as BanAppeal["status"],
            profile:
              profiles?.find((p) => p.user_id === appeal.user_id) || undefined,
          }));
          setAppeals(enrichedData);
        } else {
          setAppeals([]);
        }
      }
    } catch (error) {
      console.error("Error fetching appeals:", error);
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  const fetchMyAppeal = useCallback(async () => {
    if (!clubId || !user) return;

    try {
      const { data, error } = await supabase
        .from("club_ban_appeals")
        .select("*")
        .eq("club_id", clubId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setMyAppeal({
          ...data,
          status: data.status as BanAppeal["status"],
        });
      } else {
        setMyAppeal(null);
      }
    } catch (error) {
      console.error("Error fetching my appeal:", error);
    }
  }, [clubId, user]);

  useEffect(() => {
    fetchAppeals();
    fetchMyAppeal();
  }, [fetchAppeals, fetchMyAppeal]);

  const submitAppeal = async (reason: string) => {
    if (!clubId) return false;
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc("submit_ban_appeal", {
        p_club_id: clubId,
        p_reason: reason,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        toast.error(result.error || "Erreur lors de la soumission");
        return false;
      }

      toast.success("Appel soumis avec succès");
      await fetchMyAppeal();
      return true;
    } catch (error) {
      console.error("Error submitting appeal:", error);
      toast.error("Erreur lors de la soumission");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const respondToAppeal = async (
    appealId: string,
    approved: boolean,
    response?: string,
  ) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc("respond_to_ban_appeal", {
        p_appeal_id: appealId,
        p_approved: approved,
        p_response: response ?? undefined,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (!result.success) {
        toast.error(result.error || "Erreur lors de la réponse");
        return false;
      }

      toast.success(approved ? "Appel accepté" : "Appel refusé");
      await fetchAppeals();
      return true;
    } catch (error) {
      console.error("Error responding to appeal:", error);
      toast.error("Erreur lors de la réponse");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const pendingAppeals = appeals.filter((a) => a.status === "pending");

  return {
    appeals,
    pendingAppeals,
    myAppeal,
    loading,
    submitAppeal,
    respondToAppeal,
    refresh: fetchAppeals,
  };
};
