// src/hooks/useClubDetail.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Club, ClubMember } from "./useClubs";

export interface ClubActivity {
  id: string;
  club_id: string;
  user_id: string | null;
  activity_type: string;
  title: string;
  description: string | null;
  xp_amount: number;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface JoinRequest {
  id: string;
  club_id: string;
  user_id: string;
  status: string;
  message: string | null;
  created_at: string;
  profile?: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    current_level: number;
  } | null;
}

/**
 * Normalize "public_leaderboard" row to the shape expected by UI types.
 *
 * @example
 * normalizePublicProfile({ current_level: null }).current_level; // 0
 */
function normalizePublicProfile<T extends { current_level: number | null }>(
  p: T,
) {
  return { ...p, current_level: p.current_level ?? 0 };
}

/**
 * Ensure xp_amount is always a number (DB can return null).
 *
 * @example
 * normalizeActivity({ xp_amount: null }).xp_amount; // 0
 */
function normalizeActivity<T extends { xp_amount: number | null }>(a: T) {
  return { ...a, xp_amount: a.xp_amount ?? 0 };
}

export function useClubDetail(slug: string | undefined) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [activities, setActivities] = useState<ClubActivity[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [myMembership, setMyMembership] = useState<ClubMember | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClub = useCallback(async () => {
    if (!slug) return;

    try {
      const { data: clubData, error: clubError } = await supabase
        .from("clubs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (clubError) throw clubError;

      if (!clubData) {
        setClub(null);
        setMembers([]);
        setActivities([]);
        setJoinRequests([]);
        setMyMembership(null);
        return;
      }

      setClub(clubData);

      const { data: membersData } = await supabase
        .from("club_members")
        .select("*")
        .eq("club_id", clubData.id)
        .order("xp_contributed", { ascending: false });

      if (membersData && membersData.length > 0) {
        const userIds = membersData.map((m) => m.user_id);

        const { data: profilesData } = await supabase
          .from("public_leaderboard")
          .select("user_id, display_name, username, avatar_url, current_level")
          .in("user_id", userIds);

        const safeProfiles =
          profilesData?.map((p) => normalizePublicProfile(p)) ?? [];

        const membersWithProfiles = membersData.map((member) => ({
          ...member,
          profile:
            safeProfiles.find((p) => p.user_id === member.user_id) || null,
        }));

        setMembers(membersWithProfiles as ClubMember[]);

        if (user) {
          const myMember = membersWithProfiles.find(
            (m) => m.user_id === user.id,
          );
          setMyMembership((myMember as ClubMember) || null);
        } else {
          setMyMembership(null);
        }
      } else {
        setMembers([]);
        setMyMembership(null);
      }

      // Fetch activities (only if member)
      if (user) {
        const { data: activitiesData } = await supabase
          .from("club_activities")
          .select("*")
          .eq("club_id", clubData.id)
          .order("created_at", { ascending: false })
          .limit(20);

        if (activitiesData && activitiesData.length > 0) {
          const normalized = activitiesData.map((a) =>
            normalizeActivity(a as any),
          );

          const activityUserIds = normalized
            .map((a) => a.user_id)
            .filter((v): v is string => typeof v === "string" && v.length > 0);

          if (activityUserIds.length > 0) {
            const { data: activityProfiles } = await supabase
              .from("public_leaderboard")
              .select("user_id, display_name, avatar_url")
              .in("user_id", activityUserIds);

            const activitiesWithProfiles: ClubActivity[] = normalized.map(
              (activity: any) => ({
                ...activity,
                profile:
                  activityProfiles?.find(
                    (p) => p.user_id === activity.user_id,
                  ) || null,
              }),
            );

            setActivities(activitiesWithProfiles);
          } else {
            setActivities(normalized as any);
          }
        } else {
          setActivities([]);
        }
      } else {
        setActivities([]);
      }

      // Fetch join requests (only for admins)
      if (user) {
        const membership = membersData?.find((m) => m.user_id === user.id);
        if (membership && ["owner", "admin"].includes(membership.role)) {
          const { data: requestsData } = await supabase
            .from("club_join_requests")
            .select("*")
            .eq("club_id", clubData.id)
            .eq("status", "pending")
            .order("created_at", { ascending: false });

          if (requestsData && requestsData.length > 0) {
            const requestUserIds = requestsData.map((r) => r.user_id);

            const { data: requestProfiles } = await supabase
              .from("public_leaderboard")
              .select(
                "user_id, display_name, username, avatar_url, current_level",
              )
              .in("user_id", requestUserIds);

            const safeProfiles =
              requestProfiles?.map((p) => normalizePublicProfile(p)) ?? [];

            const requestsWithProfiles: JoinRequest[] = requestsData.map(
              (request: any) => ({
                ...request,
                profile:
                  safeProfiles.find((p) => p.user_id === request.user_id) ||
                  null,
              }),
            );

            setJoinRequests(requestsWithProfiles);
          } else {
            setJoinRequests([]);
          }
        } else {
          setJoinRequests([]);
        }
      } else {
        setJoinRequests([]);
      }
    } catch (error) {
      console.error("Error fetching club detail:", error);
    } finally {
      setLoading(false);
    }
  }, [slug, user]);

  useEffect(() => {
    void fetchClub();
  }, [fetchClub]);

  const approveRequest = async (requestId: string) => {
    try {
      const { data, error } = await supabase.rpc("approve_join_request", {
        p_request_id: requestId,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      if (result.success) {
        toast({
          title: "Demande approuvée",
          description: "Le membre a été ajouté au club",
        });
        void fetchClub();
        return { success: true };
      }
      throw new Error(result.error);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { data, error } = await supabase.rpc("reject_join_request", {
        p_request_id: requestId,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      if (result.success) {
        toast({ title: "Demande refusée" });
        setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
        return { success: true };
      }
      throw new Error(result.error);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const { data, error } = await supabase.rpc("update_member_role", {
        p_member_id: memberId,
        p_new_role: newRole,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string };
      if (result.success) {
        toast({ title: "Rôle mis à jour" });
        void fetchClub();
        return { success: true };
      }
      throw new Error(result.error);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const isAdmin =
    !!myMembership && ["owner", "admin"].includes(myMembership.role);
  const isOwner = myMembership?.role === "owner";

  return {
    club,
    members,
    activities,
    joinRequests,
    myMembership,
    loading,
    isAdmin,
    isOwner,
    approveRequest,
    rejectRequest,
    updateMemberRole,
    refresh: fetchClub,
  };
}
