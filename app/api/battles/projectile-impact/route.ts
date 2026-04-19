import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { recordTick } from "@/lib/rts/engineMetrics";

// ============================================================
// TYPES
// ============================================================

type UnitRow = {
  id: string;
  club_id: string | null;
  territory_id: string | null;
  hp: number | null;
  shield: number | null;
  max_shield?: number | null;
  lat: number | null;
  lng: number | null;
  effects?: any[] | null;
};

// ============================================================
// HELPERS — MATHS
// ============================================================

function safeNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function distance(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const dx = aLng - bLng;
  const dy = aLat - bLat;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Distance d'un point P au segment AB.
 * Retourne la distance minimale, le paramètre t ∈ [0,1] sur le segment
 * et le point le plus proche (closestX, closestY).
 *
 * t = 0 → P est plus proche de A.
 * t = 1 → P est plus proche de B.
 * Plus t est petit, plus l'interception est tôt sur la trajectoire.
 */
function pointToSegmentDistance(params: {
  px: number; py: number;
  ax: number; ay: number;
  bx: number; by: number;
}) {
  const { px, py, ax, ay, bx, by } = params;
  const abx = bx - ax;
  const aby = by - ay;
  const apx = px - ax;
  const apy = py - ay;
  const abLenSq = abx * abx + aby * aby;

  if (abLenSq <= 0.0000001) {
    const dx = px - ax;
    const dy = py - ay;
    return { distance: Math.sqrt(dx * dx + dy * dy), t: 0, closestX: ax, closestY: ay };
  }

  const rawT   = (apx * abx + apy * aby) / abLenSq;
  const t      = Math.max(0, Math.min(1, rawT));
  const closestX = ax + abx * t;
  const closestY = ay + aby * t;
  const dx = px - closestX;
  const dy = py - closestY;

  return { distance: Math.sqrt(dx * dx + dy * dy), t, closestX, closestY };
}

function applyShieldAndDamage(params: { hp: number; shield: number; damage: number }) {
  let damageLeft = safeNumber(params.damage, 0);
  let shield     = safeNumber(params.shield, 0);
  let hp         = safeNumber(params.hp, 0);

  if (shield > 0 && damageLeft > 0) {
    const absorbed = Math.min(shield, damageLeft);
    shield     -= absorbed;
    damageLeft -= absorbed;
  }

  if (damageLeft > 0) hp = Math.max(0, hp - damageLeft);
  return { hp, shield };
}

function mergeEffects(existingEffects: any[], incomingEffects: any[]): any[] {
  const merged = [...(existingEffects ?? [])];
  for (const incoming of incomingEffects ?? []) {
    const existing = merged.find((e) => e.type === incoming.type);
    if (existing) {
      existing.expiresAt = Math.max(safeNumber(existing.expiresAt, 0), safeNumber(incoming.expiresAt, 0));
      existing.value     = Math.max(safeNumber(existing.value, 0),     safeNumber(incoming.value, 0));
    } else {
      merged.push(incoming);
    }
  }
  return merged;
}

function isUnitAlive(unit: UnitRow | null | undefined): unit is UnitRow {
  return !!unit && safeNumber(unit.hp, 0) > 0;
}

/**
 * Vérifie si un projectile (segment start→aim) touche une unité à (unitLat, unitLng).
 *
 * La collision est validée de deux façons complémentaires :
 * 1. Distance au SEGMENT start→aim ≤ hitRadius — touche la trajectoire
 * 2. Distance au point AIM ≤ hitRadius — touche la zone d'impact finale
 *
 * progress = t ∈ [0,1] indique où sur la trajectoire l'interception se produit.
 * Utilisé pour trier les candidats : la première unité sur la trajectoire est touchée.
 */
function isProjectileCollision(params: {
  unitLat:    number; unitLng: number;
  startLat:   number; startLng: number;
  aimLat:     number; aimLng:  number;
  hitRadius:  number;
}) {
  const segment = pointToSegmentDistance({
    px: params.unitLng, py: params.unitLat,
    ax: params.startLng, ay: params.startLat,
    bx: params.aimLng,  by: params.aimLat,
  });

  const endpointDistance = distance(params.unitLat, params.unitLng, params.aimLat, params.aimLng);

  return {
    hit:              segment.distance <= params.hitRadius || endpointDistance <= params.hitRadius,
    segmentDistance:  segment.distance,
    endpointDistance,
    progress:         segment.t,
  };
}

// ============================================================
// HANDLER
// ============================================================

export async function POST() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const nowIso = new Date().toISOString();

    const { data: projectiles, error } = await supabase
      .from("battle_projectiles")
      .select("*")
      .eq("processed", false)
      .lte("impact_at", nowIso);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    if (!projectiles || projectiles.length === 0) {
      recordTick(0, { projectilesPending: 0 });
      return NextResponse.json({ success: true, processed: 0 });
    }

    let processed = 0;

    for (const p of projectiles) {
      const territoryId = String(p.territory_id ?? "");
      if (!territoryId) {
        await supabase.from("battle_projectiles").update({ processed: true, result: "miss" }).eq("id", p.id);
        processed++;
        continue;
      }

      // ── Batch territorial : une seule requête pour tous les candidats ──
      const { data: territoryUnits } = await supabase
        .from("club_units")
        .select("id, club_id, territory_id, hp, shield, max_shield, lat, lng, effects")
        .eq("territory_id", territoryId);

      const units = (territoryUnits ?? []) as UnitRow[];
      const defender = units.find((u) => u.id === p.defender_id) ?? null;

      const startLng = safeNumber(p.projectile_start_lng, safeNumber(defender?.lng, 0));
      const startLat = safeNumber(p.projectile_start_lat, safeNumber(defender?.lat, 0));
      const aimLng   = safeNumber(p.projectile_aim_lng,   safeNumber(defender?.lng, 0));
      const aimLat   = safeNumber(p.projectile_aim_lat,   safeNumber(defender?.lat, 0));
      const hitRadius = Math.max(0.02, safeNumber(p.hit_radius, 0.1));

      // ── Interception géométrique sur la trajectoire réelle ──
      // Toutes les unités vivantes (les deux camps) sont candidates.
      // Un tank ennemi peut bloquer physiquement un projectile allié (body-block).
      // Un allié qui s'interpose peut aussi absorber le tir (friendly intercept).
      // Le tri par progress (t) garantit que la PREMIÈRE unité sur la trajectoire
      // est touchée — comportement cohérent avec un projectile physique réel.
      // Le fallback defender (si aucun candidat) préserve la logique de miss propre.
      const candidates = units
        .filter(isUnitAlive)
        .filter((u) => typeof u.lat === "number" && typeof u.lng === "number")
        .map((u) => {
          const collision = isProjectileCollision({
            unitLat:   safeNumber(u.lat, 0),
            unitLng:   safeNumber(u.lng, 0),
            startLat, startLng, aimLat, aimLng, hitRadius,
          });
          return { unit: u, ...collision };
        })
        .filter((entry) => entry.hit)
        .sort((a, b) => {
          if (a.progress !== b.progress)              return a.progress - b.progress;
          if (a.segmentDistance !== b.segmentDistance) return a.segmentDistance - b.segmentDistance;
          return a.endpointDistance - b.endpointDistance;
        });

      const realTarget = candidates[0]?.unit ?? defender ?? null;

      if (!realTarget) {
        await supabase.from("battle_projectiles").update({ processed: true, result: "miss" }).eq("id", p.id);
        processed++;
        continue;
      }

      // Validation finale sur la cible réelle
      const collisionCheck = isProjectileCollision({
        unitLat:   safeNumber(realTarget.lat, 0),
        unitLng:   safeNumber(realTarget.lng, 0),
        startLat, startLng, aimLat, aimLng, hitRadius,
      });

      if (!collisionCheck.hit || p.result === "miss") {
        await supabase.from("battle_projectiles")
          .update({ processed: true, result: "miss", defender_id: realTarget.id })
          .eq("id", p.id);
        processed++;
        continue;
      }

      // ── Application dégâts + effets ──
      const directResult = applyShieldAndDamage({
        hp:     safeNumber(realTarget.hp, 0),
        shield: safeNumber(realTarget.shield, 0),
        damage: safeNumber(p.damage, 0),
      });

      const nextEffects = mergeEffects(
        realTarget.effects ?? [],
        Array.isArray(p.applied_effects) ? p.applied_effects : [],
      );

      await supabase.from("club_units").update({
        hp:     directResult.hp,
        shield: directResult.shield,
        status: directResult.hp > 0 ? "engaged" : "dead",
        effects: nextEffects,
      }).eq("id", realTarget.id);

      if (directResult.hp <= 0) {
        await supabase.from("club_units").delete().eq("id", realTarget.id);
      }

      const impactLat = safeNumber(realTarget.lat, aimLat);
      const impactLng = safeNumber(realTarget.lng, aimLng);

      const aoeRadius          = safeNumber(p.aoe_radius, 0);
      const splashMultiplier   = safeNumber(p.splash_multiplier, 0.5);
      const chainCount         = safeNumber(p.chain_count, 0);
      const chainDamageMultiplier = safeNumber(p.chain_damage_multiplier, 0.6);
      const chainTargetIds: string[] = Array.isArray(p.chain_target_ids) ? p.chain_target_ids : [];

      // ── AoE splash ──
      if (aoeRadius > 0) {
        const splashTargets = units.filter((unit) => {
          if (!isUnitAlive(unit)) return false;
          if (unit.id === realTarget.id) return false;
          if (unit.club_id === realTarget.club_id) return false;
          if (typeof unit.lat !== "number" || typeof unit.lng !== "number") return false;
          return distance(impactLat, impactLng, safeNumber(unit.lat, 0), safeNumber(unit.lng, 0)) <= aoeRadius;
        });

        for (const splashTarget of splashTargets) {
          const splashDamage = Math.max(1, Math.round(safeNumber(p.damage, 0) * splashMultiplier));
          const splashResult = applyShieldAndDamage({
            hp: safeNumber(splashTarget.hp, 0), shield: safeNumber(splashTarget.shield, 0), damage: splashDamage,
          });
          await supabase.from("club_units").update({
            hp: splashResult.hp, shield: splashResult.shield,
            status: splashResult.hp > 0 ? "engaged" : "dead",
          }).eq("id", splashTarget.id);
          if (splashResult.hp <= 0) await supabase.from("club_units").delete().eq("id", splashTarget.id);
        }
      }

      // ── Chain lightning ──
      if (chainCount > 0 && chainTargetIds.length > 0) {
        const indexed = new Map(units.map((u) => [u.id, u]));
        for (let i = 0; i < Math.min(chainCount, chainTargetIds.length); i++) {
          const chainTarget = indexed.get(chainTargetIds[i]);
          if (!isUnitAlive(chainTarget)) continue;
          if (chainTarget.id === realTarget.id) continue;
          if (chainTarget.club_id === realTarget.club_id) continue;

          const chainDamage = Math.max(1, Math.round(safeNumber(p.damage, 0) * Math.pow(chainDamageMultiplier, i + 1)));
          const chainResult = applyShieldAndDamage({
            hp: safeNumber(chainTarget.hp, 0), shield: safeNumber(chainTarget.shield, 0), damage: chainDamage,
          });
          await supabase.from("club_units").update({
            hp: chainResult.hp, shield: chainResult.shield,
            status: chainResult.hp > 0 ? "engaged" : "dead",
          }).eq("id", chainTarget.id);
          if (chainResult.hp <= 0) await supabase.from("club_units").delete().eq("id", chainTarget.id);
        }
      }

      await supabase.from("battle_projectiles")
        .update({ processed: true, result: "hit", defender_id: realTarget.id })
        .eq("id", p.id);

      processed++;
    }

    recordTick(0, { projectilesPending: projectiles.length });
    return NextResponse.json({ success: true, processed });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
