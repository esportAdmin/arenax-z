import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Match {
  id: string;
  teamA: { name: string; logo: string; signalScore: number };
  teamB: { name: string; logo: string; signalScore: number };
  tournament: string;
  time: string;
  date: string;
  isLive: boolean;
  isFinished: boolean;
  totalLocked: number;
  game: string;
  mapScore?: { teamA: number; teamB: number };
  winner?: string;
}

interface UseMatchesOptions {
  filter?: "all" | "live" | "upcoming" | "finished";
  refreshInterval?: number;
}

type RawMatch = Omit<Match, "teamA" | "teamB"> & {
  teamA: Match["teamA"] & { odds?: number };
  teamB: Match["teamB"] & { odds?: number };
};

const USE_STATIC_MATCH_FEED = process.env.NODE_ENV !== "production";

const FALLBACK_MATCHES: Match[] = [
  {
    id: "fallback-match-1",
    teamA: { name: "Shadow Legion", logo: "SL", signalScore: 172 },
    teamB: { name: "Phoenix Rising", logo: "PR", signalScore: 215 },
    tournament: "ArenaX Command Series",
    time: "18:30 UTC",
    date: "Today",
    isLive: false,
    isFinished: false,
    totalLocked: 14820,
    game: "Valorant",
  },
  {
    id: "fallback-match-2",
    teamA: { name: "Titan Force", logo: "TF", signalScore: 194 },
    teamB: { name: "Vanguard Elite", logo: "VE", signalScore: 188 },
    tournament: "Global Prestige Cup",
    time: "20:00 UTC",
    date: "Today",
    isLive: false,
    isFinished: false,
    totalLocked: 20110,
    game: "League of Legends",
  },
  {
    id: "fallback-match-3",
    teamA: { name: "Storm Breakers", logo: "SB", signalScore: 205 },
    teamB: { name: "Iron Wolves", logo: "IW", signalScore: 179 },
    tournament: "Frontline Invitational",
    time: "22:15 UTC",
    date: "Today",
    isLive: false,
    isFinished: false,
    totalLocked: 12640,
    game: "Counter-Strike 2",
  },
];

function looksLikeAssetUrl(value: string) {
  return (
    /^https?:\/\//i.test(value) ||
    /^\/\//.test(value) ||
    /^data:image\//i.test(value) ||
    /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(value)
  );
}

function cleanDisplayText(value: unknown, fallback: string) {
  const text = typeof value === "string" ? value.trim() : "";

  if (!text || looksLikeAssetUrl(text)) {
    return fallback;
  }

  return text.length > 48 ? `${text.slice(0, 45).trim()}...` : text;
}

function cleanLogo(value: unknown, fallbackName: string) {
  const logo = typeof value === "string" ? value.trim() : "";

  if (logo) {
    return logo;
  }

  return fallbackName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "RG";
}

function applyFilter(matches: Match[], filter: UseMatchesOptions["filter"]) {
  if (filter === "live") {
    return matches.filter((match) => match.isLive);
  }

  if (filter === "upcoming") {
    return matches.filter((match) => !match.isLive && !match.isFinished);
  }

  if (filter === "finished") {
    return matches.filter((match) => match.isFinished);
  }

  return matches;
}

function normalizeMatch(match: RawMatch): Match {
  const normalizeSignal = (team: RawMatch["teamA"]) =>
    team.signalScore ?? Math.round((team.odds ?? 1) * 100);

  const teamAName = cleanDisplayText(match.teamA.name, "Team Alpha");
  const teamBName = cleanDisplayText(match.teamB.name, "Team Omega");
  const tournament = cleanDisplayText(match.tournament, "Community Ritual");

  return {
    ...match,
    tournament,
    teamA: {
      name: teamAName,
      logo: cleanLogo(match.teamA.logo, teamAName),
      signalScore: normalizeSignal(match.teamA),
    },
    teamB: {
      name: teamBName,
      logo: cleanLogo(match.teamB.logo, teamBName),
      signalScore: normalizeSignal(match.teamB),
    },
  };
}

export function useMatches(options: UseMatchesOptions = {}) {
  const { filter = "all", refreshInterval = 30000 } = options;

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setError(null);

      if (USE_STATIC_MATCH_FEED) {
        setMatches(applyFilter(FALLBACK_MATCHES, filter));
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke(
        "pandascore-matches",
        { body: {} },
      );

      if (fnError || data?.error) {
        setMatches(applyFilter(FALLBACK_MATCHES, filter));
        setError("Live match feed is temporarily unavailable. Showing featured fixtures.");
        return;
      }

      const fetchedMatches = Array.isArray(data?.matches)
        ? (data.matches as RawMatch[]).map(normalizeMatch)
        : [];

      if (fetchedMatches.length === 0) {
        setMatches(applyFilter(FALLBACK_MATCHES, filter));
        setError("No live fixtures were returned. Showing featured fixtures instead.");
        return;
      }

      setMatches(applyFilter(fetchedMatches, filter));
    } catch {
      setMatches(applyFilter(FALLBACK_MATCHES, filter));
      setError("Live match feed is temporarily unavailable. Showing featured fixtures.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void fetchMatches();

    const interval = setInterval(fetchMatches, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchMatches, refreshInterval]);

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches,
  };
}
