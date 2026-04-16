import { motion } from "framer-motion";
import { CheckCircle, Clock, Coins, History, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LiveCallHistory } from "@/hooks/useProfile";

interface LiveCallHistoryProps {
  liveCalls: LiveCallHistory[];
}

const statusConfig = {
  won: {
    label: "Completed",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
  },
  lost: {
    label: "Missed",
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
  },
};

export function PredictionHistory({ liveCalls }: LiveCallHistoryProps) {
  if (liveCalls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="section-shell p-5 sm:p-6"
      >
        <h2 className="mb-6 flex items-center gap-2 text-xl font-display font-black text-white">
          <History className="h-5 w-5 text-primary" />
          Live Call History
        </h2>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-muted-foreground">
          <Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p className="font-bold text-white">No live calls yet</p>
          <p className="mt-2 text-sm">
            Make your first live call to start building your record.
          </p>
        </div>
      </motion.div>
    );
  }

  const wonCount = liveCalls.filter((liveCall) => liveCall.status === "won").length;
  const lostCount = liveCalls.filter((liveCall) => liveCall.status === "lost").length;
  const pendingCount = liveCalls.filter((liveCall) => liveCall.status === "pending").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
        className="section-shell p-5 sm:p-6"
      >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="eyebrow-badge">Activity archive</div>
          <h2 className="mt-3 flex items-center gap-2 text-xl font-display font-black text-white">
            <History className="h-5 w-5 text-primary" />
            Live call history
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className="border-green-400/30 bg-green-400/10 text-green-400"
          >
            {wonCount} completed
          </Badge>
          <Badge
            variant="outline"
            className="border-red-400/30 bg-red-400/10 text-red-400"
          >
            {lostCount} missed
          </Badge>
          <Badge
            variant="outline"
            className="border-amber-400/30 bg-amber-400/10 text-amber-400"
          >
            {pendingCount} pending
          </Badge>
        </div>
      </div>

      <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
        {liveCalls.map((liveCall, index) => {
          const config =
            statusConfig[liveCall.status as keyof typeof statusConfig] ??
            statusConfig.pending;
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={liveCall.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              className={`rounded-2xl border p-4 transition-transform hover:scale-[1.01] ${config.bgColor} ${config.borderColor}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${config.borderColor} ${config.bgColor}`}>
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2 font-medium">
                      <span className="max-w-[14rem] truncate text-white">
                        {liveCall.selected_team}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                        Signal {Math.round(liveCall.signalWeight * 100)}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(liveCall.created_at).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <div className="flex items-center gap-1 text-sm sm:justify-end">
                    <Coins className="h-3 w-3 text-accent" />
                    <span>{liveCall.activityCommitment}</span>
                  </div>
                  <div
                    className={`text-xs ${
                      liveCall.status === "won"
                        ? "text-green-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {liveCall.status === "won" ? "+" : ""}
                    {liveCall.projectedImpact} impact
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
