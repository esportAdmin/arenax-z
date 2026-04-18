"use client";

/**
 * app/play/page.tsx
 * Post-onboarding pivot route.
 * Renders the community rally launchpad for authenticated operators.
 * Referenced by: OnboardingFlow.tsx, middleware.ts, emailService.ts
 */

import { QueueScreen } from "@/components/queue/QueueScreen";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/landing/Navigation";

export default function PlayPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050816] text-white">
        <Navigation />
        <div className="flex min-h-screen items-center justify-center px-4 pt-20">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-[#0a0f1e]/90 p-8 text-center backdrop-blur-xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Rally access
            </div>
            <h1 className="mt-4 text-3xl font-display font-black text-white">
              Reconnect to launch a rally session
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              ArenaX-Z keeps this surface tied to your active session so your
              club identity, live calls, and command context stay trustworthy.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <Link href="/login">Continue with Discord</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">Return to dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <QueueScreen userId={user.id} queueType="casual" />;
}
