import { motion } from "framer-motion";
import { Clock, TrendingUp, CheckCircle2, XCircle, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Prediction {
  id: number;
  match: string;
  prediction: string;
  stake: number;
  potentialWin: number;
  status: "pending" | "won" | "lost";
  time: string;
}

const recentPredictions: Prediction[] = [
  {
    id: 1,
    match: "Navi vs Vitality",
    prediction: "Navi to win",
    stake: 50,
    potentialWin: 92,
    status: "pending",
    time: "Live Now",
  },
  {
    id: 2,
    match: "G2 vs FaZe",
    prediction: "Over 24.5 rounds",
    stake: 100,
    potentialWin: 180,
    status: "won",
    time: "2h ago",
  },
  {
    id: 3,
    match: "Cloud9 vs Heroic",
    prediction: "Heroic to win",
    stake: 75,
    potentialWin: 131,
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

export function RecentPredictions() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-display font-bold">Recent Predictions</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      <div className="divide-y divide-border/30">
        {recentPredictions.map((prediction, index) => {
          const status = statusConfig[prediction.status];
          return (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{prediction.match}</span>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    <status.icon className="w-3 h-3" />
                    {status.label}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{prediction.time}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {prediction.prediction}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Locked: </span>
                    <span className="font-display font-bold">{prediction.stake} ARENA</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Win: </span>
                    <span className={`font-display font-bold ${
                      prediction.status === "won" ? "text-success" : 
                      prediction.status === "lost" ? "text-destructive" : 
                      "text-accent"
                    }`}>
                      {prediction.status === "lost" ? "-" : "+"}{prediction.potentialWin} ARENA
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
