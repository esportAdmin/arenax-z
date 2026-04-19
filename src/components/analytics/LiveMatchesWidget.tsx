import { RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { TeamLogo } from "@/components/ui/team-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMatches, Match } from "@/hooks/useMatches";

interface MatchCardProps {
  status: "live" | "upcoming" | "completed";
  teamA: { name: string; logo: string; score?: number };
  teamB: { name: string; logo: string; score?: number };
  signal: string;
  time?: string;
}

function MatchCard({ status, teamA, teamB, signal, time }: MatchCardProps) {
  const statusConfig = {
    live: { label: "LIVE", color: "text-destructive", dot: "bg-destructive animate-pulse" },
    upcoming: { label: "UPCOMING", color: "text-warning", dot: "bg-warning" },
    completed: { label: "Completed", color: "text-muted-foreground", dot: "bg-muted-foreground" }
  };

  const config = statusConfig[status];

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/5">
      {/* Status header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-semibold uppercase", config.color)}>{config.label}</span>
          <span className="text-xs text-muted-foreground">-</span>
          <span className="text-xs text-primary truncate max-w-[150px]">{teamA.name} vs {teamB.name}</span>
        </div>
        {status === "live" && (
          <div className="flex items-center gap-1">
            <div className={cn("w-2 h-2 rounded-full", config.dot)} />
            <span className="text-xs text-destructive font-semibold">LIVE</span>
          </div>
        )}
        {time && status !== "live" && (
          <span className="text-xs text-muted-foreground">{time}</span>
        )}
      </div>

      {/* Teams & Score */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <TeamLogo name={teamA.name} logo={teamA.logo} size={40} shape="lg" fit="contain" className="bg-white/5 p-1 ring-0" />
        </div>
        <div className="text-center">
          <span className="text-2xl font-display font-bold text-foreground">
            {teamA.score !== undefined && teamB.score !== undefined ? `${teamA.score} - ${teamB.score}` : "VS"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TeamLogo name={teamB.name} logo={teamB.logo} size={40} shape="lg" fit="contain" className="bg-white/5 p-1 ring-0" />
        </div>
      </div>

      {/* Signal & Action */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground truncate max-w-[150px]">{signal}</span>
        <Button size="sm" variant={status === "completed" ? "outline" : "default"} className="h-8 text-xs">
          {status === "completed" ? "View Details" : "View Signal"}
        </Button>
      </div>
    </div>
  );
}

function mapMatchToCard(match: Match): MatchCardProps {
  const getStatus = (): "live" | "upcoming" | "completed" => {
    if (match.isLive) return "live";
    if (match.isFinished) return "completed";
    return "upcoming";
  };

  const status = getStatus();
  
  // Generate a simple live-call signal message.
  const getSignal = () => {
    if (match.isFinished && match.winner) {
      return `${match.winner} won`;
    }
    if (match.isFinished && match.mapScore) {
      const winner = match.mapScore.teamA > match.mapScore.teamB ? match.teamA.name : match.teamB.name;
      return `${winner} won`;
    }
    const favored =
      match.teamA.signalScore >= match.teamB.signalScore
        ? match.teamA.name
        : match.teamB.name;
    const signal = Math.min(
      Math.max(match.teamA.signalScore, match.teamB.signalScore),
      240,
    );
    return `Live call: ${favored} signal ${signal}`;
  };

  // Format time for upcoming matches
  const getTime = () => {
    if (status === "upcoming" && match.time) {
      return `Upcoming (${match.time})`;
    }
    return undefined;
  };

  return {
    status,
    teamA: {
      name: match.teamA.name,
      logo: match.teamA.logo || "/placeholder.svg",
      score: (match.isLive || match.isFinished) && match.mapScore ? match.mapScore.teamA : undefined
    },
    teamB: {
      name: match.teamB.name,
      logo: match.teamB.logo || "/placeholder.svg",
      score: (match.isLive || match.isFinished) && match.mapScore ? match.mapScore.teamB : undefined
    },
    signal: getSignal(),
    time: getTime()
  };
}

export function LiveMatchesWidget() {
  const { matches, loading, error, refetch } = useMatches({ refreshInterval: 30000 });

  // Sort matches: live first, then upcoming, then finished (most recent first)
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    if (!a.isFinished && b.isFinished) return -1;
    if (a.isFinished && !b.isFinished) return 1;
    return 0;
  }).slice(0, 5); // Show max 5 matches

  const mappedMatches = sortedMatches.map(mapMatchToCard);

  return (
    <div className="bg-[#0a0a0f] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h3 className="font-semibold text-foreground">Live Community Signals</h3>
        <button 
          onClick={() => refetch()}
          disabled={loading}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={cn("w-4 h-4 text-muted-foreground", loading && "animate-spin")} />
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 border-b border-white/5 bg-[#12121a]">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Error loading live data.</p>
            <p className="text-xs text-muted-foreground mb-3">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && matches.length === 0 && !error && (
        <div className="p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && matches.length === 0 && (
        <div className="p-4 border-b border-white/5 bg-[#12121a]">
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">No matches available.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => refetch()}
            >
              Refresh
            </Button>
          </div>
        </div>
      )}

      {/* Match cards */}
      {mappedMatches.length > 0 && (
        <div className="p-4 space-y-3">
          {mappedMatches.map((match, index) => (
            <MatchCard key={index} {...match} />
          ))}
        </div>
      )}
    </div>
  );
}
