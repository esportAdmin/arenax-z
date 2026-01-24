// app/subscription/page.tsx
"use client";

import { Suspense } from "react";
import SubscriptionInner from "./SubscriptionInner";

export default function Page() {
  return (
    <Suspense fallback={<SubscriptionSkeleton />}>
      <SubscriptionInner />
    </Suspense>
  );
}

function SubscriptionSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-arena py-10">
        <div className="glass-card p-6">
          <div className="h-6 w-40 rounded bg-muted/40 animate-pulse" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-3/4 rounded bg-muted/40 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-muted/40 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-muted/40 animate-pulse" />
          </div>
          <div className="mt-6 h-10 w-40 rounded bg-muted/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
