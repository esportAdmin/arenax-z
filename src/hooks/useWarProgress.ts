"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type WarProgress = {
  attackerXp: number;
  defenderXp: number;
};

export function useWarProgress(
  warId?: string,
  challengerId?: string,
  defenderId?: string,
) {
  const [progress, setProgress] = useState<WarProgress>({
    attackerXp: 0,
    defenderXp: 0,
  });

  const load = useCallback(async () => {
    if (!warId || !challengerId || !defenderId) return;

    const { data: contributions, error } = await supabase
      .from("war_contributions")
      .select(
        `
        user_id,
        xp
      `,
      )
      .eq("war_id", warId);

    if (error) {
      console.error("War progress load error:", error);
      return;
    }

    if (!contributions || contributions.length === 0) {
      setProgress({
        attackerXp: 0,
        defenderXp: 0,
      });
      return;
    }

    const contributorIds = [...new Set(contributions.map((c) => c.user_id))];

    const { data: memberships, error: membershipError } = await supabase
      .from("club_members")
      .select("user_id, club_id")
      .in("user_id", contributorIds);

    if (membershipError) {
      console.error("Club membership load error:", membershipError);
      return;
    }

    let attackerXp = 0;
    let defenderXp = 0;

    contributions.forEach((contribution) => {
      const membership = memberships?.find(
        (m) => m.user_id === contribution.user_id,
      );

      if (!membership) return;

      if (membership.club_id === challengerId) {
        attackerXp += contribution.xp ?? 0;
      }

      if (membership.club_id === defenderId) {
        defenderXp += contribution.xp ?? 0;
      }
    });

    setProgress({
      attackerXp,
      defenderXp,
    });
  }, [warId, challengerId, defenderId]);

  useEffect(() => {
    void load();

    if (!warId) return;

    const channel = supabase
      .channel(`war-progress-${warId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "war_contributions",
          filter: `war_id=eq.${warId}`,
        },
        () => {
          void load();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [warId, challengerId, defenderId, load]);

  return progress;
}
