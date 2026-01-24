// app/subscription/SubscriptionInner.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container-arena py-10">
        <div className="glass-card p-6">
          <h1 className="font-display font-bold text-xl">Subscription</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gérez votre abonnement ici.
          </p>
        </div>
      </div>
    </div>
  );
}
