import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Tournament {
  id: string;
  name: string;
  league: string;
  leagueLogo: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  status: 'ongoing' | 'upcoming' | 'finished';
  teams: number;
  game: string;
  region: string;
}

interface UseTournamentsOptions {
  filter?: 'all' | 'ongoing' | 'upcoming' | 'finished';
  refreshInterval?: number;
}

export function useTournaments(options: UseTournamentsOptions = {}) {
  const { filter = 'all', refreshInterval = 60000 } = options;
  
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = useCallback(async () => {
    try {
      setError(null);
      
      const { data, error: fnError } = await supabase.functions.invoke('pandascore-tournaments', {
        body: { filter },
      });
      
      if (fnError) {
        console.error('Error invoking function:', fnError);
        throw new Error(fnError.message);
      }
      
      if (data?.error) {
        throw new Error(data.error);
      }
      
      setTournaments(data?.tournaments || []);
    } catch (err) {
      console.error('Failed to fetch tournaments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTournaments();
    
    const interval = setInterval(fetchTournaments, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchTournaments, refreshInterval]);

  return {
    tournaments,
    loading,
    error,
    refetch: fetchTournaments,
  };
}
