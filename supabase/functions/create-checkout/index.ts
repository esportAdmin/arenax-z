import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders, getAllowedOrigin } from "../_shared/cors.ts";

// Input validation schema
const checkoutRequestSchema = z.object({
  priceId: z
    .string()
    .min(1, "Price ID is required")
    .max(100, "Price ID too long")
    .regex(/^price_[a-zA-Z0-9_]+$/, "Invalid Stripe price ID format"),
});

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(req) });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  try {
    logStep("Function started");

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      logStep("ERROR", { message: "Invalid JSON body" });
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validate input with Zod
    const validationResult = checkoutRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors
        .map((e) => e.message)
        .join(", ");
      logStep("Validation failed", { errors: validationResult.error.errors });
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { ...corsHeaders(req), "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { priceId } = validationResult.data;
    logStep("Price ID validated", { priceId });

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
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email)
      throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check if customer already exists
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer, will create new one");
    }

    // Redirect URLs must be built from an allowlisted origin (or SITE_URL fallback)
    const origin = getAllowedOrigin(req);
    if (!origin) throw new Error("SITE_URL is required");

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/subscription?status=success`,
      cancel_url: `${origin}/subscription?status=canceled`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
      metadata: {
        supabase_user_id: user.id,
      },
    });

    logStep("Checkout session created", {
      sessionId: session.id,
      url: session.url,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders(req), "Content-Type": "application/json" },
      status: 500,
    });
  }
});
