import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock, Trophy, Play, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Match } from "@/hooks/useMatches";

interface MatchOfTheDayProps {
  match: Match;
  onPlacePrediction: (matchId: string, selectedTeam: string, stakeAmount: number, odds: number) => Promise<boolean>;
  isPlacing: boolean;
  userBalance: number;
  isAuthenticated: boolean;
}

export const MatchOfTheDay = ({
  match,
  onPlacePrediction,
  isPlacing,
  userBalance,
  isAuthenticated
}: MatchOfTheDayProps) => {
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | null>(null);

  const handleQuickBet = async (team: 'A' | 'B') => {
    const selectedMatch = team === 'A' ? match.teamA : match.teamB;
    const defaultStake = 100;
    
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }
    
    if (userBalance < defaultStake) {
      return;
    }
    
    await onPlacePrediction(match.id, selectedMatch.name, defaultStake, selectedMatch.odds);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="game-card glass-card rounded-xl overflow-hidden neon-border neon-pulse"
    >
      {/* Header */}
      <motion.div 
        className="px-4 py-3 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 border-b border-border/50"
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: '200% 100%' }}
      >
        <h3 className="font-display font-bold text-sm flex items-center gap-2">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-4 h-4 text-accent fill-accent" />
          </motion.span>
          <span className="gradient-text-primary">MATCH OF THE DAY</span>
        </h3>
      </motion.div>

      {/* Match Content */}
      <div className="p-4 space-y-4">
        {/* Tournament */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Trophy className="w-3 h-3" />
          <span className="truncate">{match.tournament}</span>
        </div>

        {/* Teams */}
        <div className="grid grid-cols-3 gap-2 items-center">
          {/* Team A */}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTeam('A')}
            className={`p-3 rounded-lg text-center transition-all duration-300 ${
              selectedTeam === 'A'
                ? 'bg-primary/20 border border-primary/50 neon-glow-primary'
                : 'bg-muted/20 hover:bg-primary/10 border border-transparent hover:border-primary/30'
            }`}
          >
            <motion.div 
              className="text-2xl mb-1"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {match.teamA.logo}
            </motion.div>
            <div className="font-bold text-xs truncate">{match.teamA.name}</div>
            <div className="text-[10px] text-muted-foreground">#{match.teamA.name.substring(0, 3).toUpperCase()}</div>
          </motion.button>

          {/* Center */}
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">{match.date}</div>
            <div className="font-display font-black text-lg flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              {match.time}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Bo3</div>
          </div>

          {/* Team B */}
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTeam('B')}
            className={`p-3 rounded-lg text-center transition-all duration-300 ${
              selectedTeam === 'B'
                ? 'bg-primary/20 border border-primary/50 neon-glow-primary'
                : 'bg-muted/20 hover:bg-primary/10 border border-transparent hover:border-primary/30'
            }`}
          >
            <motion.div 
              className="text-2xl mb-1"
              whileHover={{ scale: 1.2, rotate: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {match.teamB.logo}
            </motion.div>
            <div className="font-bold text-xs truncate">{match.teamB.name}</div>
            <div className="text-[10px] text-muted-foreground">#{match.teamB.name.substring(0, 3).toUpperCase()}</div>
          </motion.button>
        </div>

        {/* Odds Row */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px hsl(var(--accent) / 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleQuickBet('A')}
            disabled={isPlacing}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 hover:border-accent transition-all duration-300"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Zap className="w-4 h-4 text-accent" />
            </motion.span>
            <span className="font-bold text-accent">{match.teamA.odds.toFixed(2)}x</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px hsl(var(--accent) / 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleQuickBet('B')}
            disabled={isPlacing}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-accent/10 to-accent/20 border border-accent/30 hover:border-accent transition-all duration-300"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
            >
              <Zap className="w-4 h-4 text-accent" />
            </motion.span>
            <span className="font-bold text-accent">{match.teamB.odds.toFixed(2)}x</span>
          </motion.button>
        </div>

        {/* Watch Match Button */}
        {match.isLive && (
          <Button 
            variant="secondary" 
            className="w-full gap-2"
            onClick={() => {}}
          >
            <Play className="w-4 h-4" />
            WATCH MATCH
          </Button>
        )}
      </div>
    </motion.div>
  );
};
