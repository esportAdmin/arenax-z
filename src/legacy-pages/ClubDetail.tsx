"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Target,
  TrendingUp,
  Trophy,
  UserPlus,
  Loader2,
  Swords,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useClubDetail } from "@/hooks/useClubDetail";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WarCard } from "@/components/clubs/WarCard";

interface Props {
  slug: string;
}

export default function ClubDetail({ slug }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const { club, members, myMembership, activeWar, loading, refresh } =
    useClubDetail(slug);

  const [joining, setJoining] = useState(false);
  const [creatingWar, setCreatingWar] = useState(false);

  /* =========================
     ADMIN CHECK (SAFE)
  ========================= */

  const isAdmin =
    myMembership?.role === "owner" || myMembership?.role === "admin";

  /* =========================
     DEBUG LOGS
  ========================= */

  useEffect(() => {
    console.log("USER:", user?.id);
    console.log("MY MEMBERSHIP:", myMembership);
    console.log("IS ADMIN:", isAdmin);
  }, [user, myMembership, isAdmin]);

  /* =========================
     ACCURACY
  ========================= */

  const callAccuracy = useMemo(() => {
    if (!club) return 0;
    if (club.total_predictions <= 0) return 0;
    return Math.round((club.total_wins / club.total_predictions) * 100);
  }, [club]);

  /* =========================
     JOIN CLUB
  ========================= */

  const handleJoin = async () => {
    if (!club) return;

    setJoining(true);

    const { data, error } = await (supabase as any).rpc("create_join_request", {
      p_club_id: club.id,
      p_message: null,
    });

    setJoining(false);

    if (error || !data?.success) {
      toast({
        title: "Error",
        description: error?.message || data?.error || "Unknown error",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Request sent",
      description: "Your join request has been sent.",
    });

    refresh();
  };

  /* =========================
     CREATE WAR
  ========================= */

  const handleCreateWar = async () => {
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
        title: "⚔️ War started!",
        description: "Your club is now in battle.",
      });

      refresh();
    } catch {
      toast({
        title: "Error",
        description: "Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setCreatingWar(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 text-center">
          <h2>Club not found</h2>
        </main>
        <Footer />
      </div>
    );
  }

  /* =========================
     PAGE
  ========================= */

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-arena">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => router.push("/clubs")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to clubs
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {club.name.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">{club.name}</h1>

                <p className="text-muted-foreground">
                  {club.description || "No description"}
                </p>
              </div>

              {user && !myMembership && (
                <Button
                  onClick={handleJoin}
                  disabled={joining}
                  className="gap-2"
                >
                  {joining ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  Join
                </Button>
              )}

              {isAdmin && !activeWar && (
                <Button
                  onClick={handleCreateWar}
                  disabled={creatingWar}
                  className="gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  {creatingWar ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Swords className="w-4 h-4" />
                  )}
                  Start War
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
              <div className="text-center">
                <Zap className="w-5 h-5 mx-auto text-primary mb-1" />
                <div className="text-xl font-bold">
                  {club.total_xp?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-muted-foreground">XP</div>
              </div>

              <div className="text-center">
                <Target className="w-5 h-5 mx-auto mb-1" />
                <div className="text-xl font-bold">
                  {club.total_predictions}
                </div>
                <div className="text-xs text-muted-foreground">Live Calls</div>
              </div>

              <div className="text-center">
                <Trophy className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                <div className="text-xl font-bold">{club.total_wins}</div>
                <div className="text-xs text-muted-foreground">Wins</div>
              </div>

              <div className="text-center">
                <TrendingUp className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
                <div className="text-xl font-bold">{callAccuracy}%</div>
                <div className="text-xs text-muted-foreground">Read Rate</div>
              </div>
            </div>
          </motion.div>

          {activeWar && (
            <WarCard war={activeWar} clubId={club.id} members={members} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
