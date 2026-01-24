import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Trash2, Pin, VolumeX, Users, 
  TrendingUp, Shield, ChartBar, Download
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useModerationStats } from '@/hooks/useModerationStats';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ModerationStatsProps {
  clubId: string;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  subValue,
  color = 'primary'
}: { 
  icon: React.ElementType; 
  label: string; 
  value: number;
  subValue?: string;
  color?: 'primary' | 'destructive' | 'warning' | 'success';
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    destructive: 'text-destructive bg-destructive/10',
    warning: 'text-amber-500 bg-amber-500/10',
    success: 'text-green-500 bg-green-500/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card/50 border border-border/50 rounded-lg p-4"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MiniChart = ({ data }: { data: { date: string; count: number }[] }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((item, index) => (
        <div key={item.date} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.count / maxCount) * 100}%` }}
            transition={{ delay: index * 0.05 }}
            className="w-full bg-primary/60 rounded-t min-h-[4px]"
            style={{ minHeight: item.count > 0 ? '8px' : '4px' }}
          />
          <span className="text-[9px] text-muted-foreground">
            {format(new Date(item.date), 'EEE', { locale: fr }).charAt(0).toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
};

export const ModerationStats = ({ clubId }: ModerationStatsProps) => {
  const [open, setOpen] = useState(false);
  const { stats, loading, refresh } = useModerationStats(clubId);

  const exportToCSV = () => {
    if (!stats) return;

    const date = format(new Date(), 'yyyy-MM-dd');
    
    // Build CSV content
    const rows: string[][] = [
      ['Statistiques de modération', date],
      [],
      ['Métrique', 'Valeur'],
      ['Messages supprimés', stats.totalMessagesDeleted.toString()],
      ['Messages épinglés', stats.totalPins.toString()],
      ['Messages désépinglés', stats.totalUnpins.toString()],
      ['Membres mutés (total)', stats.totalMutes.toString()],
      ['Membres unmutés', stats.totalUnmutes.toString()],
      ['Mutes actifs', stats.activeMutes.toString()],
      ['Sondages créés', stats.totalPolls.toString()],
      ['Sondages actifs', stats.activePolls.toString()],
      [],
      ['Activité des 7 derniers jours'],
      ['Date', 'Actions'],
      ...stats.recentActions.map(a => [a.date, a.count.toString()]),
      [],
      ['Modérateurs les plus actifs'],
      ['Nom', 'Actions'],
      ...stats.topModerators.map(m => [m.display_name, m.action_count.toString()])
    ];

    const csvContent = rows.map(row => row.join(',')).join('\n');
    
    // Create and download file
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moderation-stats-${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Statistiques exportées en CSV');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ChartBar className="h-4 w-4" />
          Statistiques
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Statistiques de modération
            </DialogTitle>
            {stats && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportToCSV}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter CSV
              </Button>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : stats ? (
          <div className="space-y-6 mt-4">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Trash2}
                label="Messages supprimés"
                value={stats.totalMessagesDeleted}
                color="destructive"
              />
              <StatCard
                icon={VolumeX}
                label="Membres mutés"
                value={stats.totalMutes}
                subValue={`${stats.activeMutes} actif${stats.activeMutes > 1 ? 's' : ''}`}
                color="warning"
              />
              <StatCard
                icon={Pin}
                label="Messages épinglés"
                value={stats.totalPins}
                color="primary"
              />
              <StatCard
                icon={BarChart3}
                label="Sondages créés"
                value={stats.totalPolls}
                subValue={`${stats.activePolls} actif${stats.activePolls > 1 ? 's' : ''}`}
                color="success"
              />
            </div>

            {/* Activity Chart */}
            <div className="bg-card/50 border border-border/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-sm">Activité des 7 derniers jours</h4>
              </div>
              <MiniChart data={stats.recentActions} />
              <p className="text-xs text-muted-foreground text-center mt-2">
                {stats.recentActions.reduce((acc, d) => acc + d.count, 0)} actions cette semaine
              </p>
            </div>

            {/* Top Moderators */}
            {stats.topModerators.length > 0 && (
              <div className="bg-card/50 border border-border/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-sm">Modérateurs les plus actifs</h4>
                </div>
                <div className="space-y-2">
                  {stats.topModerators.map((mod, index) => (
                    <motion.div
                      key={mod.moderator_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="text-xs text-muted-foreground w-4">
                        #{index + 1}
                      </span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mod.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {mod.display_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {mod.display_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">
                          {mod.action_count}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          action{mod.action_count > 1 ? 's' : ''}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p>
                Total: {stats.totalMessagesDeleted + stats.totalPins + stats.totalUnpins + stats.totalMutes + stats.totalUnmutes} actions de modération
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Aucune statistique disponible
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
