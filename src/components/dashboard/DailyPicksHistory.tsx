import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, XCircle, Clock, ChevronDown, ChevronUp, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, parseISO, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";

interface MatchPick {
  matchId: string;
  teamA: string;
  teamB: string;
  selectedTeam: string;
  odds: number;
  result?: 'won' | 'lost' | 'pending';
}

interface DailyPick {
  id: string;
  pick_date: string;
  matches: MatchPick[];
  total_potential_reward: number;
  status: 'pending' | 'won' | 'lost' | 'partial';
  created_at: string;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-muted-foreground",
    bg: "bg-muted/50",
    border: "border-muted",
    label: "En attente"
  },
  won: {
    icon: Trophy,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    label: "Gagné!"
  },
  lost: {
    icon: XCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    label: "Perdu"
  },
  partial: {
    icon: TrendingUp,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    label: "Partiel"
  }
};

function formatPickDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return "Aujourd'hui";
  if (isYesterday(date)) return "Hier";
  return format(date, "d MMMM", { locale: fr });
}

export function DailyPicksHistory() {
  const { user } = useAuth();
  const [picks, setPicks] = useState<DailyPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPick, setExpandedPick] = useState<string | null>(null);

  useEffect(() => {
    const fetchPicks = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('daily_pro_picks')
          .select('*')
          .eq('user_id', user.id)
          .order('pick_date', { ascending: false })
          .limit(10);

        if (error) throw error;

        const typedPicks: DailyPick[] = (data || []).map(pick => ({
          id: pick.id,
          pick_date: pick.pick_date,
          matches: (pick.matches as unknown) as MatchPick[],
          total_potential_reward: pick.total_potential_reward,
          status: pick.status as DailyPick['status'],
          created_at: pick.created_at
        }));

        setPicks(typedPicks);
      } catch (err) {
        console.error('Error fetching picks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPicks();
  }, [user]);

  const toggleExpand = (pickId: string) => {
    setExpandedPick(prev => prev === pickId ? null : pickId);
  };

  // Calculate stats
  const stats = picks.reduce((acc, pick) => {
    if (pick.status === 'won') acc.wins++;
    else if (pick.status === 'lost') acc.losses++;
    else acc.pending++;
    return acc;
  }, { wins: 0, losses: 0, pending: 0 });

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="glass-card p-6 text-center">
        <Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Connectez-vous pour voir votre historique</p>
      </div>
    );
  }

  if (picks.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Aucun pick pour le moment</p>
        <p className="text-sm text-muted-foreground mt-1">Faites votre premier Daily Pick!</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header with Stats */}
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-accent/10 to-transparent">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-bold">Historique des Picks</h3>
              <p className="text-xs text-muted-foreground">{picks.length} derniers picks</p>
            </div>
          </div>
        </div>
        
        {/* Mini stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="text-success font-medium">{stats.wins}</span>
            <span className="text-muted-foreground">gagnés</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive"></div>
            <span className="text-destructive font-medium">{stats.losses}</span>
            <span className="text-muted-foreground">perdus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
            <span className="text-muted-foreground font-medium">{stats.pending}</span>
            <span className="text-muted-foreground">en attente</span>
          </div>
        </div>
      </div>

      {/* Picks List */}
      <div className="divide-y divide-border/30">
        {picks.map((pick, index) => {
          const config = statusConfig[pick.status];
          const StatusIcon = config.icon;
          const isExpanded = expandedPick === pick.id;
          
          return (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${config.bg}`}
            >
              {/* Pick Header */}
              <button
                onClick={() => toggleExpand(pick.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center`}>
                    <StatusIcon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{formatPickDate(pick.pick_date)}</div>
                    <div className="text-xs text-muted-foreground">
                      {pick.matches.length} matchs • {config.label}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-sm font-display font-bold ${pick.status === 'won' ? 'text-success' : 'text-muted-foreground'}`}>
                      {pick.status === 'won' ? '+' : ''}{pick.total_potential_reward} ARENA
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pick.status === 'pending' ? 'potentiel' : pick.status === 'won' ? 'gagné!' : 'perdu'}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-2">
                      {pick.matches.map((match, matchIndex) => {
                        const matchResult = match.result || 'pending';
                        const resultConfig = statusConfig[matchResult === 'won' ? 'won' : matchResult === 'lost' ? 'lost' : 'pending'];
                        const MatchIcon = resultConfig.icon;
                        
                        return (
                          <motion.div
                            key={matchIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: matchIndex * 0.05 }}
                            className={`p-3 rounded-lg border ${resultConfig.border} ${resultConfig.bg}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <MatchIcon className={`w-4 h-4 ${resultConfig.color}`} />
                                <div>
                                  <div className="text-sm">
                                    <span className={match.selectedTeam === match.teamA ? 'font-bold text-primary' : ''}>
                                      {match.teamA}
                                    </span>
                                    <span className="text-muted-foreground mx-2">vs</span>
                                    <span className={match.selectedTeam === match.teamB ? 'font-bold text-primary' : ''}>
                                      {match.teamB}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Choix: <span className="text-primary font-medium">{match.selectedTeam}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-display font-bold">{match.odds.toFixed(2)}x</div>
                                <div className={`text-xs ${resultConfig.color}`}>
                                  {matchResult === 'won' ? '✓ Correct' : matchResult === 'lost' ? '✗ Incorrect' : 'En cours'}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}