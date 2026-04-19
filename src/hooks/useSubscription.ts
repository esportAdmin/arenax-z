"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isLocalQaUser } from "@/lib/dev-auth";
import {
  getTierByPriceId,
  getTierByProductId,
  SubscriptionTier,
} from "@/lib/subscriptionTiers";

const NON_BLOCKING_FUNCTION_ERRORS = ["401", "403", "404", "non-2xx", "jwt"];

function isExpectedSubscriptionMiss(message?: string | null) {
  const normalized = message?.toLowerCase() ?? "";
  return NON_BLOCKING_FUNCTION_ERRORS.some((token) =>
    normalized.includes(token),
  );
}

export interface SubscriptionStatus {
  subscribed: boolean;
  tier: SubscriptionTier | null;
  subscriptionEnd: string | null;
  loading: boolean;
}

interface UseSubscriptionOptions {
  enabled?: boolean;
  poll?: boolean;
}

async function getAccessToken(): Promise<string | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) return null;

  return data.session.access_token;
}

export function useSubscription(options: UseSubscriptionOptions = {}) {
  const { enabled = true, poll = true } = options;
  const { user } = useAuth();
  const isLocalQa = isLocalQaUser(user);

  const [status, setStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    tier: null,
    subscriptionEnd: null,
    loading: true,
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const checkSubscription = useCallback(async () => {
    if (!enabled || !user || isLocalQa) {
      setStatus({
        subscribed: false,
        tier: null,
        subscriptionEnd: null,
        loading: false,
      });
      return;
    }

    try {
      const token = await getAccessToken();

      if (!token) {
        setStatus({
          subscribed: false,
          tier: null,
          subscriptionEnd: null,
          loading: false,
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke(
        "check-subscription",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (error) {
        if (!isExpectedSubscriptionMiss(error.message)) {
          console.error("[checkSubscription]", error.message);
        }

        setStatus({
          subscribed: false,
          tier: null,
          subscriptionEnd: null,
          loading: false,
        });
        return;
      }

      const tier = data?.price_id
        ? getTierByPriceId(data.price_id)
        : data?.product_id
          ? getTierByProductId(data.product_id)
          : null;

      setStatus({
        subscribed: Boolean(data?.subscribed),
        tier: tier || null,
        subscriptionEnd: data?.subscription_end ?? null,
        loading: false,
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[checkSubscription:unexpected]", error);
      }

      setStatus({
        subscribed: false,
        tier: null,
        subscriptionEnd: null,
        loading: false,
      });
    }
  }, [enabled, isLocalQa, user]);

  useEffect(() => {
    if (!enabled) {
      setStatus({
        subscribed: false,
        tier: null,
        subscriptionEnd: null,
        loading: false,
      });
      return;
    }

    checkSubscription();
  }, [enabled, checkSubscription]);

  useEffect(() => {
    if (!enabled || !poll || !user || isLocalQa) return;

    const interval = window.setInterval(() => {
      checkSubscription();
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [enabled, poll, isLocalQa, user, checkSubscription]);

  const createCheckout = useCallback(
    async (variantId: string, planId?: string) => {
      if (!user) throw new Error("User must be logged in");

      setCheckoutLoading(true);

      try {
        const token = await getAccessToken();

        if (!token) throw new Error("Session expired");

        const response = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planId, variantId }),
        });

        const data = (await response.json()) as {
          error?: string;
          url?: string;
        };

        if (!response.ok || !data.url) {
          throw new Error(data.error ?? "Unable to start Lemon Squeezy checkout");
        }

        window.location.assign(data.url);
      } catch (error) {
        console.error("[createCheckout]", error);
        throw error;
      } finally {
        setCheckoutLoading(false);
      }
    },
    [user],
  );

  const openCustomerPortal = useCallback(async () => {
    if (!user) throw new Error("User must be logged in");

    setPortalLoading(true);

    try {
      throw new Error(
        "Lemon Squeezy subscription management is handled from hosted customer emails until the customer portal route is configured.",
      );
    } catch (error) {
      console.error("[lemonCustomerPortal]", error);
      throw error;
    } finally {
      setPortalLoading(false);
    }
  }, [user]);

  return {
    ...status,
    checkoutLoading,
    portalLoading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
}
