// app/subscription/SubscriptionInner.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import PremiumSubscriptionHub from "@/components/subscription/PremiumSubscriptionHub";

/**
 * Read URL params on client safely (must be under <Suspense/>).
 *
 * @example
 * // /subscription?status=success -> shows success toast
 */
export default function SubscriptionInner() {
  const params = useSearchParams();
  const router = useRouter();

  const status = useMemo(() => params.get("status"), [params]);
  const sessionId = useMemo(() => params.get("session_id"), [params]);

  useEffect(() => {
    if (status === "success") toast.success("Abonnement activé");
    if (status === "canceled") toast.error("Paiement annulé");
    if (status === "error") toast.error("Erreur de paiement");

    // optional: clean URL after handling
    if (status || sessionId) {
      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      url.searchParams.delete("session_id");
      router.replace(url.pathname, { scroll: false });
    }
  }, [status, sessionId, router]);

  return <PremiumSubscriptionHub />;
}
