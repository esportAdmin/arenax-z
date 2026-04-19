import { useState } from "react";
import { AnalyticsSidebar } from "@/components/analytics/AnalyticsSidebar";
import { AnalyticsTopbar } from "@/components/analytics/AnalyticsTopbar";
import { useTournaments, Tournament } from "@/hooks/useTournaments";
import { RefreshCw, Search, Loader2, AlertCircle, Trophy, Calendar, Users, Globe, Zap, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FilterType = 'all' | 'ongoing' | 'upcoming' | 'finished';

interface TournamentCardProps {
  tournament: Tournament;
}

function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusBadge = () => {
    switch (tournament.status) {
      case 'ongoing':
        return (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            Ongoing
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge className="bg-warning/20 text-warning border-warning/30 gap-1">
            <Clock className="w-3 h-3" />
            Upcoming
          </Badge>
        );
      case 'finished':
        return (
          <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Finished
          </Badge>
        );
    }
  };

  const getTierBadge = () => {
    const tierColors: Record<string, string> = {
      'S': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'A': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'B': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'C': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };
    return tierColors[(tournament as any).tier] || tierColors['C'];
  };

  return (
    <div className="bg-[#12121a] rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
      {/* Header with gradient */}
      <div className="relative h-24 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent p-4">
        <div className="absolute top-4 right-4">
          {getStatusBadge()}
        </div>
        {tournament.leagueLogo && (
          <img 
            src={tournament.leagueLogo} 
            alt={tournament.league}
            className="w-12 h-12 rounded-lg bg-white/10 p-1"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {tournament.name}
            </h3>
            <p className="text-sm text-muted-foreground">{tournament.league}</p>
          </div>
          <Badge variant="outline" className={cn("text-xs", getTierBadge())}>
            Tier {(tournament as any).tier || 'C'}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#0a0a0f] rounded-lg p-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Trophy className="w-3 h-3" />
              <span className="text-xs">Prize Pool</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{tournament.prizePool}</p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs">Teams</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{tournament.teams || 'N/A'}</p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Dates</span>
            </div>
            <p className="text-xs font-medium text-foreground">
              {tournament.startDate} - {tournament.endDate}
            </p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-2">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Globe className="w-3 h-3" />
              <span className="text-xs">Region</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{tournament.region}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <Badge variant="outline" className="text-xs">{tournament.game}</Badge>
          <Button size="sm" variant={tournament.status === 'finished' ? "outline" : "default"} className="h-8">
            {tournament.status === 'finished' ? "View results" : "View matches"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsTournaments() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { tournaments, loading, error, refetch } = useTournaments({ filter });

  const filteredTournaments = tournaments.filter(tournament => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tournament.name.toLowerCase().includes(query) ||
      tournament.league.toLowerCase().includes(query)
    );
  });

  const filterButtons: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Trophy className="w-4 h-4" /> },
    { key: 'ongoing', label: 'Ongoing', icon: <Zap className="w-4 h-4" /> },
    { key: 'upcoming', label: 'Upcoming', icon: <Clock className="w-4 h-4" /> },
    { key: 'finished', label: 'Finished', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const stats = {
    total: tournaments.length,
    ongoing: tournaments.filter(t => t.status === 'ongoing').length,
    upcoming: tournaments.filter(t => t.status === 'upcoming').length,
    finished: tournaments.filter(t => t.status === 'finished').length,
  };

  return (
    <div className="flex h-screen bg-[#0a0a0f] overflow-hidden">
      <AnalyticsSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnalyticsTopbar title="Tournaments" />
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total Tournaments</p>
                </div>
              </div>
            </div>
            <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stats.ongoing}</p>
                  <p className="text-xs text-muted-foreground">Ongoing</p>
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
                  <p className="text-xs text-muted-foreground">Upcoming</p>
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
                  <p className="text-xs text-muted-foreground">Finished</p>
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
                  placeholder="Search for a tournament..."
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
              <p className="text-muted-foreground">Loading tournaments...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-10 h-10 text-destructive mb-4" />
              <p className="text-foreground font-semibold mb-2">Loading error</p>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : filteredTournaments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Trophy className="w-10 h-10 text-muted-foreground mb-4" />
              <p className="text-foreground font-semibold mb-2">No tournaments found</p>
              <p className="text-muted-foreground text-sm">
                {searchQuery ? "Try a different search" : "No tournaments available for this filter"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
