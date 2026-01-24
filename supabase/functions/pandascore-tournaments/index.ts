import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PandaScoreTournament {
  id: number;
  name: string;
  begin_at: string | null;
  end_at: string | null;
  prizepool: string | null;
  tier: string;
  league: {
    id: number;
    name: string;
    image_url: string | null;
  };
  serie: {
    id: number;
    name: string | null;
    full_name: string | null;
  };
  teams?: Array<{ id: number; name: string }>;
}

interface FormattedTournament {
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
  tier: string;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getStatus(beginAt: string | null, endAt: string | null): 'ongoing' | 'upcoming' | 'finished' {
  const now = new Date();
  
  if (!beginAt) return 'upcoming';
  
  const start = new Date(beginAt);
  const end = endAt ? new Date(endAt) : null;
  
  if (end && now > end) return 'finished';
  if (now >= start && (!end || now <= end)) return 'ongoing';
  return 'upcoming';
}

function getTierEmoji(tier: string): string {
  switch (tier?.toLowerCase()) {
    case 's': return '🏆';
    case 'a': return '🥇';
    case 'b': return '🥈';
    case 'c': return '🥉';
    default: return '🎮';
  }
}

function getRegion(leagueName: string): string {
  const lowerName = leagueName.toLowerCase();
  if (lowerName.includes('europe') || lowerName.includes('eu')) return 'Europe';
  if (lowerName.includes('america') || lowerName.includes('na') || lowerName.includes('north')) return 'Americas';
  if (lowerName.includes('asia') || lowerName.includes('apac')) return 'Asia';
  if (lowerName.includes('cis') || lowerName.includes('russia')) return 'CIS';
  if (lowerName.includes('china')) return 'China';
  if (lowerName.includes('brazil') || lowerName.includes('south')) return 'South America';
  return 'International';
}

function formatTournament(tournament: PandaScoreTournament): FormattedTournament {
  const status = getStatus(tournament.begin_at, tournament.end_at);
  
  return {
    id: `pandascore-${tournament.id}`,
    name: tournament.name,
    league: tournament.league.name,
    leagueLogo: tournament.league.image_url || '',
    startDate: formatDate(tournament.begin_at),
    endDate: formatDate(tournament.end_at),
    prizePool: tournament.prizepool || 'N/A',
    status,
    teams: tournament.teams?.length || 0,
    game: 'CS2',
    region: getRegion(tournament.league.name),
    tier: tournament.tier?.toUpperCase() || 'C',
  };
}

serve(async (req) => {
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
    
    const body = await req.json().catch(() => ({}));
    const filter = body.filter || 'all';
    
    console.log(`Fetching tournaments with filter: ${filter}`);
    
    const baseUrl = 'https://api.pandascore.co/csgo/tournaments';
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    };
    
    let allTournaments: FormattedTournament[] = [];
    
    // Fetch running tournaments
    if (filter === 'all' || filter === 'ongoing') {
      console.log('Fetching running tournaments...');
      const runningRes = await fetch(`${baseUrl}/running?per_page=20`, { headers });
      if (runningRes.ok) {
        const running: PandaScoreTournament[] = await runningRes.json();
        console.log(`Found ${running.length} running tournaments`);
        const formatted = running.map(formatTournament);
        allTournaments = [...allTournaments, ...formatted];
      }
    }
    
    // Fetch upcoming tournaments
    if (filter === 'all' || filter === 'upcoming') {
      console.log('Fetching upcoming tournaments...');
      const upcomingRes = await fetch(`${baseUrl}/upcoming?per_page=20&sort=begin_at`, { headers });
      if (upcomingRes.ok) {
        const upcoming: PandaScoreTournament[] = await upcomingRes.json();
        console.log(`Found ${upcoming.length} upcoming tournaments`);
        const formatted = upcoming.map(formatTournament);
        allTournaments = [...allTournaments, ...formatted];
      }
    }
    
    // Fetch past tournaments
    if (filter === 'all' || filter === 'finished') {
      console.log('Fetching past tournaments...');
      const pastRes = await fetch(`${baseUrl}/past?per_page=20&sort=-end_at`, { headers });
      if (pastRes.ok) {
        const past: PandaScoreTournament[] = await pastRes.json();
        console.log(`Found ${past.length} past tournaments`);
        const formatted = past.map(formatTournament);
        allTournaments = [...allTournaments, ...formatted];
      }
    }
    
    console.log(`Returning ${allTournaments.length} total tournaments`);
    
    return new Response(
      JSON.stringify({ tournaments: allTournaments }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error fetching PandaScore tournaments:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tournaments', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
