import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, TrendingUp, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Team {
  name: string;
  logo: string;
  odds: number;
}

interface Match {
  id: string;
  teamA: Team;
  teamB: Team;
  tournament: string;
  time: string;
  date: string;
  isLive: boolean;
  totalLocked: number;
  game: string;
  mapScore?: { teamA: number; teamB: number };
}

interface MatchCardProps {
  match: Match;
  onPlacePrediction: (matchId: string, selectedTeam: string, stakeAmount: number, odds: number) => Promise<boolean>;
  isPlacing: boolean;
  userBalance: number;
  isAuthenticated: boolean;
}

export const MatchCard = ({ 
  match, 
  onPlacePrediction, 
  isPlacing, 
  userBalance,
  isAuthenticated 
}: MatchCardProps) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTeamSelect = (teamName: string) => {
    if (selectedTeam === teamName) {
      setSelectedTeam(null);
      setIsExpanded(false);
    } else {
      setSelectedTeam(teamName);
      setIsExpanded(true);
    }
  };

  const handlePlacePrediction = async () => {
    if (!selectedTeam || !stakeAmount) return;
    
    const odds = selectedTeam === match.teamA.name ? match.teamA.odds : match.teamB.odds;
    const success = await onPlacePrediction(match.id, selectedTeam, parseInt(stakeAmount), odds);
    
    if (success) {
      setSelectedTeam(null);
      setStakeAmount("");
      setIsExpanded(false);
    }
  };

  const getSelectedOdds = () => {
    if (!selectedTeam) return 0;
    return selectedTeam === match.teamA.name ? match.teamA.odds : match.teamB.odds;
  };

  const potentialWin = stakeAmount ? Math.floor(parseFloat(stakeAmount) * getSelectedOdds()) : 0;

  return (
    <motion.div
      layout
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isExpanded 
          ? "border-primary/50 bg-gradient-to-br from-primary/5 via-card to-card shadow-lg shadow-primary/10" 
          : "border-border/50 bg-card/80 hover:border-border"
      }`}
    >
      {/* Live indicator glow */}
      {match.isLive && (
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 via-transparent to-transparent pointer-events-none" />
      )}

      <div className="relative p-4 lg:p-6">
        {/* Match Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {match.isLive ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
                </span>
                <span className="text-destructive text-xs font-bold uppercase tracking-wider">En Direct</span>
              </div>
            ) : (
              <span className="px-3 py-1.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium border border-border/50">
                {match.date}
              </span>
            )}
            <span className="text-sm text-muted-foreground font-medium">{match.tournament}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
              <Users className="w-3 h-3" />
              <span>{match.totalLocked.toLocaleString()} AP</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {match.time}
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
          {/* Team A */}
          <button
            onClick={() => handleTeamSelect(match.teamA.name)}
            className={`group relative p-5 rounded-xl border-2 transition-all duration-200 ${
              selectedTeam === match.teamA.name
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl transform group-hover:scale-110 transition-transform">{match.teamA.logo}</div>
              <div className="font-display font-bold text-lg">{match.teamA.name}</div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                selectedTeam === match.teamA.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/20 text-accent"
              }`}>
                <Zap className="w-3 h-3" />
                {match.teamA.odds}x
              </div>
            </div>
            {selectedTeam === match.teamA.name && (
              <motion.div
                layoutId={`selected-${match.id}`}
                className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </button>

          {/* VS Section */}
          <div className="flex flex-col items-center justify-center px-4">
            {match.isLive && match.mapScore ? (
              <div className="text-center">
                <div className="font-display font-black text-3xl mb-1">
                  <span className="text-foreground">{match.mapScore.teamA}</span>
                  <span className="text-muted-foreground mx-2">:</span>
                  <span className="text-foreground">{match.mapScore.teamB}</span>
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Maps</span>
              </div>
            ) : (
              <div className="font-display font-black text-2xl text-muted-foreground/50">VS</div>
            )}
            <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>Hot Match</span>
            </div>
          </div>

          {/* Team B */}
          <button
            onClick={() => handleTeamSelect(match.teamB.name)}
            className={`group relative p-5 rounded-xl border-2 transition-all duration-200 ${
              selectedTeam === match.teamB.name
                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl transform group-hover:scale-110 transition-transform">{match.teamB.logo}</div>
              <div className="font-display font-bold text-lg">{match.teamB.name}</div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                selectedTeam === match.teamB.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent/20 text-accent"
              }`}>
                <Zap className="w-3 h-3" />
                {match.teamB.odds}x
              </div>
            </div>
            {selectedTeam === match.teamB.name && (
              <motion.div
                layoutId={`selected-${match.id}`}
                className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </button>
        </div>

        {/* Stake Input Panel */}
        {isExpanded && selectedTeam && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-border/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Mise (Arena Points)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Min. 50"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="bg-muted/50 border-border/50 pr-16 font-mono text-lg h-12"
                    min={50}
                    max={userBalance}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    AP
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {[50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setStakeAmount(amount.toString())}
                      disabled={amount > userBalance}
                      className="px-2 py-1 text-xs rounded bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Gains Potentiels
                </label>
                <div className="h-12 px-4 rounded-lg bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-between">
                  <span className="font-display font-bold text-xl text-accent">
                    +{potentialWin.toLocaleString()}
                  </span>
                  <span className="text-xs text-accent/70">AP</span>
                </div>
              </div>

              <div>
                {isAuthenticated ? (
                  <Button 
                    onClick={handlePlacePrediction}
                    disabled={isPlacing || !stakeAmount || parseInt(stakeAmount) < 50}
                    className="w-full h-12 font-bold text-base"
                    variant="hero"
                  >
                    {isPlacing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Validation...
                      </span>
                    ) : (
                      "Valider le Pronostic"
                    )}
                  </Button>
                ) : (
                  <Button 
                    variant="secondary"
                    className="w-full h-12"
                    onClick={() => window.location.href = '/auth'}
                  >
                    Connectez-vous pour parier
                  </Button>
                )}
              </div>
            </div>

            {isAuthenticated && (
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Votre solde:</span>
                <span className="font-bold text-foreground">{userBalance.toLocaleString()} Arena Points</span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
