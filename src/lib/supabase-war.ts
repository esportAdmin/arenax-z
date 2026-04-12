import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import type {
  ClubWar,
  Club,
  ClubTerritory,
  ClubSeasonStats,
} from "@/types/war-aaa";

const uuidSchema = z.string().uuid();

export async function fetchActiveWars(): Promise<
  (ClubWar & {
    challenger: Club;
    defender: Club;
    territory: (ClubTerritory & { controlling_club: Club | null }) | null;
  })[]
> {
  const { data, error } = await supabase
    .from("club_wars")
    .select(
      `
      id,
      challenger_id,
      defender_id,
      winner_id,
      status,
      start_date,
      end_date,
      territory_id,
      season_id,
      challenger_xp,
      defender_xp,
      challenger_predictions,
      defender_predictions,
      challenger_wins,
      defender_wins,
      xp_reward,
      created_at,
      updated_at,
      challenger:clubs!club_wars_challenger_id_fkey (
        id, name, slug, logo_url
      ),
      defender:clubs!club_wars_defender_id_fkey (
        id, name, slug, logo_url
      ),
      territory:club_territories!club_wars_territory_id_fkey (
        id,
        name,
        slug,
        region,
        continent,
        controlling_club_id,
        is_capital,
        map_key,
        map_x,
        map_y,
        x,
        y,
        capture_progress,
        siege_progress,
        strategic_value,
        xp_bonus,
        arena_bonus,
        prestige_bonus,
        created_at,
        updated_at,
        controlling_club:clubs!club_territories_controlling_club_id_fkey (
          id, name, slug, logo_url
        )
      )
    `,
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchActiveWars]", error);
    throw new Error("Failed to fetch active wars");
  }

  return (data ?? []) as unknown as (ClubWar & {
    challenger: Club;
    defender: Club;
    territory: (ClubTerritory & { controlling_club: Club | null }) | null;
  })[];
}

export async function fetchAllTerritories(): Promise<
  (ClubTerritory & { controlling_club: Club | null })[]
> {
  const { data, error } = await supabase
    .from("club_territories")
    .select(
      `
      id,
      name,
      slug,
      region,
      continent,
      controlling_club_id,
      is_capital,
      map_key,
      map_x,
      map_y,
      x,
      y,
      capture_progress,
      siege_progress,
      strategic_value,
      xp_bonus,
      arena_bonus,
      prestige_bonus,
      created_at,
      updated_at,
      controlling_club:clubs!club_territories_controlling_club_id_fkey (
        id, name, slug, logo_url
      )
    `,
    )
    .order("name");

  if (error) {
    console.error("[fetchAllTerritories]", error);
    throw new Error("Failed to fetch territories");
  }

  return (data ?? []) as unknown as (ClubTerritory & {
    controlling_club: Club | null;
  })[];
}

export async function getActiveSeason() {
  const { data, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getActiveSeason]", error);
    throw new Error("Failed to fetch active season");
  }

  return data;
}

export const fetchActiveSeason = getActiveSeason;

export async function fetchClubSeasonStats(
  clubId: string,
  seasonId: string,
): Promise<ClubSeasonStats | null> {
  if (!uuidSchema.safeParse(clubId).success) {
    throw new Error("Invalid clubId");
  }

  if (!uuidSchema.safeParse(seasonId).success) {
    throw new Error("Invalid seasonId");
  }

  const { data, error } = await supabase
    .from("club_season_stats")
    .select("*")
    .eq("club_id", clubId)
    .eq("season_id", seasonId)
    .maybeSingle();

  if (error) {
    console.error("[fetchClubSeasonStats]", error);
    throw new Error("Failed to fetch club season stats");
  }

  return data as ClubSeasonStats | null;
}

export function subscribeToActiveWars(
  onUpdate: (payload: { new: ClubWar; old: Partial<ClubWar> }) => void,
): () => void {
  const channel = supabase
    .channel("club_wars_changes")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "club_wars",
      },
      onUpdate as any,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToTerritories(
  onUpdate: (payload: { new: ClubTerritory }) => void,
): () => void {
  const channel = supabase
    .channel("club_territories_changes")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "club_territories",
      },
      onUpdate as any,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
