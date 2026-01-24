// src/hooks/useClubs.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  owner_id: string;
  is_public: boolean;
  max_members: number;
  member_count: number;
  total_xp: number;
  total_predictions: number;
  total_wins: number;
  created_at: string;
}

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  role: string;
  xp_contributed: number;
  predictions_count: number;
  wins_count: number;
  joined_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    current_level: number;
  } | null;
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

export function useClubs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myClub, setMyClub] = useState<Club | null>(null);
  const [myMembership, setMyMembership] = useState<ClubMember | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClubs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .order("member_count", { ascending: false })
        .limit(50);

      if (error) throw error;
      setClubs((data || []) as Club[]);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  }, []);

  const fetchMyClub = useCallback(async () => {
    if (!user) {
      setMyClub(null);
      setMyMembership(null);
      return;
    }

    try {
      const { data: membershipData, error: membershipError } = await supabase
        .from("club_members")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (membershipError) throw membershipError;

      if (membershipData) {
        setMyMembership(membershipData as ClubMember);

        const { data: clubData, error: clubError } = await supabase
          .from("clubs")
          .select("*")
          .eq("id", membershipData.club_id)
          .single();

        if (clubError) throw clubError;
        setMyClub(clubData as Club);
      } else {
        setMyClub(null);
        setMyMembership(null);
      }
    } catch (error) {
      console.error("Error fetching my club:", error);
    }
  }, [user]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchClubs(), fetchMyClub()]);
      setLoading(false);
    };
    void init();
  }, [fetchClubs, fetchMyClub]);

  const createClub = async (
    name: string,
    description?: string,
    isPublic = true,
  ) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour créer un club",
        variant: "destructive",
      });
      return { success: false as const };
    }

    try {
      const { data, error } = await supabase.rpc("create_club", {
        p_name: name,
        p_description: toOptionalString(description ?? undefined),
        p_is_public: isPublic,
      });

      if (error) throw error;

      const result = data as {
        success: boolean;
        club_id?: string;
        error?: string;
      };

      if (result.success) {
        toast({
          title: "Club créé !",
          description: `Votre club "${name}" a été créé avec succès`,
        });
        await Promise.all([fetchClubs(), fetchMyClub()]);
        return { success: true as const, clubId: result.club_id };
      }

      throw new Error(result.error);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de créer le club",
        variant: "destructive",
      });
      return { success: false as const };
    }
  };

  const joinClub = async (clubId: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour rejoindre un club",
        variant: "destructive",
      });
      return { success: false as const };
    }

    try {
      const { data, error } = await supabase.rpc("join_club", {
        p_club_id: clubId,
      });

      if (error) throw error;

      const result = data as {
        success: boolean;
        pending?: boolean;
        message?: string;
        error?: string;
      };

      if (result.success) {
        if (result.pending) {
          toast({
            title: "Demande envoyée",
            description:
              "Votre demande d'adhésion a été envoyée aux administrateurs",
          });
        } else {
          toast({
            title: "Bienvenue !",
            description: "Vous avez rejoint le club avec succès",
          });
          await Promise.all([fetchClubs(), fetchMyClub()]);
        }
        return { success: true as const, pending: result.pending };
      }

      throw new Error(result.error);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de rejoindre le club",
        variant: "destructive",
      });
      return { success: false as const };
    }
  };

  const leaveClub = async () => {
    if (!myClub) return { success: false as const };

    try {
      const { data, error } = await supabase.rpc("leave_club", {
        p_club_id: myClub.id,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };

      if (result.success) {
        toast({
          title: "Club quitté",
          description: "Vous avez quitté le club",
        });
        await Promise.all([fetchClubs(), fetchMyClub()]);
        return { success: true as const };
      }

      throw new Error(result.error);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de quitter le club",
        variant: "destructive",
      });
      return { success: false as const };
    }
  };

  const searchClubs = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .or(`name.ilike.%${query}%,slug.ilike.%${query}%`)
        .order("member_count", { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []) as Club[];
    } catch (error) {
      console.error("Error searching clubs:", error);
      return [] as Club[];
    }
  };

  return {
    clubs,
    myClub,
    myMembership,
    loading,
    createClub,
    joinClub,
    leaveClub,
    searchClubs,
    refresh: () => Promise.all([fetchClubs(), fetchMyClub()]),
  };
}

export function useClubMembers(clubId: string | null) {
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clubId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const fetchMembers = async () => {
      try {
        const { data: membersData, error: membersError } = await supabase
          .from("club_members")
          .select("*")
          .eq("club_id", clubId)
          .order("xp_contributed", { ascending: false });

        if (membersError) throw membersError;

        const userIds = (membersData || []).map((m) => m.user_id);
        if (userIds.length === 0) {
          setMembers([]);
          return;
        }

        const { data: profilesData } = await supabase
          .from("public_leaderboard")
          .select("user_id, display_name, username, avatar_url, current_level")
          .in("user_id", userIds);

        const membersWithProfiles = (membersData || []).map((member) => ({
          ...(member as ClubMember),
          profile:
            profilesData?.find((p) => p.user_id === member.user_id) || null,
        }));

        setMembers(membersWithProfiles as ClubMember[]);
      } catch (error) {
        console.error("Error fetching club members:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchMembers();
  }, [clubId]);

  return { members, loading };
}
