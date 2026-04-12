// app/subscription/SubscriptionInner.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import PremiumSubscriptionHub from "@/components/subscription/PremiumSubscriptionHub";

export default function SubscriptionInner() {
  const params = useSearchParams();
  const router = useRouter();

  const status = useMemo(() => params.get("status"), [params]);
  const sessionId = useMemo(() => params.get("session_id"), [params]);

  useEffect(() => {
    if (status === "success") toast.success("Subscription activated");
    if (status === "canceled") toast.error("Payment canceled");
    if (status === "error") toast.error("Payment error");

    if (status || sessionId) {
      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      url.searchParams.delete("session_id");
      router.replace(url.pathname, { scroll: false });
    }
  }, [status, sessionId, router]);

  return <PremiumSubscriptionHub />;
}
