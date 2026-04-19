"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ClubLeaderboard = {
  club_id: string;
  club_name: string;
  territories: number;
  capitals: number;
  wins: number;
};

export function useClubLeaderboard() {
  const [clubs, setClubs] = useState<ClubLeaderboard[]>([]);

  async function load() {
    const { data, error } = await supabase.rpc("get_club_leaderboard");

    if (error) {
      console.error(error);
      return;
    }

    setClubs(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  return clubs;
}
