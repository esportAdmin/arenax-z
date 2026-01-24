import { useState } from "react";
import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsTopbar } from "@/components/analytics/AnalyticsTopbar";
import { useMatches, Match } from "@/hooks/useMatches";
import { RefreshCw, Search, Filter, Loader2, AlertCircle, Zap, Clock, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FilterType = 'all' | 'live' | 'upcoming' | 'finished';

interface MatchRowProps {
  match: Match;
}

function MatchRow({ match }: MatchRowProps) {
  const getStatusBadge = () => {
    if (match.isLive) {
      return (
        <Badge className="bg-destructive/20 text-destructive border-destructive/30 gap-1">
          <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          LIVE
        </Badge>
      );
    }
    if (match.isFinished) {
      return (
        <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Terminé
        </Badge>
      );
    }
    return (
      <Badge className="bg-warning/20 text-warning border-warning/30 gap-1">
        <Clock className="w-3 h-3" />
        À venir
      </Badge>
    );
  };

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-center justify-between gap-4">
        {/* Status & Tournament */}
        <div className="flex items-center gap-3 min-w-[200px]">
          {getStatusBadge()}
          <span className="text-xs text-muted-foreground truncate">{match.tournament}</span>
        </div>

        {/* Teams */}
        <div className="flex-1 flex items-center justify-center gap-4">
          <div className="flex items-center gap-3 flex-1 justify-end">
            <span className="font-semibold text-foreground text-right">{match.teamA.name}</span>
            <span className="text-2xl">{match.teamA.logo}</span>
          </div>

          <div className="flex flex-col items-center min-w-[80px]">
            {match.mapScore ? (
              <span className="text-2xl font-display font-bold text-foreground">
                {match.mapScore.teamA} - {match.mapScore.teamB}
              </span>
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">VS</span>
            )}
            <span className="text-xs text-muted-foreground">{match.time}</span>
          </div>

          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">{match.teamB.logo}</span>
            <span className="font-semibold text-foreground">{match.teamB.name}</span>
          </div>
        </div>

        {/* Odds */}
        <div className="flex items-center gap-2 min-w-[200px] justify-end">
          <div className="flex gap-2">
            <div className="bg-primary/10 border border-primary/30 rounded-lg px-3 py-1.5 text-center">
              <span className="text-xs text-muted-foreground block">Cote</span>
              <span className="text-sm font-bold text-primary">{match.teamA.odds.toFixed(2)}</span>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-lg px-3 py-1.5 text-center">
              <span className="text-xs text-muted-foreground block">Cote</span>
              <span className="text-sm font-bold text-accent">{match.teamB.odds.toFixed(2)}</span>
            </div>
          </div>
          <Button 
            size="sm" 
            variant={match.isFinished ? "outline" : "default"}
            className="h-9"
          >
            {match.isFinished ? "Détails" : "Prédire"}
          </Button>
        </div>
      </div>

      {/* Match footer info */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs">{match.game}</Badge>
          <span className="text-xs text-muted-foreground">{match.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Total misé:</span>
          <span className="text-xs font-semibold text-primary">{match.totalLocked.toLocaleString()} AP</span>
        </div>
        {match.winner && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Vainqueur:</span>
            <span className="text-xs font-semibold text-success">{match.winner}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyticsMatches() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { matches, loading, error, refetch } = useMatches({ filter });

  const filteredMatches = matches.filter(match => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      match.teamA.name.toLowerCase().includes(query) ||
      match.teamB.name.toLowerCase().includes(query) ||
      match.tournament.toLowerCase().includes(query)
    );
  });

  const filterButtons: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'Tous', icon: <Calendar className="w-4 h-4" /> },
    { key: 'live', label: 'En direct', icon: <Zap className="w-4 h-4" /> },
    { key: 'upcoming', label: 'À venir', icon: <Clock className="w-4 h-4" /> },
    { key: 'finished', label: 'Terminés', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const stats = {
    total: matches.length,
    live: matches.filter(m => m.isLive).length,
    upcoming: matches.filter(m => !m.isLive && !m.isFinished).length,
    finished: matches.filter(m => m.isFinished).length,
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <AnalyticsSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnalyticsTopbar title="Matches" />
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Matches</p>
                </div>
              </div>
            </div>
            <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.live}</p>
                  <p className="text-xs text-muted-foreground">En Direct</p>
                </div>
              </div>
            </div>
            <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.upcoming}</p>
                  <p className="text-xs text-muted-foreground">À Venir</p>
                </div>
              </div>
            </div>
            <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.finished}</p>
                  <p className="text-xs text-muted-foreground">Terminés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {filterButtons.map((btn) => (
                <Button
                  key={btn.key}
                  variant={filter === btn.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(btn.key)}
                  className={cn(
                    "gap-2",
                    filter === btn.key && "bg-primary text-primary-foreground"
                  )}
                >
                  {btn.icon}
                  {btn.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une équipe ou tournoi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[300px] bg-[#12121a] border-white/10"
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => refetch()}
                disabled={loading}
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
              </Button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Chargement des matches...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="text-foreground font-semibold mb-2">Erreur de chargement</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer
              </Button>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Calendar className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-foreground font-semibold mb-2">Aucun match trouvé</p>
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "Essayez une autre recherche" : "Aucun match disponible pour ce filtre"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMatches.map((match) => (
                <MatchRow key={match.id} match={match} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
