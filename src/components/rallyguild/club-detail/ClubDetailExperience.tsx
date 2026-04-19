"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ClubActivationPanels } from "@/components/rallyguild/club-detail/ClubActivationPanels";
import { ClubDetailHero } from "@/components/rallyguild/club-detail/ClubDetailHero";
import { ClubLaunchSequence } from "@/components/rallyguild/club-detail/ClubLaunchSequence";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useClubDetail } from "@/hooks/useClubDetail";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface ClubDetailExperienceProps {
  slug: string;
}

/**
 * Orchestrates the club command center with live data, actions, and route
 * transitions while keeping the visual sections split into focused files.
 */
export function ClubDetailExperience({ slug }: ClubDetailExperienceProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { club, members, myMembership, activeWar, loading, refresh } =
    useClubDetail(slug);

  const [joining, setJoining] = useState(false);
  const [creatingWar, setCreatingWar] = useState(false);

  const isAdmin =
    myMembership?.role === "owner" || myMembership?.role === "admin";

  const callAccuracy =
    club && club.total_predictions > 0
      ? Math.round((club.total_wins / club.total_predictions) * 100)
      : 0;

  /**
   * Sends a join request through the existing Supabase RPC and refreshes the
   * local club state after a successful request.
   */
  async function handleJoin() {
    if (!club) return;

    setJoining(true);
    const { data, error } = await (supabase as any).rpc("create_join_request", {
      p_club_id: club.id,
      p_message: null,
    });
    setJoining(false);

    if (error || !data?.success) {
      toast({
        title: "Request failed",
        description: error?.message || data?.error || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request sent",
      description: "Your club access request is now with the staff.",
    });
    refresh();
  }

  /**
   * Starts the first rivalry loop for admins using the existing server route.
   */
  async function handleCreateWar() {
    if (!club) return;

    setCreatingWar(true);
    try {
      const res = await fetch("/api/wars/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clubId: club.id }),
      });
      const data = await res.json();

      if (!data.success) {
        toast({
          title: "War creation failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "War room online",
        description: "Your club now has an active rivalry loop.",
      });
      refresh();
    } catch {
      toast({
        title: "Unexpected error",
        description: "The command center could not start the war.",
        variant: "destructive",
      });
    } finally {
      setCreatingWar(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-background text-white">
        <Navbar />
        <main className="container-arena flex min-h-[60vh] flex-col items-center justify-center pt-24 text-center">
          <p className="eyebrow-badge mb-4 border-rose-300/25 bg-rose-400/10 text-rose-200">
            Club offline
          </p>
          <h1 className="font-display text-4xl font-black">Club not found</h1>
          <Button className="mt-6" onClick={() => router.push("/clubs")}>
            Back to clubs
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />
      <main className="relative overflow-hidden pb-16 pt-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:42px_42px]" />
          <div className="absolute left-[-12rem] top-20 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-[150px]" />
          <div className="absolute right-[-10rem] top-48 h-[30rem] w-[30rem] rounded-full bg-blue-500/10 blur-[150px]" />
          <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-amber-500/8 blur-[140px]" />
        </div>

        <div className="container-arena relative z-10">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => router.push("/clubs")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to clubs
          </Button>

          <ClubDetailHero
            club={club}
            creatingWar={creatingWar}
            isAdmin={isAdmin}
            isAuthenticated={Boolean(user)}
            joining={joining}
            myMembership={myMembership}
            onCreateWar={handleCreateWar}
            onJoin={handleJoin}
            onNavigate={router.push}
          />

          <ClubLaunchSequence
            callAccuracy={callAccuracy}
            hasActiveWar={Boolean(activeWar)}
            membersCount={members.length}
            onNavigate={router.push}
          />

          <ClubActivationPanels
            activeWar={activeWar}
            callAccuracy={callAccuracy}
            club={club}
            members={members}
            onNavigate={router.push}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
