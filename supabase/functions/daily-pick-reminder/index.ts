import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { Resend } from 'https://esm.sh/resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

interface UserToNotify {
  user_id: string
  email: string
  display_name: string | null
  active_streak: number
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('🔔 Starting daily pick reminder job...')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const today = new Date().toISOString().split('T')[0]

    // Get all users who haven't made their daily pick today
    // Join with auth.users to get emails
    const { data: usersWithPicks, error: picksError } = await supabase
      .from('daily_pro_picks')
      .select('user_id')
      .eq('pick_date', today)

    if (picksError) {
      console.error('Error fetching today\'s picks:', picksError)
      throw picksError
    }

    const usersWhoPickedToday = usersWithPicks?.map(p => p.user_id) || []
    console.log(`📊 ${usersWhoPickedToday.length} users already picked today`)

    // Get all profiles that haven't picked today
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, display_name, active_streak')
      .not('user_id', 'in', usersWhoPickedToday.length > 0 ? `(${usersWhoPickedToday.join(',')})` : '(00000000-0000-0000-0000-000000000000)')

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      throw profilesError
    }

    console.log(`📋 Found ${profiles?.length || 0} users who haven't picked today`)

    if (!profiles || profiles.length === 0) {
      console.log('✅ All users have made their daily picks!')
      return new Response(
        JSON.stringify({ success: true, message: 'No reminders needed', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user emails from auth.users (using admin API)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      console.error('Error fetching auth users:', authError)
      throw authError
    }

    // Map user_id to email
    const userEmailMap = new Map<string, string>()
    authUsers.users.forEach(user => {
      if (user.email) {
        userEmailMap.set(user.id, user.email)
      }
    })

    // Prepare notifications
    const usersToNotify: UserToNotify[] = profiles
      .filter(p => userEmailMap.has(p.user_id))
      .map(p => ({
        user_id: p.user_id,
        email: userEmailMap.get(p.user_id)!,
        display_name: p.display_name,
        active_streak: p.active_streak
      }))

    console.log(`📧 Sending reminders to ${usersToNotify.length} users...`)

    let sentCount = 0
    let errorCount = 0

    // Send emails in batches
    for (const user of usersToNotify) {
      try {
        const streakMessage = user.active_streak > 0
          ? `🔥 Don't break your ${user.active_streak}-day streak!`
          : '🎯 Start building your winning streak today!'

        const { error: emailError } = await resend.emails.send({
          from: 'Arena Predictions <noreply@resend.dev>',
          to: [user.email],
          subject: `${streakMessage} Make your Daily Pick now!`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; color: #ffffff; padding: 40px 20px; margin: 0;">
              <div style="max-width: 500px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; padding: 32px; border: 1px solid rgba(139, 92, 246, 0.3);">
                <div style="text-align: center; margin-bottom: 24px;">
                  <div style="font-size: 48px; margin-bottom: 16px;">⚡</div>
                  <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #ffffff;">
                    Hey ${user.display_name || 'Champion'}!
                  </h1>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #a0a0a0; text-align: center; margin-bottom: 24px;">
                  You haven't made your Daily Pro Pick yet today. Don't miss out on potential rewards!
                </p>
                
                ${user.active_streak > 0 ? `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
                  <div style="font-size: 32px; margin-bottom: 8px;">🔥</div>
                  <p style="margin: 0; color: #ef4444; font-weight: bold;">
                    ${user.active_streak}-day streak at risk!
                  </p>
                  <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">
                    Make your picks before midnight to keep it going.
                  </p>
                </div>
                ` : `
                <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
                  <div style="font-size: 32px; margin-bottom: 8px;">🎯</div>
                  <p style="margin: 0; color: #8b5cf6; font-weight: bold;">
                    Start your winning streak today!
                  </p>
                </div>
                `}
                
                <div style="text-align: center;">
                  <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovableproject.com')}" 
                     style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Make Your Picks Now →
                  </a>
                </div>
                
                <p style="font-size: 12px; color: #666; text-align: center; margin-top: 32px;">
                  Arena Predictions • Predict. Compete. Win.
                </p>
              </div>
            </body>
            </html>
          `,
        })

        if (emailError) {
          console.error(`Failed to send to ${user.email}:`, emailError)
          errorCount++
        } else {
          console.log(`✅ Sent reminder to ${user.email}`)
          sentCount++
        }

        // Create in-app notification as well
        await supabase.from('user_notifications').insert({
          user_id: user.user_id,
          type: 'daily_reminder',
          title: user.active_streak > 0 
            ? `🔥 ${user.active_streak}-day streak at risk!` 
            : '⚡ Daily Pick Available!',
          message: "Don't forget to make your Daily Pro Pick before midnight!",
          value: 'daily-pick'
        })

      } catch (err) {
        console.error(`Error processing user ${user.email}:`, err)
        errorCount++
      }
    }

    console.log(`📊 Reminder job complete: ${sentCount} sent, ${errorCount} errors`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount, 
        errors: errorCount,
        total: usersToNotify.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error in daily-pick-reminder:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})