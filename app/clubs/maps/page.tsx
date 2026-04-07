"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { useGlobalWarMap, Territory } from "@/hooks/useGlobalWarMap";
import WorldMapSvg from "@/components/map/WorldMapSvg";
import { TerritoryDetailsPanel } from "@/components/map/TerritoryDetailsPanel";

import { supabase } from "@/integrations/supabase/client";

export default function ClubsMapPage() {
  const { territories, loading } = useGlobalWarMap();
  const { user } = useAuth();
  const { toast } = useToast();

  const [selected, setSelected] = useState<Territory | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);

  /* =========================
     GET USER CLUB
  ========================= */

  useEffect(() => {
    async function loadClub() {
      if (!user) return;

      const { data } = await supabase
        .from("club_members")
        .select("club_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setClubId(data?.club_id ?? null);
    }

    loadClub();
  }, [user]);

  /* =========================
     INVASION
  ========================= */

  async function handleInvade(territory: Territory) {
    if (!clubId) {
      toast({
        title: "No club",
        description: "You must be in a club to invade.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("/api/territories/invade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clubId,
          territoryId: territory.id,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast({
          title: "Invasion failed",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "⚔ War started",
        description: `Battle for ${territory.name} has begun`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Unexpected error",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container-arena">
          <h1 className="text-3xl font-bold mb-6">Global War Map</h1>

          {loading ? (
            <div className="glass-card p-6">Loading map...</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <WorldMapSvg
                territories={territories}
                onSelect={setSelected}
              />

              <TerritoryDetailsPanel
                territory={selected}
                clubId={clubId ?? undefined}
                canAttack
                onInvade={handleInvade}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
