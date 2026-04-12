"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { StatusEffect } from "@/lib/rts/combatEngine";

export interface ArmyUnitLive {
  unit_id: string;
  club_id: string;
  club_name?: string;
  territory_id: string | null;
  territory_name?: string | null;

  lat: number | null;
  lng: number | null;

  unit_type?: string;
  power: number;
  speed: number;

  hp: number;
  max_hp: number;

  dps?: number;
  crit_chance: number;
  skill_type?: string | null;
  vision_radius: number;
  status?: string;

  club_color?: string;

  accuracy?: number;
  evasion?: number;
  armor?: number;
  magic_resist?: number;
  threat_bonus?: number;
  taunt_power?: number;

  /** Effets de statut actifs (burn, slow, mark, stun, weaken). */
  effects?: StatusEffect[];
}

interface ArmyUnitRow {
  unit_id: string;
  club_id: string;
  club_name: string | null;
  territory_id: string | null;
  territory_name: string | null;

  lat: number | null;
  lng: number | null;

  unit_type: string | null;
  power: number | null;
  speed: number | null;

  hp: number | null;
  max_hp: number | null;

  dps: number | null;
  crit_chance: number | null;
  skill_type: string | null;
  vision_radius: number | null;
  status: string | null;

  club_color: string | null;

  accuracy: number | null;
  evasion: number | null;
  armor: number | null;
  magic_resist: number | null;
  threat_bonus: number | null;
  taunt_power: number | null;

  /** Colonne JSONB `effects` de `club_units`. */
  effects: StatusEffect[] | null;
}

export function useArmyUnitsLive() {
  const [units, setUnits] = useState<ArmyUnitLive[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data, error } = await (supabase as any).from("army_units_live")
        .select(`
          unit_id,
          club_id,
          club_name,
          territory_id,
          territory_name,
          lat,
          lng,
          unit_type,
          power,
          speed,
          hp,
          max_hp,
          dps,
          crit_chance,
          skill_type,
          vision_radius,
          status,
          club_color,
          accuracy,
          evasion,
          armor,
          magic_resist,
          threat_bonus,
          taunt_power,
          effects
        `);

      if (!mounted) return;

      if (error) {
        console.error("[useArmyUnitsLive]", error);
        setUnits([]);
        return;
      }

      if (!data) {
        setUnits([]);
        return;
      }

      const mapped: ArmyUnitLive[] = (data as unknown as ArmyUnitRow[]).map(
        (row) => ({
          unit_id: row.unit_id,
          club_id: row.club_id,
          club_name: row.club_name ?? undefined,
          territory_id: row.territory_id ?? null,
          territory_name: row.territory_name ?? null,

          lat: row.lat ?? null,
          lng: row.lng ?? null,

          unit_type: row.unit_type ?? "infantry",
          power: Number(row.power ?? 0),
          speed: Number(row.speed ?? 1),

          hp: Number(row.hp ?? 100),
          max_hp: Number(row.max_hp ?? 100),

          dps: Number(row.dps ?? 0),
          crit_chance: Number(row.crit_chance ?? 0),
          skill_type: row.skill_type ?? null,
          vision_radius: Number(row.vision_radius ?? 1),
          status: row.status ?? "idle",

          club_color: row.club_color ?? undefined,

          accuracy: Number(row.accuracy ?? 80),
          evasion: Number(row.evasion ?? 10),
          armor: Number(row.armor ?? 0),
          magic_resist: Number(row.magic_resist ?? 0),
          threat_bonus: Number(row.threat_bonus ?? 0),
          taunt_power: Number(row.taunt_power ?? 0),

          effects: row.effects ?? [],
        }),
      );

      setUnits(mapped);
    }

    load();

    const channel = supabase
      .channel("army-units-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "club_units",
        },
        load,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "club_territories",
        },
        load,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clubs",
        },
        load,
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { units };
}
