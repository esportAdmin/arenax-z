import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Users, ChevronDown, Zap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Match } from "@/hooks/useMatches";

interface MatchCardCompactProps {
  match: Match;
  onPlacePrediction: (matchId: string, selectedTeam: string, stakeAmount: number, odds: number) => Promise<boolean>;
  isPlacing: boolean;
  userBalance: number;
  isAuthenticated: boolean;
}

export const MatchCardCompact = ({
  match,
  onPlacePrediction,
  isPlacing,
  userBalance,
  isAuthenticated
}: MatchCardCompactProps) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B' | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");

  const handlePlaceBet = async () => {
    if (!selectedTeam || !stakeAmount) return;
    
    const team = selectedTeam === 'A' ? match.teamA : match.teamB;
    const success = await onPlacePrediction(match.id, team.name, parseInt(stakeAmount), team.odds);
    
    if (success) {
      setExpanded(false);
      setSelectedTeam(null);
      setStakeAmount("");
    }
  };

  const getSelectedOdds = () => {
    if (!selectedTeam) return 0;
    return selectedTeam === 'A' ? match.teamA.odds : match.teamB.odds;
  };

  const potentialWin = stakeAmount ? Math.floor(parseFloat(stakeAmount) * getSelectedOdds()) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`game-card glass-card rounded-xl overflow-hidden transition-all duration-300 ${
        expanded ? 'neon-glow-primary ring-1 ring-primary/50' : 'hover:neon-glow-dual'
      }`}
    >
      {/* Main Card Content */}
      <div className="p-4">
        {/* Tournament Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium truncate max-w-[200px]">
              {match.tournament}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{match.totalLocked?.toLocaleString() || 0} AP</span>
            </div>
          </div>
        </div>

        {/* Match Row */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-center">
          {/* Team A */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedTeam(selectedTeam === 'A' ? null : 'A');
              setExpanded(selectedTeam !== 'A');
            }}
            className={`group flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 ${
              selectedTeam === 'A'
                ? 'border-primary bg-primary/10 neon-glow-primary'
                : 'border-transparent hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            <motion.div 
              className="text-2xl"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {match.teamA.logo}
            </motion.div>
            <div className="flex-1 text-left">
              <div className="font-bold text-sm truncate">{match.teamA.name}</div>
              <div className="text-xs text-muted-foreground">#{match.teamA.name.substring(0, 3).toUpperCase()}</div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                selectedTeam === 'A' 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.5)]' 
                  : 'bg-accent/20 text-accent hover:shadow-[0_0_10px_hsl(var(--accent)/0.3)]'
              }`}
            >
              {match.teamA.odds.toFixed(2)}
            </motion.div>
          </motion.button>

          {/* VS / Time / Score */}
          <div className="flex flex-col items-center justify-center min-w-[80px]">
            {match.isLive ? (
              <>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/20 mb-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-destructive"></span>
                  </span>
                  <span className="text-[10px] font-bold text-destructive uppercase">Live</span>
                </div>
                {match.mapScore && (
                  <div className="font-display font-black text-xl">
                    {match.mapScore.teamA} : {match.mapScore.teamB}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="text-xs text-muted-foreground mb-1">{match.date}</div>
                <div className="font-bold text-lg flex items-center gap-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  {match.time}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Bo3</div>
              </>
            )}
          </div>

          {/* Team B */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedTeam(selectedTeam === 'B' ? null : 'B');
              setExpanded(selectedTeam !== 'B');
            }}
            className={`group flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-300 flex-row-reverse ${
              selectedTeam === 'B'
                ? 'border-primary bg-primary/10 neon-glow-primary'
                : 'border-transparent hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            <motion.div 
              className="text-2xl"
              whileHover={{ scale: 1.2, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {match.teamB.logo}
            </motion.div>
            <div className="flex-1 text-right">
              <div className="font-bold text-sm truncate">{match.teamB.name}</div>
              <div className="text-xs text-muted-foreground">#{match.teamB.name.substring(0, 3).toUpperCase()}</div>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                selectedTeam === 'B' 
                  ? 'bg-primary text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.5)]' 
                  : 'bg-accent/20 text-accent hover:shadow-[0_0_10px_hsl(var(--accent)/0.3)]'
              }`}
            >
              {match.teamB.odds.toFixed(2)}
            </motion.div>
          </motion.button>
        </div>

        {/* Quick Bet Button */}
        {!expanded && (
          <div className="mt-3 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(true)}
              className="text-primary hover:text-primary hover:bg-primary/10 gap-1"
            >
              <Zap className="w-4 h-4" />
              MAKE A BET
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Expanded Betting Panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 bg-muted/20"
          >
            <div className="p-4 space-y-4">
              {/* Selected Team Info */}
              {selectedTeam && (
                <div className="flex items-center justify-between bg-primary/10 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">
                      {selectedTeam === 'A' ? match.teamA.logo : match.teamB.logo}
                    </div>
                    <span className="font-bold">
                      {selectedTeam === 'A' ? match.teamA.name : match.teamB.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Cote:</span>
                    <span className="font-bold text-accent text-lg">{getSelectedOdds().toFixed(2)}x</span>
                  </div>
                </div>
              )}

              {/* Stake Input */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Mise (AP)</label>
                  <Input
                    type="number"
                    placeholder="Min. 50"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-muted/50 border-border/50"
                    min={50}
                    max={userBalance}
                  />
                  <div className="flex gap-1 mt-2">
                    {[50, 100, 250].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setStakeAmount(amount.toString())}
                        disabled={amount > userBalance}
                        className="px-2 py-0.5 text-xs rounded bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Gains Potentiels</label>
                  <div className="h-10 px-4 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-between">
                    <span className="font-bold text-accent">+{potentialWin.toLocaleString()}</span>
                    <span className="text-xs text-accent/70">AP</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setExpanded(false);
                    setSelectedTeam(null);
                    setStakeAmount("");
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
                {isAuthenticated ? (
                  <Button
                    variant="hero"
                    onClick={handlePlaceBet}
                    disabled={isPlacing || !selectedTeam || !stakeAmount || parseInt(stakeAmount) < 50}
                    className="flex-1"
                  >
                    {isPlacing ? "Validation..." : "Placer le Pari"}
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => window.location.href = '/auth'}
                    className="flex-1"
                  >
                    Connectez-vous
                  </Button>
                )}
              </div>

              {isAuthenticated && (
                <div className="text-center text-xs text-muted-foreground">
                  Solde: <span className="font-bold text-foreground">{userBalance.toLocaleString()} AP</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
