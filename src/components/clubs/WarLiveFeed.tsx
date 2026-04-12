"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame } from "lucide-react";

interface FeedItem {
  id: string;
  user_id: string | null;
  xp_amount: number | null;
  created_at: string;
}

interface Props {
  clubId: string;
}

export function WarLiveFeed({ clubId }: Props) {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  const loadFeed = useCallback(async () => {
    const { data } = await supabase
      .from("club_activities")
      .select("*")
      .eq("club_id", clubId)
      .order("created_at", { ascending: false })
      .limit(10);

    setFeed((data as FeedItem[]) || []);
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;

    void loadFeed();

    const channel = supabase
      .channel("war-live-feed")

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "club_activities",
        },
        (payload) => {
          const newItem = payload.new as FeedItem;

          setFeed((prev) => [newItem, ...prev].slice(0, 10));
        },
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clubId, loadFeed]);

  return (
    <div className="glass-card p-6 mt-4">
      <div className="flex items-center gap-2 mb-4 font-bold">
        <Flame className="w-4 h-4 text-orange-500" />
        WAR LIVE FEED
      </div>

      <div className="space-y-2 text-sm">
        {feed.length === 0 && (
          <div className="text-muted-foreground">No activity yet</div>
        )}

        {feed.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b border-border/50 pb-1"
          >
            <span>{(item.user_id || "system").slice(0, 6)}</span>

            <span className="font-semibold text-primary">
              +{item.xp_amount || 0} XP
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
