"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type TierPromotionState = {
  open: boolean;
  tier: string | null;
  close: () => void;
};

export const useTierPromotion = (): TierPromotionState => {
  const { user } = useAuth();
  const [tier, setTier] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("tier-promotion-listener")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newRow = payload.new as any;

          if (newRow?.type === "tier_promotion") {
            const match = newRow.message?.match(/division (.+)$/i);
            const extractedTier = match ? match[1].toLowerCase() : null;

            if (extractedTier) {
              setTier(extractedTier);
              setOpen(true);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const close = () => setOpen(false);

  return { open, tier, close };
};
