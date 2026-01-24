import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Bell,
  Trophy,
  Target,
  Zap,
  Star,
  Gift,
  Flame,
  Check,
  CheckCheck,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationHistory, StoredNotification } from "@/hooks/useNotificationHistory";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const typeConfig: Record<string, { icon: typeof Bell; gradient: string }> = {
  level_up: { icon: Trophy, gradient: "from-amber-500 to-orange-500" },
  challenge_complete: { icon: Target, gradient: "from-emerald-500 to-teal-500" },
  reward_claimed: { icon: Gift, gradient: "from-purple-500 to-pink-500" },
  xp_gained: { icon: Zap, gradient: "from-primary to-secondary" },
  streak: { icon: Flame, gradient: "from-orange-500 to-red-500" },
  achievement: { icon: Star, gradient: "from-amber-400 to-yellow-500" },
  info: { icon: Bell, gradient: "from-blue-500 to-cyan-500" },
};

function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: StoredNotification;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const config = typeConfig[notification.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={cn(
        "relative p-3 rounded-lg border transition-all group",
        notification.is_read
          ? "bg-muted/20 border-border/30"
          : "bg-muted/50 border-primary/20"
      )}
    >
      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />
      )}

      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "shrink-0 p-2 rounded-lg bg-gradient-to-br text-white",
            config.gradient
          )}
        >
          <Icon className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{notification.title}</h4>
            {notification.value && (
              <span
                className={cn(
                  "shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r text-white",
                  config.gradient
                )}
              >
                {notification.value}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {notification.message}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: fr,
            })}
          </p>
        </div>
      </div>

      {/* Actions - show on hover */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.is_read && (
          <button
            onClick={onMarkRead}
            className="p-1 rounded hover:bg-muted transition-colors"
            title="Marquer comme lu"
          >
            <Check className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-destructive/20 transition-colors"
          title="Supprimer"
        >
          <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    </motion.div>
  );
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationHistory();

  if (!user) {
    return (
      <Button variant="ghost" size="icon" className="relative" disabled>
        <Bell className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 border-border/50"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={markAllAsRead}
              >
                <CheckCheck className="w-3 h-3" />
                Tout lire
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs gap-1 text-destructive hover:text-destructive"
                onClick={clearAll}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">Aucune notification</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Vos notifications apparaîtront ici
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={() => markAsRead(notification.id)}
                    onDelete={() => deleteNotification(notification.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
