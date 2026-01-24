import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { usePredictions } from "@/hooks/usePredictions";
import { useMatches } from "@/hooks/useMatches";
import { GameFilterBar } from "@/components/predictions/GameFilterBar";
import { MatchCardCompact } from "@/components/predictions/MatchCardCompact";
import { MatchOfTheDay } from "@/components/predictions/MatchOfTheDay";
import { BettingOddsSidebar } from "@/components/predictions/BettingOddsSidebar";
import { Loader2, Trophy, Zap, TrendingUp } from "lucide-react";

type GameFilter = 'all' | 'lol' | 'cs2' | 'valorant' | 'dota2' | 'rl' | 'pubg' | 'cod' | 'r6';
type StatusFilter = 'all' | 'live' | 'upcoming' | 'finished';

const Predictions = () => {
  const { user } = useAuth();
  const { profile, predictions, placing, placePrediction } = usePredictions();
  const { matches, loading, error } = useMatches({ refreshInterval: 30000 });
  
  const [gameFilter, setGameFilter] = useState<GameFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filter matches
  const filteredMatches = useMemo(() => {
    if (!matches) return [];
    
    return matches.filter((match) => {
      // Game filter
      if (gameFilter !== 'all') {
        const gameMap: Record<string, string[]> = {
          'lol': ['league of legends', 'lol'],
          'cs2': ['cs2', 'counter-strike', 'cs:go', 'csgo'],
          'valorant': ['valorant'],
          'dota2': ['dota 2', 'dota2'],
          'rl': ['rocket league'],
          'pubg': ['pubg'],
          'cod': ['call of duty', 'cod'],
          'r6': ['rainbow six', 'r6']
        };
        const gameNames = gameMap[gameFilter] || [];
        if (!gameNames.some(name => match.game.toLowerCase().includes(name))) {
          return false;
        }
      }
      
      // Status filter
      if (statusFilter === 'live' && !match.isLive) return false;
      if (statusFilter === 'upcoming' && (match.isLive || match.isFinished)) return false;
      if (statusFilter === 'finished' && !match.isFinished) return false;
      
      return true;
    });
  }, [matches, gameFilter, statusFilter]);

  // Get match of the day (first live match or first upcoming)
  const matchOfTheDay = useMemo(() => {
    if (!matches || matches.length === 0) return null;
    const liveMatch = matches.find(m => m.isLive);
    if (liveMatch) return liveMatch;
    return matches.find(m => !m.isFinished) || matches[0];
  }, [matches]);

  // Stats
  const liveMatchesCount = matches?.filter(m => m.isLive).length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container-arena py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                <span className="gradient-text-primary">ESPORTS BETTING ODDS</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Pronostiquez sur les meilleurs matchs esports
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </div>
                <span className="font-bold text-lg">{liveMatchesCount}</span>
                <span className="text-muted-foreground text-sm">En Direct</span>
              </div>
              
              {user && (
                <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="font-bold text-lg">{profile?.arena_balance?.toLocaleString() || 0}</span>
                  <span className="text-muted-foreground text-sm">AP</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Filter Bar */}
      <div className="border-b border-border/30 bg-card/30">
        <div className="container-arena py-3">
          <GameFilterBar 
            activeGame={gameFilter}
            onGameChange={setGameFilter}
            activeStatus={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container-arena py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Matches List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section Title */}
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-primary" />
              <h2 className="font-display font-bold text-xl">TODAY'S UPCOMING MATCHES</h2>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-muted-foreground">Chargement des matchs...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-destructive">Erreur: {error}</p>
              </div>
            )}

            {/* Matches Grid */}
            {!loading && !error && (
              <div className="space-y-4">
                {filteredMatches.length === 0 ? (
                  <div className="glass-card rounded-xl p-12 text-center">
                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">Aucun match trouvé pour ces filtres</p>
                  </div>
                ) : (
                  filteredMatches.map((match, index) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MatchCardCompact
                        match={match}
                        onPlacePrediction={placePrediction}
                        isPlacing={placing}
                        userBalance={profile?.arena_balance || 0}
                        isAuthenticated={!!user}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Betting Odds Quick View */}
            <BettingOddsSidebar matches={matches || []} />
            
            {/* Match of the Day */}
            {matchOfTheDay && (
              <MatchOfTheDay 
                match={matchOfTheDay}
                onPlacePrediction={placePrediction}
                isPlacing={placing}
                userBalance={profile?.arena_balance || 0}
                isAuthenticated={!!user}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictions;
