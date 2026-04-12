"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface WarNotification {
  id: string;
  message: string;
  created_at: string;
}

export function useWarNotifications() {
  const [notifications, setNotifications] = useState<WarNotification[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("war-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "war_contributions",
        },
        (payload) => {
          setNotifications((prev) => [
            {
              id: payload.new.id,
              message: `⚔ +${payload.new.xp} XP contributed`,
              created_at: payload.new.created_at,
            },
            ...prev.slice(0, 10),
          ]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return notifications;
}
