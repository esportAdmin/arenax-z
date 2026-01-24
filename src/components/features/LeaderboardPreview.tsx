"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/AppLink";

const topFans = [
  {
    rank: 1,
    name: "CyberNinja",
    avatar: "🥷",
    score: 12450,
    change: "+120",
    trend: "up",
  },
  {
    rank: 2,
    name: "ProGamer99",
    avatar: "🎮",
    score: 11280,
    change: "+85",
    trend: "up",
  },
  {
    rank: 3,
    name: "ESportKing",
    avatar: "👑",
    score: 10950,
    change: "-15",
    trend: "down",
  },
  {
    rank: 4,
    name: "AimBot_Pro",
    avatar: "🎯",
    score: 9870,
    change: "+45",
    trend: "up",
  },
  {
    rank: 5,
    name: "StratMaster",
    avatar: "🧠",
    score: 9120,
    change: "+92",
    trend: "up",
  },
];

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return "badge-rank-gold";
    case 2:
      return "badge-rank-silver";
    case 3:
      return "badge-rank-bronze";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function LeaderboardPreview() {
  return (
    <section className="py-24 relative">
      <div className="container-arena">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              Global Rankings
            </div>

            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              <span className="text-foreground">Climb The </span>
              <span className="gradient-text-accent">Leaderboard</span>
            </h2>

            <p className="text-muted-foreground text-lg mb-8">
              Compete against fans worldwide. Your Arena Score combines
              prediction accuracy, locking activity, and daily quest completion.
              Top performers earn exclusive rewards and recognition.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild variant="accent" size="lg" className="gap-2">
                <AppLink href="/leaderboard">
                  View Full Leaderboard
                  <ChevronRight className="w-5 h-5" />
                </AppLink>
              </Button>

              <Button variant="glass" size="lg" className="gap-2">
                <Medal className="w-5 h-5" />
                My Rank: #147
              </Button>
            </div>
          </motion.div>

          {/* Right - Leaderboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-display font-bold">Top 5 Global</h3>
              <span className="text-xs text-muted-foreground">
                Updated 5m ago
              </span>
            </div>

            <div className="divide-y divide-border/30">
              {topFans.map((fan, index) => (
                <motion.div
                  key={fan.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="leaderboard-row"
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm ${getRankBadge(
                      fan.rank,
                    )}`}
                  >
                    {fan.rank}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                    {fan.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{fan.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Arena Score
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-lg gradient-text-primary">
                      {fan.score.toLocaleString()}
                    </div>
                    <div
                      className={`flex items-center justify-end gap-1 text-xs ${
                        fan.trend === "up" ? "text-success" : "text-destructive"
                      }`}
                    >
                      <TrendingUp
                        className={`w-3 h-3 ${fan.trend === "down" ? "rotate-180" : ""}`}
                      />
                      {fan.change}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
