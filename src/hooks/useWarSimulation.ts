"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  WarViewModel,
  TerritoryDisplay,
  BattleEvent,
  ClubStatsDisplay,
  ClubWar,
} from "@/types/war-aaa";

import {
  fetchActiveWars,
  fetchAllTerritories,
  fetchClubSeasonStats,
  fetchActiveSeason,
  subscribeToActiveWars,
  subscribeToTerritories,
} from "@/lib/supabase-war";

import { addWarContribution } from "@/lib/api/wars";

import {
  toWarViewModel,
  buildTerritoryDisplays,
  computeWarPriority,
} from "@/lib/territories-data";

export function useWarSimulation(userClubId: string | null) {
  const [wars, setWars] = useState<WarViewModel[]>([]);
  const [territories, setTerritories] = useState<TerritoryDisplay[]>([]);
  const [clubStats, setClubStats] = useState<ClubStatsDisplay | null>(null);
  const [events, setEvents] = useState<BattleEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finishedWar, setFinishedWar] = useState<string | null>(null);

  const warsRef = useRef<WarViewModel[]>([]);
  warsRef.current = wars;

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [rawWars, rawTerritories] = await Promise.all([
        fetchActiveWars(),
        fetchAllTerritories(),
      ]);

      const viewModels = rawWars
        .map((w) => toWarViewModel(w))
        .filter(Boolean) as WarViewModel[];

      const displayTerritories = buildTerritoryDisplays(
        rawTerritories,
        viewModels,
      );

      setWars(viewModels);
      setTerritories(displayTerritories);

      if (userClubId) {
        const season = await fetchActiveSeason();

        if (season) {
          const stats = await fetchClubSeasonStats(userClubId, season.id);

          if (stats) {
            const controlledCount = rawTerritories.filter(
              (t) => t.controlling_club_id === userClubId,
            ).length;

            setClubStats({
              clubId: stats.club_id ?? userClubId,
              territoriesControlled: controlledCount,
              totalTerritories: rawTerritories.length,
              globalRank: 0,
              weeklyChange: 0,
              warWins: stats.war_wins ?? 0,
              warLosses: stats.war_losses ?? 0,
              warXp: stats.war_xp ?? 0,
              eloRating: stats.elo_rating ?? 0,
              tier: stats.tier ?? "—",
            });
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
      console.error("🔥 FETCH ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userClubId]);

  useEffect(() => {
    const unsub = subscribeToActiveWars((payload) => {
      const updated = payload.new as ClubWar;

      if (updated.status === "completed") {
        setFinishedWar(updated.id);
        window.setTimeout(() => {
          setFinishedWar((current) =>
            current === updated.id ? null : current,
          );
        }, 1800);
      }

      setWars((prev) =>
        prev.map((w) =>
          w.id === updated.id
            ? {
                ...w,
                ...computeWarPriority(updated),
                raw: updated,
                status: updated.status as any,
              }
            : w,
        ),
      );
    });

    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeToTerritories(fetchAll);
    return unsub;
  }, [fetchAll]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  function appendEvent(evt: BattleEvent) {
    setEvents((prev) => [evt, ...prev.slice(0, 19)]);
  }

  const handleAttack = useCallback(
    async (warId: string) => {
      if (!userClubId || isSubmitting) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const war = warsRef.current.find((w) => w.id === warId);
        if (!war) return;

        const result = await addWarContribution({
          warId,
          clubId: userClubId,
          amount: 10,
        });

        if (!result.success) {
          setError(result.message ?? "Attack failed");
          return;
        }

        await fetchAll();

        appendEvent({
          id: `attack-${Date.now()}`,
          type: "attack",
          icon: "⚔",
          clubId: userClubId,
          clubName: war.attacker?.name ?? "Unknown",
          clubColor: war.attacker?.color ?? "#fff",
          targetName: war.territoryName,
        });
      } catch (err) {
        console.error("Attack error:", err);
        setError("Attack failed");
      } finally {
        window.setTimeout(() => setIsSubmitting(false), 800);
      }
    },
    [userClubId, isSubmitting, fetchAll],
  );

  const handleReinforce = useCallback(
    async (warId: string) => {
      if (!userClubId || isSubmitting) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const war = warsRef.current.find((w) => w.id === warId);
        if (!war) return;

        const result = await addWarContribution({
          warId,
          clubId: war.defender.id,
          amount: 10,
        });

        if (!result.success) {
          setError(result.message ?? "Reinforce failed");
          return;
        }

        await fetchAll();

        appendEvent({
          id: `defend-${Date.now()}`,
          type: "defend",
          icon: "🛡",
          clubId: war.defender.id,
          clubName: war.defender?.name ?? "Unknown",
          clubColor: war.defender?.color ?? "#fff",
          targetName: war.territoryName,
        });
      } catch (err) {
        console.error("Reinforce error:", err);
        setError("Reinforce failed");
      } finally {
        window.setTimeout(() => setIsSubmitting(false), 800);
      }
    },
    [userClubId, isSubmitting, fetchAll],
  );

  return {
    wars,
    territories,
    clubStats,
    events,
    isLoading,
    error,
    isSubmitting,
    finishedWar,
    handleAttack,
    handleReinforce,
    refetch: fetchAll,
  };
}
