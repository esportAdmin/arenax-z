import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentCall {
  id: number;
  match: string;
  call: string;
  commit: number;
  projectedReward: number;
  status: "pending" | "won" | "lost";
  time: string;
}

const recentCalls: RecentCall[] = [
  {
    id: 1,
    match: "Navi vs Vitality",
    call: "Navi to win",
    commit: 50,
    projectedReward: 92,
    status: "pending",
    time: "Live Now",
  },
  {
    id: 2,
    match: "G2 vs FaZe",
    call: "Over 24.5 rounds",
    commit: 100,
    projectedReward: 180,
    status: "won",
    time: "2h ago",
  },
  {
    id: 3,
    match: "Cloud9 vs Heroic",
    call: "Heroic to win",
    commit: 75,
    projectedReward: 131,
    status: "lost",
    time: "5h ago",
  },
];

const statusConfig = {
  pending: {
    icon: Timer,
    label: "Pending",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  won: {
    icon: CheckCircle2,
    label: "Won",
    color: "text-success",
    bg: "bg-success/10",
  },
  lost: {
    icon: XCircle,
    label: "Lost",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

export function RecentCalls() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-display font-bold">Recent Live Calls</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      <div className="divide-y divide-border/30">
        {recentCalls.map((call, index) => {
          const status = statusConfig[call.status];
          return (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{call.match}</span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    <status.icon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{call.time}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {call.call}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Committed: </span>
                    <span className="font-display font-bold">{call.commit} ARENA</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reward: </span>
                    <span className={`font-display font-bold ${
                      call.status === "won" ? "text-success" : 
                      call.status === "lost" ? "text-destructive" : 
                      "text-accent"
                    }`}>
                      {call.status === "lost" ? "-" : "+"}{call.projectedReward} ARENA
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
