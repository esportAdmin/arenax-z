import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema for query parameters
const queryParamsSchema = z.object({
  filter: z.enum(["all", "live", "upcoming", "finished"]).default("all"),
});

interface PandaScoreTeam {
  id: number;
  name: string;
  image_url: string | null;
  acronym: string | null;
}

interface PandaScoreOpponent {
  opponent: PandaScoreTeam;
  type: string;
}

interface PandaScoreMatch {
  id: number;
  name: string;
  status: 'not_started' | 'running' | 'finished' | 'canceled';
  scheduled_at: string | null;
  begin_at: string | null;
  end_at: string | null;
  opponents: PandaScoreOpponent[];
  results: Array<{ team_id: number; score: number }>;
  league: { name: string; image_url: string | null };
  serie: { name: string | null };
  tournament: { name: string };
  games: Array<{ status: string; winner: { id: number } | null }>;
  winner: PandaScoreTeam | null;
}

interface FormattedMatch {
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

function generateOdds(teamARank: number, teamBRank: number): { oddsA: number; oddsB: number } {
  // Simple odds generation based on team names (in production, use real betting odds API)
  const baseOdds = 1.5 + Math.random() * 1.5;
  const variance = 0.3 + Math.random() * 0.4;
  
  return {
    oddsA: Math.round((baseOdds - variance) * 100) / 100,
    oddsB: Math.round((baseOdds + variance) * 100) / 100,
  };
}

function formatDateTime(dateString: string | null): { time: string; date: string } {
  if (!dateString) {
    return { time: 'TBD', date: 'À définir' };
  }
  
  const date = new Date(dateString);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  if (date.toDateString() === now.toDateString()) {
    return { time, date: "Aujourd'hui" };
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return { time, date: 'Demain' };
  } else {
    return { 
      time, 
      date: date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    };
  }
}

function getTeamEmoji(teamName: string): string {
  const emojiMap: Record<string, string> = {
    'navi': '🔥',
    'natus vincere': '🔥',
    'vitality': '🐝',
    'g2': '⚡',
    'g2 esports': '⚡',
    'faze': '🎯',
    'faze clan': '🎯',
    'cloud9': '☁️',
    'heroic': '🦸',
    'spirit': '👻',
    'team spirit': '👻',
    'mouz': '🐭',
    'liquid': '💧',
    'team liquid': '💧',
    'astralis': '⭐',
    'complexity': '🔷',
    'ence': '🦅',
    'fnatic': '🧡',
    'ninjas in pyjamas': '🥷',
    'nip': '🥷',
    'virtus.pro': '🐻',
    'big': '💎',
    'mibr': '🇧🇷',
    'imperial': '👑',
    'eternal fire': '🔥',
    'monte': '⛰️',
    '3dmax': '🎮',
    'gamerlegion': '🦁',
    'falcons': '🦅',
    'betboom': '💣',
    'apeks': '🎪',
  };
  
  const lowerName = teamName.toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lowerName.includes(key)) {
      return emoji;
    }
  }
  return '🎮';
}

function formatMatch(match: PandaScoreMatch): FormattedMatch | null {
  if (match.opponents.length < 2) {
    return null;
  }
  
  const teamA = match.opponents[0].opponent;
  const teamB = match.opponents[1].opponent;
  const { oddsA, oddsB } = generateOdds(0, 0);
  const { time, date } = formatDateTime(match.scheduled_at || match.begin_at);
  
  // Get map scores from results
  const scoreA = match.results?.find(r => r.team_id === teamA.id)?.score || 0;
  const scoreB = match.results?.find(r => r.team_id === teamB.id)?.score || 0;
  
  // Generate fake locked amount for demo
  const totalLocked = Math.floor(Math.random() * 15000) + 1000;
  
  return {
    id: `pandascore-${match.id}`,
    teamA: {
      name: teamA.acronym || teamA.name,
      logo: getTeamEmoji(teamA.name),
      odds: oddsA,
    },
    teamB: {
      name: teamB.acronym || teamB.name,
      logo: getTeamEmoji(teamB.name),
      odds: oddsB,
    },
    tournament: `${match.league.name}${match.serie.name ? ` - ${match.serie.name}` : ''}`,
    time,
    date,
    isLive: match.status === 'running',
    isFinished: match.status === 'finished',
    totalLocked,
    game: 'CS2',
    mapScore: (match.status === 'running' || match.status === 'finished') 
      ? { teamA: scoreA, teamB: scoreB } 
      : undefined,
    winner: match.winner?.name,
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const apiKey = Deno.env.get('PANDASCORE_API_KEY');
    
    if (!apiKey) {
      console.error('PANDASCORE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate query parameters
    const url = new URL(req.url);
    const rawFilter = url.searchParams.get('filter') || 'all';
    
    const validationResult = queryParamsSchema.safeParse({ filter: rawFilter });
    if (!validationResult.success) {
      console.error('Invalid filter parameter:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid filter parameter. Allowed values: all, live, upcoming, finished' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { filter } = validationResult.data;
    console.log(`Fetching matches with filter: ${filter}`);
    
    const baseUrl = 'https://api.pandascore.co/csgo/matches';
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    };
    
    let allMatches: FormattedMatch[] = [];
    
    // Fetch matches based on filter
    if (filter === 'all' || filter === 'live') {
      console.log('Fetching running matches...');
      const runningRes = await fetch(`${baseUrl}/running?per_page=10`, { headers });
      if (runningRes.ok) {
        const running: PandaScoreMatch[] = await runningRes.json();
        console.log(`Found ${running.length} running matches`);
        const formatted = running.map(formatMatch).filter(Boolean) as FormattedMatch[];
        allMatches = [...allMatches, ...formatted];
      } else {
        console.error('Failed to fetch running matches:', await runningRes.text());
      }
    }
    
    if (filter === 'all' || filter === 'upcoming') {
      console.log('Fetching upcoming matches...');
      const upcomingRes = await fetch(`${baseUrl}/upcoming?per_page=20&sort=begin_at`, { headers });
      if (upcomingRes.ok) {
        const upcoming: PandaScoreMatch[] = await upcomingRes.json();
        console.log(`Found ${upcoming.length} upcoming matches`);
        const formatted = upcoming.map(formatMatch).filter(Boolean) as FormattedMatch[];
        allMatches = [...allMatches, ...formatted];
      } else {
        console.error('Failed to fetch upcoming matches:', await upcomingRes.text());
      }
    }
    
    if (filter === 'finished') {
      console.log('Fetching past matches...');
      const pastRes = await fetch(`${baseUrl}/past?per_page=20&sort=-end_at`, { headers });
      if (pastRes.ok) {
        const past: PandaScoreMatch[] = await pastRes.json();
        console.log(`Found ${past.length} past matches`);
        const formatted = past.map(formatMatch).filter(Boolean) as FormattedMatch[];
        allMatches = [...allMatches, ...formatted];
      } else {
        console.error('Failed to fetch past matches:', await pastRes.text());
      }
    }
    
    console.log(`Returning ${allMatches.length} total matches`);
    
    return new Response(
      JSON.stringify({ matches: allMatches }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching PandaScore matches:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch matches', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
