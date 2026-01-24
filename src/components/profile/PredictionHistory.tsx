import { motion } from "framer-motion";
import { History, CheckCircle, XCircle, Clock, TrendingUp, Coins } from "lucide-react";
import { PredictionHistory as PredictionHistoryType } from "@/hooks/useProfile";
import { Badge } from "@/components/ui/badge";

interface PredictionHistoryProps {
  predictions: PredictionHistoryType[];
}

const statusConfig = {
  won: {
    label: "Gagné",
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-400/10",
    borderColor: "border-green-400/30",
  },
  lost: {
    label: "Perdu",
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-400/10",
    borderColor: "border-red-400/30",
  },
  pending: {
    label: "En cours",
    icon: Clock,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
  },
};

export function PredictionHistory({ predictions }: PredictionHistoryProps) {
  if (predictions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Historique des Pronostics
        </h2>
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun pronostic pour le moment</p>
          <p className="text-sm mt-2">Faites votre premier pronostic !</p>
        </div>
      </motion.div>
    );
  }

  const wonCount = predictions.filter(p => p.status === 'won').length;
  const lostCount = predictions.filter(p => p.status === 'lost').length;
  const pendingCount = predictions.filter(p => p.status === 'pending').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Historique des Pronostics
        </h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-400/10 text-green-400 border-green-400/30">
            {wonCount} gagnés
          </Badge>
          <Badge variant="outline" className="bg-red-400/10 text-red-400 border-red-400/30">
            {lostCount} perdus
          </Badge>
          <Badge variant="outline" className="bg-amber-400/10 text-amber-400 border-amber-400/30">
            {pendingCount} en cours
          </Badge>
        </div>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {predictions.map((prediction, index) => {
          const config = statusConfig[prediction.status as keyof typeof statusConfig] || statusConfig.pending;
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor} hover:scale-[1.02] transition-transform`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-5 h-5 ${config.color}`} />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {prediction.selected_team}
                      <span className="text-xs text-muted-foreground">
                        @ {prediction.odds.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(prediction.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Coins className="w-3 h-3 text-accent" />
                    <span>{prediction.stake_amount}</span>
                  </div>
                  <div className={`text-xs ${prediction.status === 'won' ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {prediction.status === 'won' ? '+' : ''}{prediction.potential_winnings} potentiel
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
