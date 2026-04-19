"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalQaUser } from "@/lib/dev-auth";

export function useMyClub() {
  const { user } = useAuth();
  const [clubId, setClubId] = useState<string | null>(null);
  const isLocalQa = isLocalQaUser(user);

  const loadClub = useCallback(async () => {
    if (isLocalQa) {
      setClubId("club-shadow-legion");
      return;
    }

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) return;

    try {
      const { data } = await supabase
        .from("club_members")
        .select("club_id")
        .eq("user_id", authUser.id)
        .maybeSingle();

      if (data) {
        setClubId(data.club_id);
      }
    } catch {
      setClubId(null);
    }
  }, [isLocalQa]);

  useEffect(() => {
    void loadClub();
  }, [loadClub]);

  return clubId;
}
