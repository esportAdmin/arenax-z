import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

// Validate price ID format and allowed values
const priceIdSchema = z.string()
  .regex(/^price_[a-zA-Z0-9_]+$/, "Invalid Stripe price ID format")
  .max(100, "Price ID too long");

// Tier configuration - must match the tiers in subscriptionTiers.ts
const TIER_ARENA_POINTS: Record<string, number> = {
  'price_STARTER_ID': 500,
  'price_PRO_ID': 1500,
  'price_ELITE_ID': 4000,
};

// Validate arena points amount
const arenaPointsSchema = z.number()
  .int("Arena points must be an integer")
  .min(0, "Arena points cannot be negative")
  .max(100000, "Arena points exceeds maximum");

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Validate signature header exists
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("ERROR", { message: "No Stripe signature found" });
      return new Response(JSON.stringify({ error: "No signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const body = await req.text();
    
    // Verify webhook signature (critical security check)
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err instanceof Error ? err.message : String(err) });
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Event verified", { type: event.type, id: event.id });

    // Handle subscription payment events
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      
      // Only process subscription invoices (not one-time payments)
      if (invoice.subscription && invoice.customer_email) {
        logStep("Processing subscription payment", { 
          customerId: invoice.customer,
          email: invoice.customer_email,
          subscriptionId: invoice.subscription 
        });

        // Get the subscription to find the price ID
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        const priceId = subscription.items.data[0]?.price.id;
        
        if (!priceId) {
          logStep("No price ID found in subscription");
          return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }

        // Validate price ID format
        const priceValidation = priceIdSchema.safeParse(priceId);
        if (!priceValidation.success) {
          logStep("Invalid price ID format", { priceId, errors: priceValidation.error.errors });
          return new Response(JSON.stringify({ received: true, warning: "Invalid price ID" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }

        const arenaPoints = TIER_ARENA_POINTS[priceId];
        
        if (!arenaPoints) {
          logStep("Unknown price ID, no Arena Points to credit", { priceId });
          return new Response(JSON.stringify({ received: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }

        // Validate arena points amount
        const pointsValidation = arenaPointsSchema.safeParse(arenaPoints);
        if (!pointsValidation.success) {
          logStep("Invalid arena points amount", { arenaPoints, errors: pointsValidation.error.errors });
          return new Response(JSON.stringify({ received: true, warning: "Invalid points amount" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }

        logStep("Crediting Arena Points", { priceId, arenaPoints, email: invoice.customer_email });

        // Initialize Supabase client with service role key
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
          { auth: { persistSession: false } }
        );

        // Find the user by email
        const { data: users, error: userError } = await supabaseClient.auth.admin.listUsers();
        
        if (userError) {
          logStep("Error listing users", { error: userError.message });
          throw new Error(`Failed to find user: ${userError.message}`);
        }

        const user = users.users.find(u => u.email === invoice.customer_email);
        
        if (!user) {
          logStep("User not found for email", { email: invoice.customer_email });
          return new Response(JSON.stringify({ received: true, warning: "User not found" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        }

        logStep("Found user", { userId: user.id, email: user.email });

        // Fetch current balance and increment
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('arena_balance')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          logStep("Error fetching profile", { error: profileError.message });
          throw new Error(`Failed to fetch profile: ${profileError.message}`);
        }

        const currentBalance = Number(profile?.arena_balance) || 0;
        const newBalance = currentBalance + arenaPoints;

        // Validate new balance
        if (newBalance < 0 || newBalance > 10000000) {
          logStep("Invalid balance calculation", { currentBalance, arenaPoints, newBalance });
          throw new Error("Balance calculation resulted in invalid value");
        }

        const updateResult = await supabaseClient
          .from('profiles')
          .update({ arena_balance: newBalance })
          .eq('user_id', user.id);

        if (updateResult.error) {
          logStep("Error updating arena balance", { error: updateResult.error.message });
          throw new Error(`Failed to update arena balance: ${updateResult.error.message}`);
        }

        // Add ledger entry
        const { error: ledgerError } = await supabaseClient
          .from('arena_ledger')
          .insert({
            user_id: user.id,
            amount: arenaPoints,
            source: 'purchase',
            description: `Subscription renewal - ${arenaPoints} Arena Points`,
            reference_id: invoice.id
          });

        if (ledgerError) {
          logStep("Error adding ledger entry", { error: ledgerError.message });
          // Don't throw, ledger is not critical
        }

        // Create notification
        const { error: notifError } = await supabaseClient
          .from('user_notifications')
          .insert({
            user_id: user.id,
            type: 'subscription_renewed',
            title: '🎉 Abonnement renouvelé !',
            message: `Vous avez reçu ${arenaPoints} Arena Points pour votre abonnement mensuel.`,
            value: arenaPoints.toString()
          });

        if (notifError) {
          logStep("Error creating notification", { error: notifError.message });
          // Don't throw, notification is not critical
        }

        logStep("Successfully credited Arena Points", { 
          userId: user.id, 
          arenaPoints, 
          newBalance 
        });
      }
    }

    // Handle subscription cancelled
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      logStep("Subscription cancelled", { 
        subscriptionId: subscription.id,
        customerId: subscription.customer 
      });
      // Could add notification or other logic here
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
