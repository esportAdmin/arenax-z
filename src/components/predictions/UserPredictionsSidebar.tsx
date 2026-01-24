import { motion } from "framer-motion";
import { Trophy, Clock, TrendingUp, Coins, Target, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Prediction {
  id: string;
  match_id: string;
  selected_team: string;
  stake_amount: number;
  potential_winnings: number;
  odds: number;
  status: string;
  created_at: string;
}

interface UserPredictionsSidebarProps {
  predictions: Prediction[];
  balance: number;
  totalPredictions: number;
  totalWins: number;
}

export const UserPredictionsSidebar = ({
  predictions,
  balance,
  totalPredictions,
  totalWins
}: UserPredictionsSidebarProps) => {
  const recentPredictions = predictions.slice(0, 5);
  const pendingPredictions = predictions.filter(p => p.status === 'pending');
  const winRate = totalPredictions > 0 ? Math.round((totalWins / totalPredictions) * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-accent/20 text-accent border-accent/30';
      case 'lost': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'pending': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'won': return 'Gagné';
      case 'lost': return 'Perdu';
      case 'pending': return 'En cours';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
            <Coins className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Votre Solde</p>
            <p className="font-display font-bold text-2xl">{balance.toLocaleString()} <span className="text-primary">AP</span></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs">Pronostics</span>
            </div>
            <p className="font-bold text-lg">{totalPredictions}</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs">Win Rate</span>
            </div>
            <p className="font-bold text-lg">{winRate}%</p>
          </div>
        </div>
      </motion.div>

      {/* Pending Predictions */}
      {pendingPredictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-display font-bold">En Attente</h3>
            <Badge variant="secondary" className="ml-auto">{pendingPredictions.length}</Badge>
          </div>

          <div className="space-y-3">
            {pendingPredictions.slice(0, 3).map((prediction) => (
              <div
                key={prediction.id}
                className="p-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{prediction.selected_team}</span>
                  <Badge className={getStatusColor(prediction.status)}>
                    {getStatusLabel(prediction.status)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{prediction.stake_amount} AP</span>
                  <span className="text-accent">+{prediction.potential_winnings} AP</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold">Activité Récente</h3>
        </div>

        {recentPredictions.length > 0 ? (
          <div className="space-y-3">
            {recentPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {prediction.status === 'won' ? (
                    <Trophy className="w-4 h-4 text-accent" />
                  ) : prediction.status === 'lost' ? (
                    <div className="w-4 h-4 rounded-full bg-destructive/50" />
                  ) : (
                    <Clock className="w-4 h-4 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{prediction.selected_team}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(prediction.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  prediction.status === 'won' ? 'text-accent' : 
                  prediction.status === 'lost' ? 'text-destructive' : 'text-foreground'
                }`}>
                  {prediction.status === 'won' ? '+' : ''}{prediction.status === 'won' ? prediction.potential_winnings : prediction.stake_amount} AP
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun pronostic pour le moment
          </p>
        )}
      </motion.div>
    </div>
  );
};
