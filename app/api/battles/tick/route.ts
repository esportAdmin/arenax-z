import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runCombatTick, type CombatUnit } from "@/lib/rts/combatEngine";

// ============================================================
// DETERMINISTIC RNG
// ============================================================

function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================================
// MOVEMENT → CURRENT POSITION
// ============================================================

interface MovementLiveRow {
  unit_id: string | null;
  status: string | null;
  started_at: string | null;
  arrival_at: string | null;
  from_lat: number | null;
  from_lng: number | null;
  to_lat: number | null;
  to_lng: number | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function safeNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getMovementCurrentPosition(row: MovementLiveRow): { lng: number; lat: number } | null {
  if (
    row.from_lat == null || row.from_lng == null ||
    row.to_lat == null   || row.to_lng == null   ||
    !row.started_at      || !row.arrival_at
  ) return null;

  const now   = Date.now();
  const start = new Date(row.started_at).getTime();
  const end   = new Date(row.arrival_at).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;

  const ratio = clamp((now - start) / (end - start), 0, 1);
  return {
    lat: row.from_lat + (row.to_lat - row.from_lat) * ratio,
    lng: row.from_lng + (row.to_lng - row.from_lng) * ratio,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const territoryId = String(body?.territoryId ?? "").trim();

    if (!territoryId) {
      return NextResponse.json({ success: false, message: "territoryId is required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: rows, error } = await supabase
      .from("club_units")
      .select(`
        id, club_id, territory_id, hp, max_hp, power, dps,
        crit_chance, accuracy, evasion, skill_type, status, lat, lng,
        armor, magic_resist, threat_bonus, taunt_power, effects,
        current_target_id, casting_ability, cast_started_at, cast_ends_at, cast_start_hp,
        velocity_x, velocity_y, last_target_change_at
      `)
      .eq("territory_id", territoryId);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    const aliveRows = (rows ?? []).filter((row: any) => Number(row.hp ?? 0) > 0);
    const unitIds   = aliveRows.map((row: any) => row.id);

    const movementByUnitId = new Map<string, { lng: number; lat: number }>();

    if (unitIds.length > 0) {
      const { data: movementRows, error: movementError } = await supabase
        .from("unit_movements_live")
        .select("unit_id, status, started_at, arrival_at, from_lat, from_lng, to_lat, to_lng")
        .in("unit_id", unitIds)
        .eq("status", "moving");

      if (movementError) {
        return NextResponse.json({ success: false, message: movementError.message }, { status: 500 });
      }

      for (const movement of (movementRows ?? []) as MovementLiveRow[]) {
        if (!movement.unit_id) continue;
        const current = getMovementCurrentPosition(movement);
        if (!current) continue;
        movementByUnitId.set(movement.unit_id, current);
      }
    }

    const units: CombatUnit[] = aliveRows.map((row: any) => {
      const pos = movementByUnitId.get(row.id);
      return {
        id: row.id, clubId: row.club_id, territoryId: row.territory_id,
        hp: Number(row.hp ?? 100), maxHp: Number(row.max_hp ?? 100),
        power: Number(row.power ?? 10), dps: Number(row.dps ?? 10),
        critChance: Number(row.crit_chance ?? 10), accuracy: Number(row.accuracy ?? 80),
        evasion: Number(row.evasion ?? 10), skillType: row.skill_type ?? "none",
        status: row.status ?? "idle",
        offsetX: Number(pos?.lng ?? row.lng ?? 0),
        offsetY: Number(pos?.lat ?? row.lat ?? 0),
        armor: Number(row.armor ?? 0), magicResist: Number(row.magic_resist ?? 0),
        threatBonus: Number(row.threat_bonus ?? 0), tauntPower: Number(row.taunt_power ?? 0),
        effects: row.effects ?? [],
        currentTargetId: row.current_target_id ?? null,
        castingAbility: row.casting_ability ?? null,
        castStartedAt: row.cast_started_at != null ? Number(row.cast_started_at) : null,
        castEndsAt:    row.cast_ends_at    != null ? Number(row.cast_ends_at)    : null,
        castStartHp:   row.cast_start_hp   != null ? Number(row.cast_start_hp)   : null,
        velocityX: row.velocity_x != null ? Number(row.velocity_x) : 0,
        velocityY: row.velocity_y != null ? Number(row.velocity_y) : 0,
        lastTargetChangeAt: row.last_target_change_at != null ? Number(row.last_target_change_at) : null,
      };
    });

    let aliveUnits = units.filter((u) => u.hp > 0);
    const clubs    = new Set(aliveUnits.map((u) => u.clubId));

    if (aliveUnits.length < 2 || clubs.size <= 1) {
      return NextResponse.json({ success: true, message: "Combat finished", events: [] });
    }

    const { data: lastLog } = await supabase
      .from("battle_logs")
      .select("round")
      .eq("territory_id", territoryId)
      .order("round", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextRound = (lastLog?.round ?? 0) + 1;

    const { data: warRow } = await supabase
      .from("club_wars")
      .select("rng_seed")
      .eq("territory_id", territoryId)
      .maybeSingle();

    const baseSeed = Number(warRow?.rng_seed ?? Date.now());
    const tickSeed = Number(baseSeed + nextRound);
    const rand     = seededRandom(tickSeed);
    const nowMs    = Date.now();
    const serverTs = new Date(nowMs).toISOString();

    // ── Pending abilities (meteor delayed damage) ──
    // FIX G : appliquer les dégâts et filtrer les morts AVANT runCombatTick
    const { data: pendingAbilities } = await supabase
      .from("battle_abilities")
      .select("*")
      .eq("territory_id", territoryId)
      .eq("processed", false)
      .lte("impact_at", serverTs);

    const deadFromPending: string[] = [];

    for (const pending of pendingAbilities ?? []) {
      if (pending.ability === "meteor" && pending.aim_lng != null && pending.aim_lat != null) {
        // Fix 1 : damage lu depuis pending (scalable) plutôt que hardcodé à 24
        const damage = safeNumber(pending.damage, 24);
        const radius = safeNumber(pending.radius, 0.7);
        for (const unit of aliveUnits) {
          const dx = (unit.offsetX ?? 0) - Number(pending.aim_lng);
          const dy = (unit.offsetY ?? 0) - Number(pending.aim_lat);
          if (Math.sqrt(dx * dx + dy * dy) <= radius) {
            unit.hp = Math.max(0, unit.hp - damage);
            if (unit.hp <= 0) deadFromPending.push(unit.id);
          }
        }
      }

      if (pending.ability === "blackhole") {
        // Fix 2 : blackhole persiste un slow côté serveur.
        // Le pull est déjà appliqué côté moteur ce tick — ici on garantit
        // que les unités qui ont survécu gardent le slow entre les ticks.
        const now = nowMs;
        for (const unit of aliveUnits) {
          if (!unit.effects) unit.effects = [];
          const alreadySlow = unit.effects.find((e) => e.type === "slow");
          if (alreadySlow) {
            alreadySlow.expiresAt = Math.max(alreadySlow.expiresAt, now + 900);
            alreadySlow.value     = Math.max(alreadySlow.value, 0.35);
          } else {
            unit.effects.push({ type: "slow", value: 0.35, expiresAt: now + 900 });
          }
        }
      }
      // dash_aoe : effet instantané côté moteur → skip
    }

    if (pendingAbilities?.length) {
      await supabase
        .from("battle_abilities")
        .update({ processed: true })
        .in("id", pendingAbilities.map((a: any) => a.id));
    }

    // FIX G : retirer les unités tuées par meteor avant que le moteur tourne
    if (deadFromPending.length > 0) {
      await supabase.from("club_units").delete().in("id", deadFromPending);
      aliveUnits = aliveUnits.filter((u) => u.hp > 0);
    }

    // ── Danger zones depuis les projectiles en vol ──
    const { data: flyingProjectiles } = await supabase
      .from("battle_projectiles")
      .select("defender_id, projectile_aim_lng, projectile_aim_lat, hit_radius, impact_at, impact_style")
      .eq("territory_id", territoryId)
      .eq("processed", false);

    if (flyingProjectiles?.length) {
      const unitById = new Map(aliveUnits.map((u) => [u.id, u]));
      for (const p of flyingProjectiles) {
        if (!p.projectile_aim_lng || !p.projectile_aim_lat || !p.impact_at) continue;
        const impactAtMs = new Date(p.impact_at).getTime();
        if (impactAtMs <= nowMs) continue;

        const dangerRadius =
          p.impact_style === "explosion" ? 0.55 :
          p.impact_style === "chain"     ? 0.45 :
          safeNumber(p.hit_radius, 0.1) * 4;

        const zone = {
          x: Number(p.projectile_aim_lng), y: Number(p.projectile_aim_lat),
          radius: dangerRadius, expiresAt: impactAtMs,
        };

        const defender = p.defender_id ? unitById.get(p.defender_id) : null;
        for (const unit of aliveUnits) {
          if (defender && unit.clubId !== defender.clubId) continue;
          if (!unit.dangerZones) unit.dangerZones = [];
          unit.dangerZones.push(zone);
        }
      }
    }

    const result = runCombatTick(aliveUnits, rand, nowMs);

    // ── Enrichissement esport : isKill, killStreak, highlight, teamwipe ──
    // Construit une map attackerId → killCount pour détecter les multi-kills.
    const killCountByAttacker = new Map<string, number>();
    const byIdResult          = new Map(result.units.map((u) => [u.id, u]));
    const enemiesStillAliveByClub = new Map<string, number>();

    for (const unit of result.units) {
      if (unit.hp > 0) {
        enemiesStillAliveByClub.set(unit.clubId, (enemiesStillAliveByClub.get(unit.clubId) ?? 0) + 1);
      }
    }

    // Détecte les unités mortes APRÈS ce tick (hp ≤ 0 dans result.units)
    const killedThisTick = new Set(result.deadUnitIds);
    // Unités mortes du meteor pre-pass déjà retirées — on enrichit uniquement tick
    const totalEnemiesAliveAfter = result.units.filter((u) => u.hp > 0).length;
    const totalClubs = new Set(result.units.map((u) => u.clubId)).size;
    const isTeamwipe  = totalEnemiesAliveAfter === 0 || totalClubs <= 1;

    // ── Replay events enrichis (esport metadata) ──
    const replayEvents = result.events.map((event, index) => {
      const defenderAfter = byIdResult.get(event.defenderId);
      const defenderDead  = killedThisTick.has(event.defenderId) || (defenderAfter?.hp ?? 1) <= 0;
      const isKill        = defenderDead && event.result === "hit" && event.damage > 0;

      let killStreak = 0;
      if (isKill) {
        const prev = killCountByAttacker.get(event.attackerId) ?? 0;
        killStreak = prev + 1;
        killCountByAttacker.set(event.attackerId, killStreak);
      }

      // highlight : clutch si le défenseur était à ≤ 15% HP avant l'impact
      const originalUnit = aliveUnits.find((u) => u.id === event.defenderId);
      const wasClutch = !isKill && originalUnit &&
        originalUnit.maxHp > 0 &&
        (originalUnit.hp / originalUnit.maxHp) <= 0.15;

      let highlight: "clutch" | "ace" | "teamwipe" | "ultimate" | undefined;
      if (event.type === "ultimate")                   highlight = "ultimate";
      if (wasClutch && event.damage > 0)               highlight = "clutch";
      if (isKill && totalEnemiesAliveAfter <= 1)       highlight = "ace";
      if (isKill && isTeamwipe)                        highlight = "teamwipe";

      return {
        ...event,
        event_id:   `${territoryId}-${nextRound}-${tickSeed}-${index}`,
        server_ts:  serverTs,
        isKill:     isKill || undefined,
        killStreak: killStreak > 0 ? killStreak : undefined,
        highlight:  highlight,
        esport: {
          tag:        event.replayTag         ?? null,
          type:       event.type              ?? "attack",
          teamFocus:  event.teamFocusTargetId ?? null,
          formation:  event.formationType     ?? null,
          isKill:     isKill || false,
          killStreak: killStreak || 0,
          highlight:  highlight  ?? null,
        },
      };
    });

    const projectiles: any[]    = [];
    const abilityEvents: any[]  = [];
    const unitUpdates: Map<string, {
      hp: number; status: string; effects: CombatUnit["effects"];
      currentTargetId: string | null; castingAbility: string | null;
      castStartedAt: number | null; castEndsAt: number | null; castStartHp: number | null;
      velocityX: number; velocityY: number; lastTargetChangeAt: number | null;
    }> = new Map();

    for (const event of result.events) {
      // ── Projectiles ranged classiques ──
      if (event.rangeType === "ranged" && event.travelMs > 0 && event.type !== "ultimate") {
        const dx = (event.projectileAimLng ?? 0) - (event.projectileStartLng ?? 0);
        const dy = (event.projectileAimLat ?? 0) - (event.projectileStartLat ?? 0);
        projectiles.push({
          territory_id: territoryId,
          attacker_id: event.attackerId, defender_id: event.defenderId,
          damage: event.damage, crit: event.crit,
          projectile_type: event.projectileType ?? null, skill_type: event.skill,
          impact_at: new Date(nowMs + event.travelMs).toISOString(),
          processed: false, result: event.result,
          aoe_radius: event.splashRadius ?? 0, splash_multiplier: event.splashMultiplier ?? 0.5,
          chain_count: event.chainCount ?? 0, chain_damage_multiplier: event.chainDamageMultiplier ?? 0.6,
          impact_style: event.impactStyle ?? "impact", chain_target_ids: event.chainTargetIds ?? [],
          target_priority: event.targetPriority ?? "default", applied_effects: event.appliedEffects ?? [],
          projectile_start_lng: event.projectileStartLng ?? null,
          projectile_start_lat: event.projectileStartLat ?? null,
          projectile_aim_lng:   event.projectileAimLng   ?? null,
          projectile_aim_lat:   event.projectileAimLat   ?? null,
          target_velocity_x:    event.targetVelocityX    ?? 0,
          target_velocity_y:    event.targetVelocityY    ?? 0,
          hit_radius:           event.hitRadius           ?? 0.1,
          travel_ms:            event.travelMs,
          projectile_speed: event.travelMs > 0
            ? (() => { return Math.sqrt(dx * dx + dy * dy) / event.travelMs; })()
            : 0,
        });
      }

      // ── Ultimates + team_call → battle_abilities ──
      if (event.type === "ultimate" || event.type === "team_call") {
        abilityEvents.push({
          territory_id: territoryId,
          attacker_id:  event.attackerId,
          defender_id:  event.defenderId,
          ability:      event.ability,
          type:         event.type,
          replay_tag:   event.replayTag ?? null,
          aim_lng:      event.projectileAimLng ?? null,
          aim_lat:      event.projectileAimLat ?? null,
          radius:       event.splashRadius ?? 0,
          impact_style: event.impactStyle ?? "impact",
          // Vélocité du défenseur au moment du cast — permet l'interpolation
          // FX côté client (trajectoire smooth indépendante du tick rate)
          target_velocity_x: event.targetVelocityX ?? 0,
          target_velocity_y: event.targetVelocityY ?? 0,
          created_at:   serverTs,
          impact_at:    event.travelMs > 0
            ? new Date(nowMs + event.travelMs).toISOString()
            : serverTs,
          processed: false,
        });
      }
    }

    for (const unit of result.units) {
      const original = aliveUnits.find((u) => u.id === unit.id);
      if (!original) continue;

      const hpChanged      = unit.hp !== original.hp;
      const effectsChanged = JSON.stringify(unit.effects ?? []) !== JSON.stringify(original.effects ?? []);
      const castChanged =
        (unit.currentTargetId ?? null) !== (original.currentTargetId ?? null) ||
        (unit.castingAbility  ?? null) !== (original.castingAbility  ?? null) ||
        (unit.castStartedAt   ?? null) !== (original.castStartedAt   ?? null) ||
        (unit.castEndsAt      ?? null) !== (original.castEndsAt      ?? null) ||
        (unit.castStartHp     ?? null) !== (original.castStartHp     ?? null);
      const motionChanged =
        safeNumber(unit.velocityX, 0) !== safeNumber(original.velocityX, 0) ||
        safeNumber(unit.velocityY, 0) !== safeNumber(original.velocityY, 0) ||
        (unit.lastTargetChangeAt ?? null) !== (original.lastTargetChangeAt ?? null);

      const resolvedStatus =
        unit.hp <= 0 ? "dead" :
        ["retreating","kiting","dodging","regrouping"].includes(unit.status) ? unit.status :
        "engaged";

      const statusChanged = resolvedStatus !== (original.status ?? "idle");

      if (hpChanged || statusChanged || effectsChanged || castChanged || motionChanged) {
        unitUpdates.set(unit.id, {
          hp: unit.hp, status: resolvedStatus, effects: unit.effects ?? [],
          currentTargetId: unit.currentTargetId ?? null,
          castingAbility:  unit.castingAbility  ?? null,
          castStartedAt:   unit.castStartedAt   ?? null,
          castEndsAt:      unit.castEndsAt       ?? null,
          castStartHp:     unit.castStartHp      ?? null,
          velocityX: safeNumber(unit.velocityX, 0),
          velocityY: safeNumber(unit.velocityY, 0),
          lastTargetChangeAt: unit.lastTargetChangeAt ?? null,
        });
      }
    }

    if (projectiles.length > 0) {
      const { error: projectileInsertError } = await supabase.from("battle_projectiles").insert(projectiles);
      if (projectileInsertError) {
        return NextResponse.json({ success: false, message: projectileInsertError.message }, { status: 500 });
      }
    }

    if (abilityEvents.length > 0) {
      await supabase.from("battle_abilities").insert(abilityEvents);
    }

    if (unitUpdates.size > 0) {
      await Promise.all(
        Array.from(unitUpdates.entries()).map(([unitId, u]) =>
          supabase.from("club_units").update({
            hp: u.hp, status: u.status, effects: u.effects,
            current_target_id:     u.currentTargetId,
            casting_ability:       u.castingAbility,
            cast_started_at:       u.castStartedAt,
            cast_ends_at:          u.castEndsAt,
            cast_start_hp:         u.castStartHp,
            velocity_x:            u.velocityX,
            velocity_y:            u.velocityY,
            last_target_change_at: u.lastTargetChangeAt,
          }).eq("id", unitId),
        ),
      );
    }

    const deadAfterTick = Array.from(unitUpdates.entries())
      .filter(([, { hp }]) => hp <= 0)
      .map(([unitId]) => unitId);

    if (deadAfterTick.length > 0) {
      await supabase.from("club_units").delete().in("id", deadAfterTick);
    }

    await Promise.all(
      [...clubs].map((clubId) =>
        supabase.rpc("increment_club_energy", { p_club_id: clubId, p_amount: 2 }),
      ),
    );

    await supabase.from("battle_logs").insert({
      territory_id: territoryId,
      round:        nextRound,
      payload:      replayEvents,
      server_ts:    serverTs,
      // Snapshot spatial des unités vivantes APRÈS le tick.
      // Permet au ReplayViewer d'afficher les positions réelles pour chaque round
      // et à la caméra spectateur d'avoir un canvas spatial déterministe.
      units_snapshot: result.units.map((u) => ({
        id:     u.id,
        clubId: u.clubId,
        hp:     u.hp,
        maxHp:  u.maxHp,
        x:      u.offsetX ?? 0,
        y:      u.offsetY ?? 0,
        status: u.status,
      })),
    });

    return NextResponse.json({
      success: true, events: replayEvents,
      deadUnitIds: [...deadFromPending, ...deadAfterTick],
      round: nextRound, projectilesCreated: projectiles.length,
      abilitiesCreated: abilityEvents.length, tickSeed,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
