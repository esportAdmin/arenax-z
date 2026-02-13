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
    <div className="min-h-screen bg-[#0A0B14] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_25%_18%,rgba(0,240,255,0.14),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_75%_20%,rgba(168,85,247,0.14),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_60%_85%,rgba(255,30,70,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
      </div>

      <div className="container-arena py-14">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
          <div className="h-5 w-40 rounded bg-white/10 animate-pulse" />
          <div className="mt-6 space-y-3">
            <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
          </div>
          <div className="mt-8 h-11 w-44 rounded-full bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
