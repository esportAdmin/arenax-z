import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Trophy, Search, Filter, Users, Globe, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { LeaderboardPodium } from "@/components/leaderboard/LeaderboardPodium";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { WeeklyRewardsPanel } from "@/components/leaderboard/WeeklyRewardsPanel";
import { BadgesShowcase } from "@/components/leaderboard/BadgesShowcase";
import { DailyChallenges } from "@/components/leaderboard/DailyChallenges";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<"global" | "clubs">("global");
  const [searchQuery, setSearchQuery] = useState("");
  const { entries, loading, error, refetch } = useLeaderboard();

  // Filter entries based on search
  const filteredEntries = entries.filter((entry) => {
    const name = entry.display_name || entry.username || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const topThree = filteredEntries.slice(0, 3);
  const restOfLeaderboard = filteredEntries.slice(3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 lg:pt-24 pb-12">
        <div className="container-arena">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              <span className="relative">
                Saison 4 - Live
                <span className="absolute -right-2 -top-1 w-2 h-2 rounded-full bg-success animate-pulse" />
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              <span className="text-foreground">Classement </span>
              <span className="gradient-text-accent">Global</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Score Aréna = Quiz (20%) + Pronostics (50%) + Engagement (30%). 
              Grimpez dans le classement pour débloquer des récompenses exclusives!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Leaderboard Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Tabs & Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === "global" ? "hero" : "glass"}
                    className="gap-2"
                    onClick={() => setActiveTab("global")}
                  >
                    <Globe className="w-4 h-4" />
                    Global
                  </Button>
                  <Button
                    variant={activeTab === "clubs" ? "hero" : "glass"}
                    className="gap-2"
                    onClick={() => setActiveTab("clubs")}
                  >
                    <Users className="w-4 h-4" />
                    Clubs
                  </Button>
                </div>
                <div className="flex-1 flex gap-2">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un joueur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-card border-border"
                    />
                  </div>
                  <Button variant="ghost" className="gap-2" onClick={() => refetch()}>
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              </motion.div>

              {/* Loading / Error States */}
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {error && (
                <div className="glass-card p-8 text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => refetch()}>Réessayer</Button>
                </div>
              )}

              {/* Content */}
              {!loading && !error && (
                <>
                  {/* Top 3 Podium */}
                  {topThree.length > 0 && <LeaderboardPodium entries={topThree} />}

                  {/* Full Leaderboard */}
                  {restOfLeaderboard.length > 0 && (
                    <LeaderboardTable entries={restOfLeaderboard} startRank={4} />
                  )}

                  {filteredEntries.length === 0 && (
                    <div className="glass-card p-12 text-center">
                      <div className="text-4xl mb-4">🏆</div>
                      <h3 className="font-display font-bold text-lg mb-2">
                        {searchQuery ? "Aucun résultat" : "Le classement est vide"}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {searchQuery
                          ? "Essayez avec un autre terme de recherche"
                          : "Soyez le premier à rejoindre le classement!"}
                      </p>
                    </div>
                  )}

                  {/* Load More */}
                  {filteredEntries.length > 0 && (
                    <div className="text-center">
                      <Button variant="glass" size="lg">
                        Charger plus de joueurs
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Badges Showcase */}
              <BadgesShowcase />
            </div>

            {/* Sidebar */}
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
