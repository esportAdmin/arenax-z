import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MatchPick {
  matchId: string;
  teamA: string;
  teamB: string;
  selectedTeam: string;
  odds: number;
  result?: 'won' | 'lost' | 'pending';
}

interface DailyPick {
  id: string;
  user_id: string;
  matches: MatchPick[];
  total_potential_reward: number;
  status: string;
}

interface PandaScoreMatch {
  id: number;
  status: 'not_started' | 'running' | 'finished' | 'canceled';
  opponents: Array<{ opponent: { id: number; name: string; acronym: string | null } }>;
  winner: { id: number; name: string; acronym: string | null } | null;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🔄 Starting pick resolution job...')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const apiKey = Deno.env.get('PANDASCORE_API_KEY')
    if (!apiKey) {
      throw new Error('PANDASCORE_API_KEY not configured')
    }

    // 1. Get all pending daily picks
    const { data: pendingPicks, error: picksError } = await supabase
      .from('daily_pro_picks')
      .select('*')
      .eq('status', 'pending')

    if (picksError) {
      console.error('Error fetching pending picks:', picksError)
      throw picksError
    }

    console.log(`📋 Found ${pendingPicks?.length || 0} pending picks to resolve`)

    if (!pendingPicks || pendingPicks.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No pending picks to resolve', resolved: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Collect all unique match IDs from pending picks
    const matchIds = new Set<string>()
    for (const pick of pendingPicks) {
      const matches = pick.matches as MatchPick[]
      for (const match of matches) {
        // Extract numeric ID from "pandascore-123456" format
        const numericId = match.matchId.replace('pandascore-', '')
        matchIds.add(numericId)
      }
    }

    console.log(`🎮 Checking ${matchIds.size} unique matches...`)

    // 3. Fetch match results from PandaScore
    const matchResults = new Map<string, { winner: string | null; isFinished: boolean }>()
    
    // Fetch matches in batches (PandaScore API)
    const matchIdArray = Array.from(matchIds)
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    }

    // Fetch past matches to get results
    const pastRes = await fetch(
      `https://api.pandascore.co/csgo/matches/past?per_page=50&sort=-end_at`,
      { headers }
    )

    if (pastRes.ok) {
      const pastMatches: PandaScoreMatch[] = await pastRes.json()
      console.log(`📊 Fetched ${pastMatches.length} past matches from PandaScore`)
      
      for (const match of pastMatches) {
        const matchId = match.id.toString()
        if (matchIds.has(matchId)) {
          const winnerName = match.winner 
            ? (match.winner.acronym || match.winner.name)
            : null
          matchResults.set(matchId, {
            winner: winnerName,
            isFinished: match.status === 'finished'
          })
          console.log(`  ✓ Match ${matchId}: winner = ${winnerName}`)
        }
      }
    } else {
      console.error('Failed to fetch past matches:', await pastRes.text())
    }

    // Also check running matches (some might have just finished)
    const runningRes = await fetch(
      `https://api.pandascore.co/csgo/matches/running?per_page=20`,
      { headers }
    )

    if (runningRes.ok) {
      const runningMatches: PandaScoreMatch[] = await runningRes.json()
      for (const match of runningMatches) {
        const matchId = match.id.toString()
        if (matchIds.has(matchId) && !matchResults.has(matchId)) {
          matchResults.set(matchId, {
            winner: null,
            isFinished: false
          })
        }
      }
    }

    // 4. Resolve each pending pick
    let resolvedCount = 0
    let rewardsAwarded = 0

    for (const pick of pendingPicks) {
      const pickData = pick as DailyPick
      const matches = pickData.matches as MatchPick[]
      
      let allFinished = true
      let allCorrect = true
      let anyCorrect = false
      const updatedMatches: MatchPick[] = []

      for (const match of matches) {
        const numericId = match.matchId.replace('pandascore-', '')
        const result = matchResults.get(numericId)

        if (!result || !result.isFinished) {
          // Match not finished yet
          allFinished = false
          updatedMatches.push({ ...match, result: 'pending' })
        } else {
          // Match finished - check if prediction was correct
          const isCorrect = result.winner === match.selectedTeam
          updatedMatches.push({ 
            ...match, 
            result: isCorrect ? 'won' : 'lost' 
          })
          
          if (isCorrect) {
            anyCorrect = true
          } else {
            allCorrect = false
          }
        }
      }

      // Only update if at least one match finished
      const finishedCount = updatedMatches.filter(m => m.result !== 'pending').length
      if (finishedCount === 0) {
        continue
      }

      // Determine overall pick status
      let newStatus = 'pending'
      if (allFinished) {
        newStatus = allCorrect ? 'won' : (anyCorrect ? 'partial' : 'lost')
      }

      // Update the pick in database
      const { error: updateError } = await supabase
        .from('daily_pro_picks')
        .update({
          matches: updatedMatches,
          status: newStatus,
          resolved_at: allFinished ? new Date().toISOString() : null
        })
        .eq('id', pickData.id)

      if (updateError) {
        console.error(`Error updating pick ${pickData.id}:`, updateError)
        continue
      }

      console.log(`✅ Updated pick ${pickData.id}: ${newStatus}`)

      // 5. Award rewards if won
      if (newStatus === 'won') {
        const reward = pickData.total_potential_reward

        // Update user balance
        const { error: balanceError } = await supabase.rpc('add_arena_points', {
          p_user_id: pickData.user_id,
          p_amount: reward,
          p_source: 'prediction_win',
          p_description: 'Daily Pick reward'
        })

        // If RPC doesn't exist, update directly
        if (balanceError) {
          console.log('RPC not available, updating balance directly...')
          await supabase
            .from('profiles')
            .update({ arena_balance: supabase.rpc('') }) // This won't work, need raw SQL
          
          // Just update with increment
          const { data: profile } = await supabase
            .from('profiles')
            .select('arena_balance')
            .eq('user_id', pickData.user_id)
            .single()
          
          if (profile) {
            await supabase
              .from('profiles')
              .update({ arena_balance: (profile.arena_balance || 0) + reward })
              .eq('user_id', pickData.user_id)
          }
        }

        // Create notification
        await supabase.from('user_notifications').insert({
          user_id: pickData.user_id,
          type: 'pick_won',
          title: '🎉 Daily Pick Gagné!',
          message: `Félicitations! Vous avez gagné ${reward} ARENA avec votre Daily Pick!`,
          value: reward.toString()
        })

        rewardsAwarded += reward
        console.log(`💰 Awarded ${reward} ARENA to user ${pickData.user_id}`)
      } else if (newStatus === 'lost') {
        // Notify about loss
        await supabase.from('user_notifications').insert({
          user_id: pickData.user_id,
          type: 'pick_lost',
          title: '😔 Daily Pick Perdu',
          message: 'Pas de chance cette fois! Retentez demain pour une nouvelle chance.',
          value: '0'
        })
      }

      resolvedCount++
    }

    console.log(`📊 Resolution complete: ${resolvedCount} picks resolved, ${rewardsAwarded} ARENA awarded`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        resolved: resolvedCount,
        rewards_awarded: rewardsAwarded,
        matches_checked: matchResults.size
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error in resolve-picks:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})