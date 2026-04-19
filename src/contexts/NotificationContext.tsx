"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Target,
  Zap,
  Gift,
  TrendingUp,
  Flame,
  X,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type NotificationType =
  | "level_up"
  | "challenge_complete"
  | "reward_claimed"
  | "xp_gained"
  | "streak"
  | "achievement"
  | "info";

export interface GameNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  value?: string | number;
  duration?: number;
}

interface NotificationContextType {
  notifications: GameNotification[];
  addNotification: (notification: Omit<GameNotification, "id">) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  notifyLevelUp: (lvl: number) => void;
  notifyXp: (xp: number) => void;
  notifyChallengeComplete: (title: string, xp: number) => void;
  notifyRewardClaimed: (title: string, value: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// ─────────────────────────────────────────────
// SOUND
// ─────────────────────────────────────────────

const playNotificationSound = (type: NotificationType) => {
  if (typeof window === "undefined") return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioCtx();

    const playTone = (
      freq: number,
      duration: number,
      delay = 0,
      type: OscillatorType = "sine",
    ) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.value = freq;
      osc.type = type;

      const start = audioContext.currentTime + delay;

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

      osc.start(start);
      osc.stop(start + duration);
    };

    if (type === "level_up") {
      playTone(523.25, 0.2);
      playTone(783.99, 0.2, 0.1);
    } else {
      playTone(600, 0.1);
    }
  } catch {
    console.log("Audio not supported");
  }
};

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────

const notificationConfig: Record<
  NotificationType,
  { icon: React.ElementType; gradient: string }
> = {
  level_up: { icon: TrendingUp, gradient: "from-amber-500 to-orange-500" },
  challenge_complete: {
    icon: Target,
    gradient: "from-emerald-500 to-teal-500",
  },
  reward_claimed: { icon: Gift, gradient: "from-purple-500 to-pink-500" },
  xp_gained: { icon: Zap, gradient: "from-primary to-secondary" },
  streak: { icon: Flame, gradient: "from-orange-500 to-red-500" },
  achievement: { icon: Trophy, gradient: "from-amber-400 to-yellow-500" },
  info: { icon: Bell, gradient: "from-blue-500 to-cyan-500" },
};

// ─────────────────────────────────────────────
// ITEM
// ─────────────────────────────────────────────

function NotificationItem({
  notification,
  onRemove,
}: {
  notification: GameNotification;
  onRemove: () => void;
}) {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(onRemove, notification.duration || 5000);
    return () => clearTimeout(timer);
  }, [notification.duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="pointer-events-auto"
    >
      <div className="relative flex gap-3 p-4 rounded-xl bg-background/95 border border-border/50">
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b",
            config.gradient,
          )}
        />

        <div
          className={cn(
            "p-2 rounded-lg text-white bg-gradient-to-br",
            config.gradient,
          )}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-sm">{notification.title}</h4>
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
        </div>

        <button onClick={onRemove}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PROVIDER (FIX CRITIQUE ICI)
// ─────────────────────────────────────────────

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      console.warn("❌ Supabase not initialized");
      return;
    }

    let mounted = true;

    // SESSION INIT
    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error("SESSION ERROR:", error);
        return;
      }

      setUserId(data.session?.user?.id ?? null);
    });

    // LISTENER
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const addNotification = useCallback(
    (notification: Omit<GameNotification, "id">) => {
      const id = crypto.randomUUID();
      const newNotification = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);
      playNotificationSound(notification.type);

      // SAFE INSERT
      if (!supabase || !userId) return;

      supabase
        .from("user_notifications")
        .insert({
          user_id: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          value: notification.value?.toString() ?? null,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Notification insert error:", error);
          }
        });
    },
    [userId],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const notifyLevelUp = useCallback(
    (lvl: number) =>
      addNotification({
        type: "level_up",
        title: "Level up",
        message: `Level ${lvl}`,
      }),
    [addNotification],
  );

  const notifyXp = useCallback(
    (xp: number) =>
      addNotification({
        type: "xp_gained",
        title: "XP gained",
        message: `+${xp}`,
      }),
    [addNotification],
  );

  const notifyChallengeComplete = useCallback(
    (title: string, xp: number) =>
      addNotification({
        type: "challenge_complete",
        title: "Challenge complete",
        message: `${title} termine`,
        value: `+${xp} XP`,
      }),
    [addNotification],
  );

  const notifyRewardClaimed = useCallback(
    (title: string, value: string) =>
      addNotification({
        type: "reward_claimed",
        title: "Reward claimed",
        message: title,
        value,
      }),
    [addNotification],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        notifyLevelUp,
        notifyXp,
        notifyChallengeComplete,
        notifyRewardClaimed,
      }}
    >
      {children}

      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRemove={() => removeNotification(n.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within provider");
  }
  return ctx;
}

export function useGameNotifications() {
  const {
    notifyLevelUp,
    notifyXp,
    notifyChallengeComplete,
    notifyRewardClaimed,
  } = useNotifications();

  return {
    notifyLevelUp,
    notifyXp,
    notifyChallengeComplete,
    notifyRewardClaimed,
  };
}
