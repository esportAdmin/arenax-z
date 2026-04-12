import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Search,
  Users,
  Globe,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LeaderboardPodium } from "@/components/leaderboard/LeaderboardPodium";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable2";
import { WeeklyRewardsPanel } from "@/components/leaderboard/WeeklyRewardsPanel";
import { BadgesShowcase } from "@/components/leaderboard/BadgesShowcase";
import { DailyChallenges } from "@/components/leaderboard/DailyChallenges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<"global" | "clubs">("global");
  const [searchQuery, setSearchQuery] = useState("");
  const { entries, loading, error, refetch } = useLeaderboard();

  const filteredEntries = entries.filter((entry) => {
    const name = entry.display_name || entry.username || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const topThree = filteredEntries.slice(0, 3);
  const restOfLeaderboard = filteredEntries.slice(3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-12 pt-20 lg:pt-24">
        <div className="container-arena">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent">
              <Trophy className="h-4 w-4" />
              <span className="relative">
                Active Season - Live
                <span className="absolute -right-2 -top-1 h-2 w-2 animate-pulse rounded-full bg-success" />
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              <span className="text-foreground">Season </span>
              <span className="gradient-text-accent">Leaderboard</span>
            </h1>

            <p className="mx-auto max-w-2xl text-muted-foreground">
              Rankings are based on seasonal XP. Climb the ladder to unlock
              exclusive rewards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === "global" ? "hero" : "glass"}
                    className="gap-2"
                    onClick={() => setActiveTab("global")}
                  >
                    <Globe className="h-4 w-4" />
                    Global
                  </Button>

                  <Button
                    variant={activeTab === "clubs" ? "hero" : "glass"}
                    className="gap-2"
                    onClick={() => setActiveTab("clubs")}
                  >
                    <Users className="h-4 w-4" />
                    Clubs
                  </Button>
                </div>

                <div className="flex flex-1 gap-2">
                  <div className="relative max-w-xs flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search for a player..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="border-border bg-card pl-10"
                    />
                  </div>

                  <Button variant="ghost" onClick={() => refetch()}>
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}

              {error && (
                <div className="glass-card p-8 text-center">
                  <p className="mb-4 text-destructive">{error}</p>
                  <Button onClick={() => refetch()}>Try again</Button>
                </div>
              )}

              {!loading && !error && (
                <>
                  {topThree.length > 0 && <LeaderboardPodium entries={topThree} />}

                  {restOfLeaderboard.length > 0 && (
                    <LeaderboardTable entries={restOfLeaderboard} startRank={4} />
                  )}
                </>
              )}

              <BadgesShowcase />
            </div>

            <div className="space-y-6">
              <WeeklyRewardsPanel />
              <DailyChallenges />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
