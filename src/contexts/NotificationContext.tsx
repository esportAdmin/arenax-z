import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Target, Zap, Star, Gift, CheckCircle, 
  TrendingUp, Flame, X, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Sound effects
const playNotificationSound = (type: NotificationType) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTone = (freq: number, duration: number, delay: number = 0, type: OscillatorType = "sine") => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = type;
      
      const startTime = audioContext.currentTime + delay;
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    switch (type) {
      case "level_up":
        playTone(523.25, 0.2, 0);
        playTone(659.25, 0.2, 0.1);
        playTone(783.99, 0.2, 0.2);
        playTone(1046.50, 0.4, 0.3);
        break;
      case "challenge_complete":
        playTone(659.25, 0.15, 0);
        playTone(783.99, 0.15, 0.1);
        playTone(987.77, 0.25, 0.2);
        break;
      case "reward_claimed":
        playTone(523.25, 0.1, 0);
        playTone(783.99, 0.2, 0.1);
        break;
      case "xp_gained":
        playTone(880, 0.1, 0);
        break;
      case "streak":
        playTone(440, 0.1, 0);
        playTone(554.37, 0.1, 0.08);
        playTone(659.25, 0.15, 0.16);
        break;
      case "achievement":
        playTone(523.25, 0.15, 0);
        playTone(659.25, 0.15, 0.12);
        playTone(783.99, 0.15, 0.24);
        playTone(1046.50, 0.3, 0.36);
        break;
      default:
        playTone(600, 0.1, 0);
    }
  } catch (e) {
    console.log("Audio not supported");
  }
};

const notificationConfig: Record<NotificationType, { icon: React.ElementType; gradient: string; }> = {
  level_up: { icon: TrendingUp, gradient: "from-amber-500 to-orange-500" },
  challenge_complete: { icon: Target, gradient: "from-emerald-500 to-teal-500" },
  reward_claimed: { icon: Gift, gradient: "from-purple-500 to-pink-500" },
  xp_gained: { icon: Zap, gradient: "from-primary to-secondary" },
  streak: { icon: Flame, gradient: "from-orange-500 to-red-500" },
  achievement: { icon: Trophy, gradient: "from-amber-400 to-yellow-500" },
  info: { icon: Bell, gradient: "from-blue-500 to-cyan-500" },
};

function NotificationItem({ notification, onRemove }: { notification: GameNotification; onRemove: () => void }) {
  const config = notificationConfig[notification.type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, notification.duration || 5000);
    return () => clearTimeout(timer);
  }, [notification.duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className="pointer-events-auto"
    >
      <div className={cn(
        "relative flex items-start gap-3 p-4 rounded-xl",
        "bg-background/95 backdrop-blur-lg border border-border/50",
        "shadow-lg shadow-black/20",
        "min-w-[300px] max-w-[400px]"
      )}>
        {/* Gradient accent line */}
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b",
          config.gradient
        )} />

        {/* Icon */}
        <div className={cn(
          "shrink-0 p-2 rounded-lg bg-gradient-to-br text-white",
          config.gradient
        )}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-bold text-sm truncate">
              {notification.title}
            </h4>
            {notification.value && (
              <span className={cn(
                "shrink-0 px-2 py-0.5 rounded-full text-xs font-bold",
                "bg-gradient-to-r text-white",
                config.gradient
              )}>
                {notification.value}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {notification.message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Progress bar */}
        <motion.div
          className={cn(
            "absolute bottom-0 left-0 h-0.5 rounded-b-xl bg-gradient-to-r",
            config.gradient
          )}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: (notification.duration || 5000) / 1000, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  
  // Get user for persisting notifications - use a ref to avoid re-renders
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id || null);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const addNotification = useCallback((notification: Omit<GameNotification, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    playNotificationSound(notification.type);
    
    // Persist to database if user is logged in
    if (userId) {
      supabase.from("user_notifications").insert({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        value: notification.value?.toString() || null,
      }).then(({ error }) => {
        if (error) console.error("Error saving notification:", error);
      });
    }
  }, [userId]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      
      {/* Notification container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={() => removeNotification(notification.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

// Convenience hooks for specific notification types
export function useGameNotifications() {
  const { addNotification } = useNotifications();

  const notifyLevelUp = useCallback((newLevel: number) => {
    addNotification({
      type: "level_up",
      title: "Niveau supérieur !",
      message: `Félicitations ! Vous avez atteint le niveau ${newLevel}`,
      value: `Niv. ${newLevel}`,
      duration: 6000,
    });
  }, [addNotification]);

  const notifyChallengeComplete = useCallback((challengeTitle: string, xpReward: number) => {
    addNotification({
      type: "challenge_complete",
      title: "Défi terminé !",
      message: challengeTitle,
      value: `+${xpReward} XP`,
      duration: 5000,
    });
  }, [addNotification]);

  const notifyRewardClaimed = useCallback((rewardTitle: string, rewardValue: string) => {
    addNotification({
      type: "reward_claimed",
      title: "Récompense réclamée !",
      message: rewardTitle,
      value: rewardValue,
      duration: 5000,
    });
  }, [addNotification]);

  const notifyXpGained = useCallback((amount: number, reason?: string) => {
    addNotification({
      type: "xp_gained",
      title: "XP gagné",
      message: reason || "Continue comme ça !",
      value: `+${amount} XP`,
      duration: 3000,
    });
  }, [addNotification]);

  const notifyStreak = useCallback((streakCount: number) => {
    addNotification({
      type: "streak",
      title: "Série en cours !",
      message: `Vous avez une série de ${streakCount} jours`,
      value: `🔥 ${streakCount}`,
      duration: 4000,
    });
  }, [addNotification]);

  const notifyAchievement = useCallback((achievementName: string, description: string) => {
    addNotification({
      type: "achievement",
      title: "Succès débloqué !",
      message: `${achievementName}: ${description}`,
      duration: 6000,
    });
  }, [addNotification]);

  return {
    notifyLevelUp,
    notifyChallengeComplete,
    notifyRewardClaimed,
    notifyXpGained,
    notifyStreak,
    notifyAchievement,
  };
}
