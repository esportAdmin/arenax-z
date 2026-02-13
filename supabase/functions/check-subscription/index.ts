import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Response schema for type safety
const subscriptionResponseSchema = z.object({
  subscribed: z.boolean(),
  product_id: z.string().nullable(),
  price_id: z.string().nullable(),
  subscription_end: z.string().nullable(),
});

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Validate authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logStep("ERROR", { message: "Missing or invalid authorization header" });
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token || token.length < 10 || token.length > 2000) {
      logStep("ERROR", { message: "Invalid token format" });
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Supabase client (ANON key is enough for auth.getUser(token))
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    if (!supabaseUrl || !supabaseAnon) {
      throw new Error("SUPABASE_URL / SUPABASE_ANON_KEY not set");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnon, {
      auth: { persistSession: false },
    });

    logStep("Authenticating user with token");
    const { data: userData, error: userError } =
      await supabaseClient.auth.getUser(token);

    if (userError)
      throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email)
      throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find customer by email (OK for now; later optimize by persisting customer_id)
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      logStep("No customer found, user is not subscribed");

      const response = {
        subscribed: false,
        product_id: null,
        price_id: null,
        subscription_end: null,
      };

      subscriptionResponseSchema.parse(response);

      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;

    let productId: string | null = null;
    let priceId: string | null = null;
    let subscriptionEnd: string | null = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(
        subscription.current_period_end * 1000,
      ).toISOString();
      productId = subscription.items.data[0]?.price?.product as string;
      priceId = subscription.items.data[0]?.price?.id ?? null;

      logStep("Active subscription found", {
        subscriptionId: subscription.id,
        endDate: subscriptionEnd,
        productId,
        priceId,
      });
    } else {
      logStep("No active subscription found");
    }

    const response = {
      subscribed: hasActiveSub,
      product_id: productId,
      price_id: priceId,
      subscription_end: subscriptionEnd,
    };

    subscriptionResponseSchema.parse(response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      status: 500,
    });
  }
});
