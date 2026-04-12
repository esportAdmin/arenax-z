import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalQaUser } from "@/lib/dev-auth";

export interface StoredNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  value: string | null;
  is_read: boolean;
  created_at: string;
}

interface UseNotificationHistoryOptions {
  enabled?: boolean;
}

const FALLBACK_NOTIFICATIONS: StoredNotification[] = [
  {
    id: "qa-notif-1",
    type: "reward_claimed",
    title: "Reward claimed",
    message: "Momentum Boost was added to your vault progress.",
    value: "+250 ARENA",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "qa-notif-2",
    type: "challenge_complete",
    title: "Challenge complete",
    message: "Daily comeback mission secured for today.",
    value: "+50 ARENA",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

export function useNotificationHistory(
  options: UseNotificationHistoryOptions = {},
) {
  const { enabled = true } = options;
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<StoredNotification[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [unreadCount, setUnreadCount] = useState(0);
  const isLocalQa = isLocalQaUser(user);

  const fetchNotifications = useCallback(async () => {
    if (!enabled || !user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    if (isLocalQa) {
      setNotifications(FALLBACK_NOTIFICATIONS);
      setUnreadCount(FALLBACK_NOTIFICATIONS.filter((entry) => !entry.is_read).length);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount((data || []).filter((entry) => !entry.is_read).length);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [enabled, isLocalQa, user]);

  useEffect(() => {
    if (!enabled) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchNotifications();
  }, [enabled, fetchNotifications]);

  useEffect(() => {
    if (!enabled || !user || isLocalQa) return;

    const channel = supabase
      .channel("user_notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as StoredNotification;
          setNotifications((previous) => [newNotification, ...previous]);
          setUnreadCount((previous) => previous + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, isLocalQa, user]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    if (isLocalQa) {
      setNotifications((previous) =>
        previous.map((entry) =>
          entry.id === notificationId ? { ...entry, is_read: true } : entry,
        ),
      );
      setUnreadCount((previous) => Math.max(0, previous - 1));
      return;
    }

    try {
      const { error } = await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) throw error;

      setNotifications((previous) =>
        previous.map((entry) =>
          entry.id === notificationId ? { ...entry, is_read: true } : entry,
        ),
      );
      setUnreadCount((previous) => Math.max(0, previous - 1));
    } catch {
      return;
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    if (isLocalQa) {
      setNotifications((previous) =>
        previous.map((entry) => ({ ...entry, is_read: true })),
      );
      setUnreadCount(0);
      return;
    }

    try {
      const { error } = await supabase
        .from("user_notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications((previous) =>
        previous.map((entry) => ({ ...entry, is_read: true })),
      );
      setUnreadCount(0);
    } catch {
      return;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return;

    if (isLocalQa) {
      const notification = notifications.find((entry) => entry.id === notificationId);
      setNotifications((previous) =>
        previous.filter((entry) => entry.id !== notificationId),
      );
      if (notification && !notification.is_read) {
        setUnreadCount((previous) => Math.max(0, previous - 1));
      }
      return;
    }

    try {
      const notification = notifications.find((entry) => entry.id === notificationId);

      const { error } = await supabase
        .from("user_notifications")
        .delete()
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) throw error;

      setNotifications((previous) =>
        previous.filter((entry) => entry.id !== notificationId),
      );
      if (notification && !notification.is_read) {
        setUnreadCount((previous) => Math.max(0, previous - 1));
      }
    } catch {
      return;
    }
  };

  const clearAll = async () => {
    if (!user) return;

    if (isLocalQa) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const { error } = await supabase
        .from("user_notifications")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setNotifications([]);
      setUnreadCount(0);
    } catch {
      return;
    }
  };

  const saveNotification = async (notification: {
    type: string;
    title: string;
    message: string;
    value?: string;
  }) => {
    if (!user) return;

    if (isLocalQa) {
      const newNotification: StoredNotification = {
        id: `qa-notif-${Date.now()}`,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        value: notification.value || null,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      setNotifications((previous) => [newNotification, ...previous]);
      setUnreadCount((previous) => previous + 1);
      return;
    }

    try {
      const { error } = await supabase.from("user_notifications").insert({
        user_id: user.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        value: notification.value || null,
      });

      if (error) throw error;
    } catch {
      return;
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    saveNotification,
    refresh: fetchNotifications,
  };
}
