import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Bell,
  Check,
  CheckCheck,
  Flame,
  Gift,
  Loader2,
  Star,
  Target,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CountdownPill } from "@/components/engagement/CountdownPill";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationHistory, StoredNotification } from "@/hooks/useNotificationHistory";
import { getNextUtcMidnight } from "@/lib/countdown";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof Bell; accent: string }> = {
  level_up: { icon: Trophy, accent: "text-amber-300" },
  challenge_complete: { icon: Target, accent: "text-emerald-300" },
  reward_claimed: { icon: Gift, accent: "text-fuchsia-300" },
  xp_gained: { icon: Zap, accent: "text-cyan-300" },
  streak: { icon: Flame, accent: "text-orange-300" },
  achievement: { icon: Star, accent: "text-yellow-300" },
  info: { icon: Bell, accent: "text-blue-300" },
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
        "rounded-2xl border p-4 transition-all",
        notification.is_read
          ? "border-white/8 bg-white/[0.03]"
          : "border-cyan-400/20 bg-cyan-400/8 shadow-[0_0_22px_rgba(34,211,238,0.05)]",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Icon className={`h-4 w-4 ${config.accent}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="truncate text-sm font-semibold text-white">
                  {notification.title}
                </h4>
                {notification.value ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/80">
                    {notification.value}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                {notification.message}
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {formatDistanceToNow(new Date(notification.created_at), {
                  addSuffix: true,
                  locale: enUS,
                })}
              </p>
            </div>

            {!notification.is_read ? (
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
            ) : null}
          </div>

          <div className="mt-3 flex items-center gap-2">
            {!notification.is_read ? (
              <button
                onClick={onMarkRead}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 transition-colors hover:text-white"
              >
                <Check className="h-3 w-3" />
                Mark read
              </button>
            ) : null}

            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1 rounded-full border border-red-500/15 bg-red-500/5 px-3 py-1 text-xs text-red-300 transition-colors hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        </div>
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
  } = useNotificationHistory({ enabled: open });

  if (!user) {
    return (
      <Button variant="ghost" size="icon" className="relative" disabled>
        <Bell className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-black"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[min(92vw,26rem)] border-white/10 bg-[linear-gradient(180deg,rgba(11,18,38,0.98),rgba(7,11,24,0.98))] p-0"
        align="end"
        sideOffset={10}
      >
        <div className="border-b border-white/8 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="eyebrow-badge">Notification feed</div>
              <h3 className="mt-3 text-xl font-black text-white">
                Your command alerts
              </h3>
            </div>

            {unreadCount > 0 ? (
              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                {unreadCount} new
              </div>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <CountdownPill label="Daily reset" target={getNextUtcMidnight()} tone="cyan" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {unreadCount > 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            ) : null}

            {notifications.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-red-500/20 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                onClick={clearAll}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear all
              </Button>
            ) : null}
          </div>
        </div>

        <ScrollArea className="h-[420px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <Bell className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-sm text-slate-300">No alerts yet</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Level-ups, streak warnings, reward claims, and challenge
                completions will land here.
              </p>
              <div className="mt-4 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                A trusted product always explains what will show up here later
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-3">
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
