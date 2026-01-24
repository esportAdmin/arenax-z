import { motion, AnimatePresence } from "framer-motion";
import { Zap, CheckCircle2, Trophy, Clock, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useMemo, useEffect } from "react";
import confetti from "canvas-confetti";
import { playClickIfEnabled, playSuccessIfEnabled } from "@/lib/sounds";
import { useMatches, Match } from "@/hooks/useMatches";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Mini confetti burst pour feedback immédiat
const triggerMiniConfetti = () => {
  confetti({
    particleCount: 30,
    spread: 60,
    origin: { y: 0.7 },
    colors: ["#a855f7", "#3b82f6", "#22c55e"],
    scalar: 0.8,
    gravity: 1.2,
    decay: 0.92,
  });
};

// Grande célébration pour la soumission
const triggerSuccessConfetti = () => {
  const duration = 2000;
  const animationEnd = Date.now() + duration;

  const randomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: randomInRange(0.2, 0.8),
        y: randomInRange(0.2, 0.5),
      },
      colors: ["#a855f7", "#3b82f6", "#22c55e", "#f59e0b", "#ec4899"],
    });
  }, 200);
};

// Calculate time until midnight reset
const getTimeUntilReset = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

interface DailyPickData {
  id: string;
  matches: Array<{
    matchId: string;
    teamA: string;
    teamB: string;
    selectedTeam: string;
    odds: number;
  }>;
  total_potential_reward: number;
  status: string;
}

export function DailyProPick() {
  const { user } = useAuth();
  const { matches, loading, error } = useMatches({ filter: 'upcoming', refreshInterval: 60000 });
  
  const [currentPick, setCurrentPick] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const [todaysPick, setTodaysPick] = useState<DailyPickData | null>(null);
  const [checkingPick, setCheckingPick] = useState(true);

  // Check if user already submitted today's pick
  useEffect(() => {
    const checkTodaysPick = async () => {
      if (!user) {
        setCheckingPick(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('daily_pro_picks')
          .select('*')
          .eq('user_id', user.id)
          .eq('pick_date', today)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setTodaysPick({
            id: data.id,
            matches: data.matches as DailyPickData['matches'],
            total_potential_reward: data.total_potential_reward,
            status: data.status
          });
          setIsCompleted(true);
        }
      } catch (err) {
        console.error('Error checking today\'s pick:', err);
      } finally {
        setCheckingPick(false);
      }
    };

    checkTodaysPick();
  }, [user]);

  // Select 3 matches for daily picks (prioritize different tournaments)
  const dailyMatches = useMemo(() => {
    if (!matches.length) return [];
    
    const uniqueTournaments = new Map<string, Match>();
    const selected: Match[] = [];
    
    // First, try to get matches from different tournaments
    for (const match of matches) {
      if (!uniqueTournaments.has(match.tournament) && selected.length < 3) {
        uniqueTournaments.set(match.tournament, match);
        selected.push(match);
      }
    }
    
    // If we don't have 3 yet, fill with remaining matches
    if (selected.length < 3) {
      for (const match of matches) {
        if (!selected.includes(match) && selected.length < 3) {
          selected.push(match);
        }
      }
    }
    
    return selected;
  }, [matches]);

  const handleSelect = useCallback((matchId: string, teamName: string) => {
    playClickIfEnabled();
    setJustSelected(teamName);
    triggerMiniConfetti();
    
    setSelections((prev) => ({ ...prev, [matchId]: teamName }));
    
    setTimeout(() => setJustSelected(null), 600);
  }, []);

  const handleNext = () => {
    if (currentPick < dailyMatches.length - 1) {
      setCurrentPick((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPick > 0) {
      setCurrentPick((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit your picks");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare matches data for storage
      const matchesData = dailyMatches.map(match => ({
        matchId: match.id,
        teamA: match.teamA.name,
        teamB: match.teamB.name,
        selectedTeam: selections[match.id],
        odds: selections[match.id] === match.teamA.name ? match.teamA.odds : match.teamB.odds
      }));

      const { data, error } = await supabase
        .from('daily_pro_picks')
        .insert({
          user_id: user.id,
          matches: matchesData,
          total_potential_reward: potentialReward,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error("You've already submitted your picks today!");
        } else {
          throw error;
        }
        return;
      }

      setTodaysPick({
        id: data.id,
        matches: matchesData,
        total_potential_reward: potentialReward,
        status: 'pending'
      });
      setIsCompleted(true);
      playSuccessIfEnabled();
      triggerSuccessConfetti();
      toast.success("Daily picks saved! Good luck! 🎯");
    } catch (err) {
      console.error('Error saving picks:', err);
      toast.error("Failed to save picks. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allSelected = dailyMatches.length > 0 && Object.keys(selections).length === dailyMatches.length;
  const currentMatch = dailyMatches[currentPick];
  const currentSelection = currentMatch ? selections[currentMatch.id] : undefined;

  // Calculate potential reward based on odds
  const potentialReward = useMemo(() => {
    let totalOdds = 1;
    for (const matchId in selections) {
      const match = dailyMatches.find(m => m.id === matchId);
      if (match) {
        const selectedTeam = selections[matchId];
        const odds = selectedTeam === match.teamA.name ? match.teamA.odds : match.teamB.odds;
        totalOdds *= odds;
      }
    }
    return Math.round(50 * totalOdds);
  }, [selections, dailyMatches]);

  // Loading state
  if (loading || checkingPick) {
    return (
      <div className="glass-card p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
        <p className="text-muted-foreground">Loading today's matches...</p>
      </div>
    );
  }

  // Error state
  if (error || dailyMatches.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">
          {error || "No matches available right now. Check back soon!"}
        </p>
      </div>
    );
  }

  // Show completed state with saved data
  if (isCompleted && todaysPick) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 lg:p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4 ring-4 ring-success/30">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Trophy className="w-10 h-10 text-success" />
            </motion.div>
          </div>
          
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display font-bold text-2xl mb-2"
          >
            🎉 Daily Pick Complete!
          </motion.h3>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-6"
          >
            Your predictions are locked in. Good luck!
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="glass-card px-4 py-3 border border-accent/30">
              <div className="text-xs text-muted-foreground">Potential Reward</div>
              <div className="font-display font-bold text-accent text-lg">+{todaysPick.total_potential_reward} ARENA</div>
            </div>
            <div className="glass-card px-4 py-3 border border-primary/30">
              <div className="text-xs text-muted-foreground">Status</div>
              <div className="font-display font-bold text-primary text-lg capitalize">{todaysPick.status}</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 space-y-2"
          >
            {todaysPick.matches.map((match, index) => (
              <div key={index} className="text-sm flex items-center justify-center gap-2">
                <span className="text-muted-foreground">{match.teamA} vs {match.teamB}:</span>
                <span className="text-primary font-medium">{match.selectedTeam}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-muted-foreground mt-6"
          >
            🔥 Come back tomorrow for more picks!
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  // Show completed state for just-submitted picks
  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 lg:p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 animate-pulse" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4 ring-4 ring-success/30">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Trophy className="w-10 h-10 text-success" />
            </motion.div>
          </div>
          
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="font-display font-bold text-2xl mb-2"
          >
            🎉 Daily Pick Complete!
          </motion.h3>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground mb-6"
          >
            Your predictions are locked in. Good luck!
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="glass-card px-4 py-3 border border-accent/30">
              <div className="text-xs text-muted-foreground">Potential Reward</div>
              <div className="font-display font-bold text-accent text-lg">+{potentialReward} ARENA</div>
            </div>
            <div className="glass-card px-4 py-3 border border-primary/30">
              <div className="text-xs text-muted-foreground">Matches</div>
              <div className="font-display font-bold text-primary text-lg">{dailyMatches.length} Picks</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 space-y-2"
          >
            {dailyMatches.map((match) => (
              <div key={match.id} className="text-sm flex items-center justify-center gap-2">
                <span className="text-muted-foreground">{match.teamA.name} vs {match.teamB.name}:</span>
                <span className="text-primary font-medium">{selections[match.id]}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-sm text-muted-foreground mt-6"
          >
            🔥 Come back tomorrow for more picks!
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-bold">Daily Pro Pick</h3>
            <p className="text-xs text-muted-foreground">
              {dailyMatches.length} real matches • Earn rewards
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Resets in {getTimeUntilReset()}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-border/30">
        <div className="flex gap-2">
          {dailyMatches.map((match, index) => (
            <div
              key={match.id}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                selections[match.id]
                  ? "bg-primary"
                  : index === currentPick
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Pick */}
      <div className="p-6">
        <motion.div
          key={currentMatch?.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-display font-bold text-primary">
                {currentPick + 1}
              </span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider">
                {currentMatch?.game}
              </span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
              {currentMatch?.tournament}
            </span>
          </div>

          <h4 className="font-display font-bold text-xl mb-2">
            Who will win?
          </h4>
          <p className="text-sm text-muted-foreground mb-6">
            {currentMatch?.time} • {currentMatch?.date}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {currentMatch && [currentMatch.teamA, currentMatch.teamB].map((team, index) => (
              <motion.button
                key={team.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(currentMatch.id, team.name)}
                className={`relative p-4 rounded-xl border-2 transition-all overflow-hidden ${
                  currentSelection === team.name
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <AnimatePresence>
                  {justSelected === team.name && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-primary/30 rounded-full"
                      style={{ originX: 0.5, originY: 0.5 }}
                    />
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {currentSelection === team.name && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", duration: 0.4 }}
                      className="absolute top-2 right-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="relative z-10">
                  <div className="text-2xl mb-2">{team.logo}</div>
                  <div className="font-display font-bold flex items-center gap-2">
                    {team.name}
                    {currentSelection === team.name && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs text-primary"
                      >
                        ✓
                      </motion.span>
                    )}
                  </div>
                  <div className="text-sm text-primary mt-1">{team.odds.toFixed(2)}x</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border/50 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPick === 0}
        >
          Previous
        </Button>
        
        {currentPick === dailyMatches.length - 1 ? (
          <Button
            variant="hero"
            size="sm"
            onClick={handleSubmit}
            disabled={!allSelected || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Picks"}
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={handleNext}
            disabled={!currentSelection}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
