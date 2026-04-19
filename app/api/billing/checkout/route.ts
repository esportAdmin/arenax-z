import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type CheckoutBody = {
  planId?: string;
  variantId?: string;
};

type LemonCheckoutResponse = {
  data?: {
    attributes?: {
      url?: string;
    };
  };
  errors?: Array<{ detail?: string; title?: string }>;
};

/**
 * Reads a required server-side environment variable.
 *
 * @example
 * const apiKey = readRequiredEnv("LEMONSQUEEZY_API_KEY");
 */
function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

/**
 * Returns a safe redirect origin for hosted checkout returns.
 *
 * @example
 * const origin = getCheckoutOrigin(request);
 */
function getCheckoutOrigin(req: Request): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "";
  const requestOrigin = req.headers.get("origin") ?? "";

  if (requestOrigin) {
    try {
      const parsed = new URL(requestOrigin);
      const isLocal = ["localhost", "127.0.0.1"].includes(parsed.hostname);
      const isVercelPreview = parsed.hostname.endsWith(".vercel.app");
      const matchesConfigured = configured && requestOrigin === configured;

      if (parsed.protocol === "https:" && (isVercelPreview || matchesConfigured)) {
        return requestOrigin;
      }

      if (isLocal) return requestOrigin;
    } catch {
      // Fall back to the configured site URL below.
    }
  }

  if (!configured) throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
  return configured;
}

/**
 * Checks that a Lemon Squeezy variant ID is safe to send to the API.
 *
 * @example
 * assertVariantId("123456");
 */
function assertVariantId(variantId: unknown): asserts variantId is string {
  if (typeof variantId !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(variantId)) {
    throw new Error("Invalid Lemon Squeezy variant ID");
  }
}

/**
 * Creates a hosted Lemon Squeezy checkout and returns its URL.
 *
 * @example
 * const url = await createLemonCheckout({ email: "admin@example.com", planId: "pro", userId: "u_1", variantId: "123" }, "https://app.example.com");
 */
async function createLemonCheckout(
  input: { email: string; planId: string; userId: string; variantId: string },
  origin: string,
): Promise<string> {
  const apiKey = readRequiredEnv("LEMONSQUEEZY_API_KEY");
  const storeId = readRequiredEnv("LEMONSQUEEZY_STORE_ID");
  const enabledVariant = /^\d+$/.test(input.variantId)
    ? Number(input.variantId)
    : input.variantId;

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/vnd.api+json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            enabled_variants: [enabledVariant],
            redirect_url: `${origin}/subscription?status=success`,
            receipt_button_text: "Return to RallyGuild",
            receipt_link_url: `${origin}/dashboard`,
          },
          checkout_options: {
            embed: false,
            media: true,
            logo: true,
            desc: true,
            discount: true,
            subscription_preview: true,
            background_color: "#050b14",
            button_color: "#67e8f9",
            button_text_color: "#020617",
          },
          checkout_data: {
            email: input.email,
            custom: {
              plan_id: input.planId,
              user_id: input.userId,
              source: "rallyguild_subscription_page",
            },
          },
          test_mode: process.env.LEMONSQUEEZY_TEST_MODE === "true",
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: storeId,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: input.variantId,
            },
          },
        },
      },
    }),
  });

  const payload = (await response.json()) as LemonCheckoutResponse;

  if (!response.ok) {
    const message =
      payload.errors?.[0]?.detail ??
      payload.errors?.[0]?.title ??
      "Lemon Squeezy checkout failed";
    throw new Error(message);
  }

  const url = payload.data?.attributes?.url;
  if (!url) throw new Error("Lemon Squeezy did not return a checkout URL");

  return url;
}

/**
 * Authenticates a Supabase user and starts a Lemon Squeezy checkout.
 *
 * @example
 * await fetch("/api/billing/checkout", { method: "POST" });
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;
    assertVariantId(body.variantId);

    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "").trim()
      : "";

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
      readRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
      readRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      { auth: { persistSession: false } },
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user?.id || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const origin = getCheckoutOrigin(req);
    const url = await createLemonCheckout(
      {
        email: user.email,
        planId: body.planId ?? "unknown",
        userId: user.id,
        variantId: body.variantId,
      },
      origin,
    );

    return NextResponse.json({ provider: "lemonsqueezy", url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
