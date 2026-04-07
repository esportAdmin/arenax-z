// @ts-nocheck
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// TYPES
// ============================================================

type AbilityName =
  | "global_burst"
  | "global_shield"
  | "mark_priority"
  | "execute_wave"
  | "meteor_zone"
  | "dash_strike"
  | "aura_field";

interface AbilityResult {
  ability: AbilityName;
  affectedUnitIds: string[];
  totalDamage: number;
  event: {
    type: "ability";
    ability: string;
    impactStyle: "explosion" | "impact" | "chain";
    damageKind: "magic" | "physical" | "true";
    /** Délai visuel avant impact (ms) — utilisé par le front pour animer la zone. */
    delayMs?: number;
    /** True si l'ability crée une zone persistante sur la carte. */
    zone?: boolean;
  };
}

// ============================================================
// CONFIG — coûts energy + cooldowns serveur par ability
// ============================================================

const ABILITY_CONFIG: Record<
  AbilityName,
  { energyCost: number; cooldownMs: number }
> = {
  global_burst:  { energyCost: 25, cooldownMs: 5000 },
  global_shield: { energyCost: 20, cooldownMs: 7000 },
  mark_priority: { energyCost: 15, cooldownMs: 6000 },
  execute_wave:  { energyCost: 30, cooldownMs: 6500 },
  meteor_zone:   { energyCost: 40, cooldownMs: 9000 },
  dash_strike:   { energyCost: 20, cooldownMs: 4000 },
  aura_field:    { energyCost: 30, cooldownMs: 8000 },
};

// ============================================================
// HELPERS
// ============================================================

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function mergeEffect(existingEffects: any[], nextEffect: any): any[] {
  const already = existingEffects.find((e) => e.type === nextEffect.type);

  if (!already) return [...existingEffects, nextEffect];

  return existingEffects.map((e) =>
    e.type === nextEffect.type
      ? {
          ...e,
          expiresAt: Math.max(e.expiresAt ?? 0, nextEffect.expiresAt),
          value: Math.max(Number(e.value ?? 0), Number(nextEffect.value ?? 0)),
        }
      : e,
  );
}

// ============================================================
// GARDE SERVEUR — cooldown + energy
// ============================================================

/**
 * Vérifie le cooldown serveur et l'énergie du club.
 * Consomme l'énergie et pose le cooldown si le cast est autorisé.
 * Retourne { error } si bloqué, null si autorisé.
 *
 * Le serveur fait foi : le cooldown client (WorldMap) est purement UX.
 */
async function checkAndConsume(
  supabase: ReturnType<typeof createClient>,
  clubId: string,
  ability: AbilityName,
): Promise<{ error: string } | null> {
  const config = ABILITY_CONFIG[ability];
  const now = new Date();

  // 1. Cooldown serveur
  const { data: cooldownRow } = await supabase
    .from("ability_cooldowns")
    .select("next_available_at")
    .eq("club_id", clubId)
    .eq("ability", ability)
    .maybeSingle();

  if (cooldownRow) {
    const nextAvailable = new Date(cooldownRow.next_available_at);
    if (now < nextAvailable) {
      const remainingMs = nextAvailable.getTime() - now.getTime();
      return {
        error: `Ability on cooldown. Available in ${(remainingMs / 1000).toFixed(1)}s`,
      };
    }
  }

  // 2. Vérification énergie
  const { data: club } = await supabase
    .from("clubs")
    .select("energy, max_energy")
    .eq("id", clubId)
    .maybeSingle();

  if (!club) return { error: "Club not found" };

  const currentEnergy = Number(club.energy ?? 0);
  if (currentEnergy < config.energyCost) {
    return {
      error: `Not enough energy. Required: ${config.energyCost}, available: ${currentEnergy}`,
    };
  }

  // 3. Consommation atomique : énergie + cooldown en parallèle
  const nextAvailableAt = new Date(
    now.getTime() + config.cooldownMs,
  ).toISOString();

  await Promise.all([
    supabase
      .from("clubs")
      .update({ energy: currentEnergy - config.energyCost })
      .eq("id", clubId),

    supabase.from("ability_cooldowns").upsert(
      { club_id: clubId, ability, next_available_at: nextAvailableAt },
      { onConflict: "club_id,ability" },
    ),
  ]);

  return null;
}

// ============================================================
// HANDLERS
// ============================================================

async function handleGlobalBurst(
  supabase: ReturnType<typeof createClient>,
  clubId: string,
  territoryId: string,
): Promise<AbilityResult> {
  const BASE_DAMAGE = 15;

  const { data: rows } = await supabase
    .from("club_units")
    .select("id, hp, magic_resist")
    .eq("territory_id", territoryId)
    .neq("club_id", clubId)
    .gt("hp", 0);

  if (!rows?.length) {
    return {
      ability: "global_burst",
      affectedUnitIds: [],
      totalDamage: 0,
      event: { type: "ability", ability: "arcane_burst", impactStyle: "explosion", damageKind: "magic" },
    };
  }

  let totalDamage = 0;
  const affectedUnitIds: string[] = [];
  const dead: string[] = [];

  const updates = rows.map((unit: any) => {
    const mr = clamp(Number(unit.magic_resist ?? 0), 0, 85);
    const damage = Math.max(1, Math.round(BASE_DAMAGE * (1 - mr / 100)));
    const newHp = Math.max(0, Number(unit.hp) - damage);

    totalDamage += damage;
    affectedUnitIds.push(unit.id);
    if (newHp <= 0) dead.push(unit.id);

    return { id: unit.id, hp: newHp, status: newHp > 0 ? "engaged" : "dead", effects: [] };
  });

  // Batch update via RPC — 1 appel au lieu de N
  await supabase.rpc("batch_update_unit_hp", { updates });

  if (dead.length > 0) {
    await supabase.from("club_units").delete().in("id", dead);
  }

  return {
    ability: "global_burst",
    affectedUnitIds,
    totalDamage,
    event: { type: "ability", ability: "arcane_burst", impactStyle: "explosion", damageKind: "magic" },
  };
}

async function handleGlobalShield(
  supabase: ReturnType<typeof createClient>,
  clubId: string,
  territoryId: string,
): Promise<AbilityResult> {
  const SHIELD_AMOUNT = 30;

  const { data: rows } = await supabase
    .from("club_units")
    .select("id, shield")
    .eq("territory_id", territoryId)
    .eq("club_id", clubId)
    .gt("hp", 0);

  if (!rows?.length) {
    return {
      ability: "global_shield",
      affectedUnitIds: [],
      totalDamage: 0,
      event: { type: "ability", ability: "shield_burst", impactStyle: "impact", damageKind: "true" },
    };
  }

  const affectedUnitIds = rows.map((unit: any) => unit.id);

  // Batch shield : toutes les mises à jour en parallèle en un seul Promise.all
  // (shield est un champ distinct de hp — non couvert par batch_update_unit_hp)
  await Promise.all(
    rows.map((unit: any) =>
      supabase
        .from("club_units")
        .update({ shield: Number(unit.shield ?? 0) + SHIELD_AMOUNT })
        .eq("id", unit.id),
    ),
  );

  return {
    ability: "global_shield",
    affectedUnitIds,
    totalDamage: 0,
    event: { type: "ability", ability: "shield_burst", impactStyle: "impact", damageKind: "true" },
  };
}

async function handleMarkPriority(
  supabase: ReturnType<typeof createClient>,
  clubId: string,
  territoryId: string,
): Promise<AbilityResult> {
  const now = Date.now();
  const markEffect = { type: "mark", value: 0.35, expiresAt: now + 3500 };

  const { data: rows } = await supabase
    .from("club_units")
    .select("id, hp, effects, dps")
    .eq("territory_id", territoryId)
    .neq("club_id", clubId)
    .gt("hp", 0);

  if (!rows?.length) {
    return {
      ability: "mark_priority",
      affectedUnitIds: [],
      totalDamage: 0,
      event: { type: "ability", ability: "chain_lightning", impactStyle: "chain", damageKind: "magic" },
    };
  }

  const targets = [...rows]
    .sort((a: any, b: any) => Number(b.dps ?? 0) - Number(a.dps ?? 0))
    .slice(0, 3);

  const affectedUnitIds: string[] = [];

  await Promise.all(
    targets.map((unit: any) => {
      affectedUnitIds.push(unit.id);
      const nextEffects = mergeEffect(unit.effects ?? [], markEffect);
      return supabase
        .from("club_units")
        .update({ effects: nextEffects })
        .eq("id", unit.id);
    }),
  );

  return {
    ability: "mark_priority",
    affectedUnitIds,
    totalDamage: 0,
    event: { type: "ability", ability: "chain_lightning", impactStyle: "chain", damageKind: "magic" },
  };
}

async function handleExecuteWave(
  supabase: ReturnType<typeof createClient>,
  clubId: string,
  territoryId: string,
): Promise<AbilityResult> {
  const EXECUTE_DAMAGE = 22;

  const { data: rows } = await supabase
    .from("club_units")
    .select("id, hp, max_hp, armor")
    .eq("territory_id", territoryId)
    .neq("club_id", clubId)
    .gt("hp", 0);

  if (!rows?.length) {
    return {
      ability: "execute_wave",
      affectedUnitIds: [],
      totalDamage: 0,
      event: { type: "ability", ability: "execute", impactStyle: "impact", damageKind: "physical" },
    };
  }

  const lowHpTargets = rows.filter(
    (unit: any) =>
      Number(unit.max_hp ?? 1) > 0 &&
      Number(unit.hp) / Number(unit.max_hp) <= 0.45,
  );

  let totalDamage = 0;
  const affectedUnitIds: string[] = [];
  const dead: string[] = [];

  const updates = lowHpTargets.map((unit: any) => {
    const armor = clamp(Number(unit.armor ?? 0), 0, 85);
    const damage = Math.max(1, Math.round(EXECUTE_DAMAGE * (1 - armor / 100)));
    const newHp = Math.max(0, Number(unit.hp) - damage);

    totalDamage += damage;
    affectedUnitIds.push(unit.id);
    if (newHp <= 0) dead.push(unit.id);

    return { id: unit.id, hp: newHp, status: newHp > 0 ? "engaged" : "dead", effects: [] };
  });

  if (updates.length > 0) {
    await supabase.rpc("batch_update_unit_hp", { updates });
  }

  if (dead.length > 0) {
    await supabase.from("club_units").delete().in("id", dead);
  }

  return {
    ability: "execute_wave",
    affectedUnitIds,
    totalDamage,
    event: { type: "ability", ability: "execute", impactStyle: "impact", damageKind: "physical" },
  };
}

// ============================================================
// HANDLER — METEOR ZONE
// Frappe magique de zone avec délai (le front anime la zone pendant delayMs).
// Applique des dégâts à TOUS les ennemis dans le territoire après le délai.
// Le delayMs est informatif pour le front — les dégâts sont appliqués immédiatement
// côté serveur (autorité serveur).
// ============================================================

async function handleMeteorZone(
  supabase: ReturnType<typeof createClient>,
  clubId: string,
  territoryId: string,
): Promise<AbilityResult> {
  const METEOR_DAMAGE = 20;

  const { data: rows } = await supabase
    .from("club_units")
    .select("id, hp, magic_resist")
    .eq("territory_id", territoryId)
    .neq("club_id", clubId)
    .gt("hp", 0);

  if (!rows?.length) {
    return {
      ability: "meteor_zone",
      affectedUnitIds: [],
      totalDamage: 0,
      event: { type: "ability", ability: "meteor", impactStyle: "explosion", damageKind: "magic", delayMs: 1200, zone: true },
    };
  }

  let totalDamage = 0;
  const affectedUnitIds: string[] = [];
  const dead: string[] = [];

  const updates = rows.map((unit: any) => {
    const mr     = clamp(Number(unit.magic_resist ?? 0), 0, 85);
    const damage = Math.max(1, Math.round(METEOR_DAMAGE * (1 - mr / 100)));
    const newHp  = Math.max(0, Number(unit.hp) - damage);

    totalDamage += damage;
    affectedUnitIds.push(unit.id);
    if (newHp <= 0) dead.push(unit.id);

    return { id: unit.id, hp: newHp, status: newHp > 0 ? "engaged" : "dead", effects: [] };
  });

  await supabase.rpc("batch_update_unit_hp", { updates });

  if (dead.length > 0) {
    await supabase.from("club_units").delete().in("id", dead);
  }

  return {
    ability: "meteor_zone",
    affectedUnitIds,
    totalDamage,
    event: { type: "ability", ability: "meteor", impactStyle: "explosion", damageKind: "magic", delayMs: 1200, zone: true },
  };
}

// ============================================================
// HANDLER — DASH STRIKE
// Charge physique sur l'ennemi le plus faible (HP le plus bas).
// Dégâts physiques + application d'un stun court.
// ============================================================

async function handleDashStrike(
  supabase: ReturnType<typeof createClient>,
  clubId: string,
  territoryId: string,
): Promise<AbilityResult> {
  const DASH_DAMAGE = 18;
  const now = Date.now();

  const { data: rows } = await supabase
    .from("club_units")
    .select("id, hp, max_hp, armor, effects")
    .eq("territory_id", territoryId)
    .neq("club_id", clubId)
    .gt("hp", 0)
    .order("hp", { ascending: true })
    .limit(1);

  if (!rows?.length) {
    return {
      ability: "dash_strike",
      affectedUnitIds: [],
      totalDamage: 0,
      event: { type: "ability", ability: "dash", impactStyle: "impact", damageKind: "physical" },
    };
  }

  const target = rows[0] as any;
  const armor  = clamp(Number(target.armor ?? 0), 0, 85);
  const damage = Math.max(1, Math.round(DASH_DAMAGE * (1 - armor / 100)));
  const newHp  = Math.max(0, Number(target.hp) - damage);

  // Applique stun court (500ms) — effect existant dans le moteur
  const stunEffect = { type: "stun", value: 1, expiresAt: now + 500 };
  const nextEffects = mergeEffect(target.effects ?? [], stunEffect);

  await supabase
    .from("club_units")
    .update({
      hp:     newHp,
      status: newHp > 0 ? "engaged" : "dead",
      effects: nextEffects,
    })
    .eq("id", target.id);

  if (newHp <= 0) {
    await supabase.from("club_units").delete().eq("id", target.id);
  }

  return {
    ability: "dash_strike",
    affectedUnitIds: [target.id],
    totalDamage: damage,
    event: { type: "ability", ability: "dash", impactStyle: "impact", damageKind: "physical" },
  };
}

// ============================================================
// HANDLER — AURA FIELD
// Affaiblit tous les ennemis avec un weaken (−20% dégâts, 4s).
// Effect "weaken" existant dans le moteur — pas de nouveau type à créer.
// ============================================================

async function handleAuraField(
  supabase: ReturnType<typeof createClient>,
  clubId: string,
  territoryId: string,
): Promise<AbilityResult> {
  const now = Date.now();
  const weakenEffect = { type: "weaken", value: 0.2, expiresAt: now + 4000 };

  const { data: rows } = await supabase
    .from("club_units")
    .select("id, effects")
    .eq("territory_id", territoryId)
    .neq("club_id", clubId)
    .gt("hp", 0);

  if (!rows?.length) {
    return {
      ability: "aura_field",
      affectedUnitIds: [],
      totalDamage: 0,
      event: { type: "ability", ability: "aura", impactStyle: "impact", damageKind: "true" },
    };
  }

  const affectedUnitIds: string[] = [];

  await Promise.all(
    rows.map((unit: any) => {
      affectedUnitIds.push(unit.id);
      const nextEffects = mergeEffect(unit.effects ?? [], weakenEffect);
      return supabase
        .from("club_units")
        .update({ effects: nextEffects })
        .eq("id", unit.id);
    }),
  );

  return {
    ability: "aura_field",
    affectedUnitIds,
    totalDamage: 0,
    event: { type: "ability", ability: "aura", impactStyle: "impact", damageKind: "true" },
  };
}

// ============================================================
// HANDLER PRINCIPAL
// ============================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const ability    = String(body?.ability ?? "").trim() as AbilityName;
    const clubId     = String(body?.clubId ?? "").trim();
    const territoryId = String(body?.territoryId ?? "").trim();

    if (!ability) {
      return NextResponse.json(
        { success: false, message: "ability is required" },
        { status: 400 },
      );
    }

    if (!clubId || !territoryId) {
      return NextResponse.json(
        { success: false, message: "clubId and territoryId are required" },
        { status: 400 },
      );
    }

    if (!ABILITY_CONFIG[ability]) {
      return NextResponse.json(
        { success: false, message: `Unknown ability: ${ability}` },
        { status: 400 },
      );
    }

    const supabase: ReturnType<typeof createClient<any>> = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // ── Garde serveur : cooldown + energy (non bypassable côté client) ──
    const guardError = await checkAndConsume(supabase, clubId, ability);
    if (guardError) {
      return NextResponse.json(
        { success: false, message: guardError.error },
        { status: 429 },
      );
    }

    let result: AbilityResult;

    switch (ability) {
      case "global_burst":
        result = await handleGlobalBurst(supabase, clubId, territoryId);
        break;
      case "global_shield":
        result = await handleGlobalShield(supabase, clubId, territoryId);
        break;
      case "mark_priority":
        result = await handleMarkPriority(supabase, clubId, territoryId);
        break;
      case "execute_wave":
        result = await handleExecuteWave(supabase, clubId, territoryId);
        break;
      case "meteor_zone":
        result = await handleMeteorZone(supabase, clubId, territoryId);
        break;
      case "dash_strike":
        result = await handleDashStrike(supabase, clubId, territoryId);
        break;
      case "aura_field":
        result = await handleAuraField(supabase, clubId, territoryId);
        break;
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
