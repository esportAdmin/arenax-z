"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Club {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  total_xp?: number;
  total_predictions: number;
  total_wins: number;
  [key: string]: unknown;
}

export interface ClubMember {
  id: string;
  club_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  xp_contributed: number;
  predictions_count: number;
  wins_count: number;
  joined_at: string;
  [key: string]: unknown;
}

export interface ActiveWar {
  id: string;
  challenger_id: string;
  defender_id: string;
  challenger_xp: number;
  defender_xp: number;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

interface UseClubDetailReturn {
  club: Club | null;
  members: ClubMember[];
  myMembership: ClubMember | null;
  activeWar: ActiveWar | null;
  loading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useClubDetail(slug: string): UseClubDetailReturn {
  // ✅ On récupère aussi `loading` de l'auth pour attendre la session
  const { user, loading: authLoading } = useAuth();

  // Primitif stable — évite les re-renders infinis liés à la référence objet
  const userId = user?.id ?? null;

  const [club, setClub] = useState<Club | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [myMembership, setMyMembership] = useState<ClubMember | null>(null);
  const [activeWar, setActiveWar] = useState<ActiveWar | null>(null);
  const [loading, setLoading] = useState(true);

  // Guard contre les setState sur un composant démonté
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    // ✅ FIX RACE CONDITION : on attend que l'auth soit résolue
    //    avant de lancer les requêtes — sinon le JWT n'est pas
    //    encore injecté dans le client Supabase et membership = null
    if (authLoading) return;

    // Guard slug
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // ── 1. Club ──────────────────────────────────────────────────────────

      const { data: clubData, error: clubError } = await supabase
        .from("clubs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (clubError) {
        console.error("[useClubDetail] Club fetch error:", clubError.message);
        if (isMountedRef.current) {
          setClub(null);
          setMembers([]);
          setMyMembership(null);
          setActiveWar(null);
        }
        return;
      }

      if (!clubData) {
        if (isMountedRef.current) {
          setClub(null);
          setMembers([]);
          setMyMembership(null);
          setActiveWar(null);
        }
        return;
      }

      const clubId = clubData.id;

      // ── 2. Requêtes parallèles ───────────────────────────────────────────

      const [membersResult, membershipResult, warResult] = await Promise.all([
        supabase.from("club_members").select("*").eq("club_id", clubId),

        userId
          ? supabase
              .from("club_members")
              .select("*")
              .eq("club_id", clubId)
              .eq("user_id", userId)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null }),

        supabase
          .from("club_wars")
          .select("*")
          .or(`challenger_id.eq.${clubId},defender_id.eq.${clubId}`)
          .eq("status", "active")
          .maybeSingle(),
      ]);

      if (process.env.NODE_ENV === "development") {
        console.log("[useClubDetail] AUTH LOADING:", authLoading);
        console.log("[useClubDetail] USER:", userId);
        console.log("[useClubDetail] MY MEMBERSHIP:", membershipResult.data);
        console.log(
          "[useClubDetail] MEMBERSHIP ERROR:",
          membershipResult.error,
        );
        console.log(
          "[useClubDetail] IS ADMIN:",
          membershipResult.data?.role === "owner" ||
            membershipResult.data?.role === "admin",
        );
      }

      if (membershipResult.error) {
        console.error(
          "[useClubDetail] Membership error:",
          membershipResult.error.message,
        );
      }

      // ── 3. Mise à jour atomique ──────────────────────────────────────────

      if (isMountedRef.current) {
        setClub(clubData as Club);
        setMembers((membersResult.data as ClubMember[]) ?? []);
        setMyMembership((membershipResult.data as ClubMember | null) ?? null);
        setActiveWar((warResult.data as ActiveWar | null) ?? null);
      }
    } catch (err) {
      console.error("[useClubDetail] Unexpected error:", err);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
    // ✅ authLoading dans les deps : re-déclenche quand la session est prête
  }, [slug, userId, authLoading]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isAdmin =
    myMembership?.role === "owner" || myMembership?.role === "admin";

  return { club, members, myMembership, activeWar, loading, isAdmin, refresh };
}
