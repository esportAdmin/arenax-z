import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Match {
  id: string;
  teamA: { name: string; logo: string; odds: number };
  teamB: { name: string; logo: string; odds: number };
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
  filter?: 'all' | 'live' | 'upcoming' | 'finished';
  refreshInterval?: number;
}

export function useMatches(options: UseMatchesOptions = {}) {
  const { filter = 'all', refreshInterval = 30000 } = options;
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setError(null);
      
      const { data, error: fnError } = await supabase.functions.invoke('pandascore-matches', {
        body: {},
      });
      
      if (fnError) {
        console.error('Error invoking function:', fnError);
        throw new Error(fnError.message);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      let fetchedMatches = data?.matches || [];
      
      // Apply client-side filter
      if (filter === 'live') {
        fetchedMatches = fetchedMatches.filter((m: Match) => m.isLive);
      } else if (filter === 'upcoming') {
        fetchedMatches = fetchedMatches.filter((m: Match) => !m.isLive && !m.isFinished);
      } else if (filter === 'finished') {
        fetchedMatches = fetchedMatches.filter((m: Match) => m.isFinished);
      }
      
      setMatches(fetchedMatches);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMatches();
    
    // Set up auto-refresh for live data
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
