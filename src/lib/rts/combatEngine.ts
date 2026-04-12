// ==============================
// TYPES — PRIMITIVES
// ==============================

export type RangeType = "melee" | "ranged";
export type DamageKind = "physical" | "magic" | "true";
export type CombatResultType = "hit" | "miss" | "blocked";
export type ImpactStyle = "impact" | "explosion" | "chain" | "blackhole";
export type TargetPriority =
  | "default"
  | "focus_fire"
  | "aggro"
  | "weakest"
  | "closest"
  | "cluster"
  | "protect_backline"
  | "anti_focus"
  | "team_focus"
  | "regroup";

export type CombatEventType =
  | "attack"
  | "cast_start"
  | "cast_interrupt"
  | "ultimate"
  | "team_call";

export type StatusEffectType =
  | "stun"
  | "slow"
  | "weaken"
  | "burn"
  | "mark"
  | "pull";

export interface StatusEffect {
  type: StatusEffectType;
  value: number;
  expiresAt: number;
}

export type CombatRandom = () => number;

/** Zone de danger temporaire (projectile en vol, AOE, meteor). */
export interface DangerZone {
  x: number;
  y: number;
  radius: number;
  expiresAt: number;
  kind?: "projectile" | "aoe" | "blackhole";
}

// ==============================
// ULTIMATES / FORMATION / ACTIVE
// ==============================

export type FormationType = "line" | "wedge" | "collapse";

export type ActiveAbilityType =
  | "dash"
  | "blink"
  | "shield"
  | "cleanse"
  | "meteor"
  | "blackhole"
  | "dash_aoe";

export interface ActiveAbility {
  type: ActiveAbilityType;
  cooldownMs: number;
  lastUsedAt?: number;
}

// ==============================
// INTERFACES
// ==============================

export interface CombatUnit {
  id: string;
  clubId: string;
  territoryId: string | null;

  hp: number;
  maxHp: number;

  power: number;
  dps: number;

  critChance: number;
  accuracy: number;
  evasion: number;

  skillType: string;
  status: string;

  offsetX?: number;
  offsetY?: number;

  armor?: number;
  magicResist?: number;

  threatBonus?: number;
  tauntPower?: number;

  effects?: StatusEffect[];

  currentTargetId?: string | null;
  castingAbility?: string | null;
  castStartedAt?: number | null;
  castEndsAt?: number | null;
  castStartHp?: number | null;

  velocityX?: number;
  velocityY?: number;

  lastTargetChangeAt?: number | null;

  dangerZones?: DangerZone[];

  abilities?: ActiveAbility[];
  formationType?: FormationType;
}

export interface CombatEvent {
  type?: CombatEventType;

  attackerId: string;
  defenderId: string;

  damage: number;
  rawDamage: number;
  crit: boolean;

  skill: string;
  ability: string;

  rangeType: RangeType;
  damageKind: DamageKind;
  projectileType?: string;

  travelMs: number;
  result: CombatResultType;

  splashRadius: number;
  splashMultiplier: number;

  chainCount: number;
  chainDamageMultiplier: number;
  chainTargetIds: string[];

  aggroBoost: number;
  impactStyle: ImpactStyle;
  targetPriority: TargetPriority;

  appliedEffects?: StatusEffect[];
  note?: string;

  // ── Skillshot ──
  projectileStartLng?: number;
  projectileStartLat?: number;
  projectileAimLng?: number;
  projectileAimLat?: number;
  targetVelocityX?: number;
  targetVelocityY?: number;
  hitRadius?: number;

  // ── Replay / esport metadata ──
  teamFocusTargetId?: string | null;
  formationType?: FormationType;
  replayTag?: string;

  /**
   * True si cet event tue le défenseur (hp ≤ 0 après impact).
   * Posé par tick_route.ts après résolution du tick.
   */
  isKill?: boolean;
  /**
   * Nombre de kills consécutifs par cet attaquant ce tick (multi-kill).
   * Posé par tick_route.ts. 1 = premier kill, 2+ = multi-kill.
   */
  killStreak?: number;
  /**
   * Tag esport de haut niveau pour le replay/spectator :
   * - "clutch"    : unité survivante avec HP très bas (≤ 15% maxHp)
   * - "ace"       : dernier ennemi éliminé (victoire ce tick)
   * - "teamwipe"  : tous les ennemis éliminés en un seul tick
   * - "ultimate"  : ability ultimate activée
   */
  highlight?: "clutch" | "ace" | "teamwipe" | "ultimate";
}

export interface CombatTickResult {
  units: CombatUnit[];
  events: CombatEvent[];
  deadUnitIds: string[];
}

interface ThreatEntry { targetId: string; threat: number; }
type ThreatTable    = Map<string, ThreatEntry[]>;
type FocusTable     = Map<string, string>;
type TeamFocusTable = Map<string, string>;
interface MovementVector { x: number; y: number; }

// ==============================
// HELPERS — MATHS
// ==============================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function safeNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function distance(a: CombatUnit, b: CombatUnit): number {
  const dx = safeNumber(a.offsetX, 0) - safeNumber(b.offsetX, 0);
  const dy = safeNumber(a.offsetY, 0) - safeNumber(b.offsetY, 0);
  return Math.sqrt(dx * dx + dy * dy);
}

function distanceToPoint(unit: CombatUnit, x: number, y: number): number {
  const dx = safeNumber(unit.offsetX, 0) - x;
  const dy = safeNumber(unit.offsetY, 0) - y;
  return Math.sqrt(dx * dx + dy * dy);
}

function hpRatio(unit: CombatUnit): number {
  if (unit.maxHp <= 0) return 1;
  return clamp(unit.hp / unit.maxHp, 0, 1);
}

function normalize(dx: number, dy: number): MovementVector {
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return { x: dx / len, y: dy / len };
}

function addVector(a: MovementVector, b: MovementVector, scale = 1): MovementVector {
  return { x: a.x + b.x * scale, y: a.y + b.y * scale };
}

function deterministicShuffle<T>(items: T[], rand: CombatRandom): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ==============================
// HELPERS — CLASSIFICATION
// ==============================

function isBackline(unit: CombatUnit): boolean {
  return unit.skillType === "sniper" || unit.skillType === "mage" || unit.skillType === "storm";
}

function isFrontline(unit: CombatUnit): boolean {
  return unit.skillType === "tank" || unit.skillType === "berserk";
}

function isRanged(unit: CombatUnit): boolean {
  return unit.skillType === "sniper" || unit.skillType === "mage" || unit.skillType === "storm";
}

function getAttackRange(unit: CombatUnit): number {
  switch (unit.skillType) {
    case "sniper":  return 1.85;
    case "mage":    return 1.45;
    case "storm":   return 1.55;
    case "tank":    return 0.7;
    case "berserk": return 0.95;
    default:        return 0.85;
  }
}

function getProjectileType(unit: CombatUnit): string | undefined {
  switch (unit.skillType) {
    case "sniper": return "bolt";
    case "mage":   return "orb";
    case "storm":  return "orb";
    default:       return undefined;
  }
}

function getDamageKind(unit: CombatUnit): DamageKind {
  switch (unit.skillType) {
    case "mage":
    case "storm": return "magic";
    default:      return "physical";
  }
}

function getAbilityName(unit: CombatUnit): string {
  switch (unit.skillType) {
    case "tank":    return "taunt";
    case "berserk": return "execute";
    case "mage":    return "arcane_burst";
    case "sniper":  return "precision_shot";
    case "storm":   return "chain_lightning";
    default:        return "none";
  }
}

function getImpactStyle(unit: CombatUnit): ImpactStyle {
  switch (unit.skillType) {
    case "mage":  return "explosion";
    case "storm": return "chain";
    default:      return "impact";
  }
}

function getSplashRadius(unit: CombatUnit): number    { return unit.skillType === "mage" ? 0.55 : 0; }
function getSplashMultiplier(unit: CombatUnit): number { return unit.skillType === "mage" ? 0.5  : 0; }
function getChainCount(unit: CombatUnit): number       { return unit.skillType === "storm" ? 2   : 0; }
function getChainDamageMultiplier(unit: CombatUnit): number { return unit.skillType === "storm" ? 0.65 : 0; }

function getProjectileHitRadius(unit: CombatUnit): number {
  switch (unit.skillType) {
    case "sniper": return 0.09;
    case "mage":   return 0.16;
    case "storm":  return 0.14;
    default:       return 0.10;
  }
}

// ==============================
// HELPERS — STATUS EFFECTS
// ==============================

function hasEffect(unit: CombatUnit, type: StatusEffectType): boolean {
  return (unit.effects ?? []).some((e) => e.type === type);
}

function getEffects(unit: CombatUnit, type: StatusEffectType): StatusEffect[] {
  return (unit.effects ?? []).filter((e) => e.type === type);
}

function purgeExpiredEffects(unit: CombatUnit, now: number): void {
  if (unit.effects?.length) {
    unit.effects = unit.effects.filter((e) => e.expiresAt > now);
  }
  if (unit.dangerZones?.length) {
    unit.dangerZones = unit.dangerZones.filter((z) => z.expiresAt > now);
  }
}

function applyEffectsToTarget(target: CombatUnit, newEffects: StatusEffect[]): void {
  if (newEffects.length === 0) return;
  const existing = target.effects ?? [];
  for (const newEffect of newEffects) {
    const already = existing.find((e) => e.type === newEffect.type);
    if (already) {
      already.expiresAt = Math.max(already.expiresAt, newEffect.expiresAt);
      already.value     = Math.max(already.value, newEffect.value);
    } else {
      existing.push(newEffect);
    }
  }
  target.effects = existing;
}

function buildAppliedEffects(attacker: CombatUnit, now: number): StatusEffect[] {
  switch (attacker.skillType) {
    case "mage":    return [{ type: "burn",   value: 4,    expiresAt: now + 2000 }];
    case "tank":    return [{ type: "slow",   value: 0.3,  expiresAt: now + 1500 }];
    case "storm":   return [{ type: "mark",   value: 0.25, expiresAt: now + 2000 }];
    case "sniper":  return [{ type: "weaken", value: 0.2,  expiresAt: now + 1800 }];
    case "berserk": return [{ type: "stun",   value: 1,    expiresAt: now + 800  }];
    default:        return [];
  }
}

// ==============================
// HELPERS — CAST SYSTEM
// ==============================

function getCastTimeMs(unit: CombatUnit): number {
  switch (unit.skillType) {
    case "sniper":  return 260;
    case "mage":    return 520;
    case "storm":   return 420;
    case "berserk": return 120;
    default:        return 0;
  }
}

function requiresCast(unit: CombatUnit): boolean { return getCastTimeMs(unit) > 0; }

function getCastInterruptDamageThreshold(unit: CombatUnit): number {
  switch (unit.skillType) {
    case "sniper":  return 10;
    case "mage":    return 12;
    case "storm":   return 12;
    case "berserk": return 16;
    default:        return 999999;
  }
}

function clearCastingState(unit: CombatUnit): void {
  unit.currentTargetId = null;
  unit.castingAbility  = null;
  unit.castStartedAt   = null;
  unit.castEndsAt      = null;
  unit.castStartHp     = null;
}

function beginCast(unit: CombatUnit, targetId: string, ability: string, now: number): void {
  unit.currentTargetId = targetId;
  unit.castingAbility  = ability;
  unit.castStartedAt   = now;
  unit.castEndsAt      = now + getCastTimeMs(unit);
  unit.castStartHp     = unit.hp;
}

function isCasting(unit: CombatUnit, now: number): boolean {
  return unit.castEndsAt != null && Number(unit.castEndsAt) > now && !!unit.castingAbility && !!unit.currentTargetId;
}

function isCastReady(unit: CombatUnit, now: number): boolean {
  return unit.castEndsAt != null && Number(unit.castEndsAt) <= now && !!unit.castingAbility && !!unit.currentTargetId;
}

function shouldInterruptCast(unit: CombatUnit): boolean {
  if (!unit.castingAbility) return false;
  if (hasEffect(unit, "stun")) return true;
  const castStartHp = safeNumber(unit.castStartHp, unit.hp);
  return castStartHp - unit.hp >= getCastInterruptDamageThreshold(unit);
}

// ==============================
// HELPERS — THREAT
// ==============================

function getThreatBase(unit: CombatUnit): number {
  switch (unit.skillType) {
    case "tank":    return 24;
    case "berserk": return 16;
    case "mage":    return 11;
    case "storm":   return 12;
    case "sniper":  return 9;
    default:        return 10;
  }
}

function getThreatModifierForBeingHit(attacker: CombatUnit): number {
  switch (attacker.skillType) {
    case "tank":    return 26;
    case "berserk": return 14;
    case "mage":    return 12;
    case "storm":   return 13;
    case "sniper":  return 9;
    default:        return 10;
  }
}

function pushThreat(table: ThreatTable, attackerId: string, targetId: string, threat: number): void {
  const current  = table.get(attackerId) ?? [];
  const existing = current.find((entry) => entry.targetId === targetId);
  if (existing) { existing.threat += threat; } else { current.push({ targetId, threat }); }
  table.set(attackerId, current);
}

function getThreat(table: ThreatTable, attackerId: string, targetId: string): number {
  return (table.get(attackerId) ?? []).find((item) => item.targetId === targetId)?.threat ?? 0;
}

function buildThreatTable(units: CombatUnit[]): ThreatTable {
  const table: ThreatTable = new Map();
  for (const unit of units) {
    if (unit.hp <= 0) continue;
    const enemies = units.filter((c) => c.clubId !== unit.clubId && c.hp > 0);
    for (const enemy of enemies) {
      let threat = getThreatBase(enemy);
      threat += safeNumber(enemy.threatBonus, 0);
      if (enemy.skillType === "tank") threat += Math.max(18, safeNumber(enemy.tauntPower, 0));
      threat += Math.max(0, 10 - distance(unit, enemy) * 8);
      if (enemy.status === "engaged") threat += 2;
      pushThreat(table, unit.id, enemy.id, threat);
    }
  }
  return table;
}

// ==============================
// HELPERS — TEAM STRATEGY
// ==============================

function getClubAnchor(units: CombatUnit[]): { x: number; y: number } {
  if (units.length === 0) return { x: 0, y: 0 };
  const center = units.reduce(
    (acc, a) => ({ x: acc.x + safeNumber(a.offsetX, 0), y: acc.y + safeNumber(a.offsetY, 0) }),
    { x: 0, y: 0 },
  );
  return { x: center.x / units.length, y: center.y / units.length };
}

function getFormationType(allies: CombatUnit[], enemies: CombatUnit[]): FormationType {
  const avgHp = allies.reduce((sum, u) => sum + hpRatio(u), 0) / Math.max(1, allies.length);
  if (avgHp < 0.5) return "line";
  if (enemies.length >= allies.length) return "wedge";
  return "collapse";
}

function chooseTeamFocusTarget(enemies: CombatUnit[]): CombatUnit | null {
  if (enemies.length === 0) return null;
  return enemies
    .map((enemy) => {
      let score = (1 - hpRatio(enemy)) * 40;
      if (enemy.skillType === "mage" || enemy.skillType === "sniper") score += 18;
      if (enemy.skillType === "storm") score += 14;
      if (enemy.skillType === "tank")  score -= 10;
      return { enemy, score };
    })
    .sort((a, b) => b.score - a.score)[0]?.enemy ?? null;
}

function shouldRegroup(allies: CombatUnit[], enemies: CombatUnit[]): boolean {
  if (allies.length <= 1) return false;
  const allyAnchor = getClubAnchor(allies);
  const avgAllyDistance = allies.reduce((sum, ally) => sum + distanceToPoint(ally, allyAnchor.x, allyAnchor.y), 0) / allies.length;
  const avgHp = allies.reduce((sum, ally) => sum + hpRatio(ally), 0) / Math.max(1, allies.length);
  return avgAllyDistance > 0.9 || (avgHp < 0.38 && enemies.length >= allies.length);
}

// ==============================
// HELPERS — IA / TARGETING
// ==============================

function getNearbyThreat(unit: CombatUnit, enemies: CombatUnit[]): number {
  return enemies.filter((e) => e.hp > 0).reduce((sum, enemy) => {
    const dist   = distance(unit, enemy);
    const weight = dist <= 0.8 ? 1.5 : dist <= 1.4 ? 1 : 0.35;
    return sum + safeNumber(enemy.dps, 10) * weight;
  }, 0);
}

function shouldRetreat(unit: CombatUnit, enemies: CombatUnit[]): boolean {
  const ratio       = hpRatio(unit);
  const nearbyThreat = getNearbyThreat(unit, enemies);
  const danger      = nearbyThreat / Math.max(1, unit.hp);
  if (unit.skillType === "sniper" || unit.skillType === "mage") return ratio < 0.45 || danger > 0.6;
  if (unit.skillType === "storm")   return ratio < 0.4  || danger > 0.72;
  if (unit.skillType === "berserk") return ratio < 0.25 && danger > 0.8;
  return false;
}

function shouldKite(attacker: CombatUnit, target: CombatUnit): boolean {
  if (!isRanged(attacker)) return false;
  const dist  = distance(attacker, target);
  const range = getAttackRange(attacker);
  const finishWindow = hpRatio(target) < 0.22 && dist <= range &&
    safeNumber(attacker.dps, 0) >= Math.max(8, safeNumber(target.hp, 0) * 0.45);
  if (finishWindow) return false;
  return dist < range * 0.8 || dist > range * 1.15;
}

function findProtectedBacklineTarget(attacker: CombatUnit, allies: CombatUnit[], enemies: CombatUnit[]): CombatUnit | null {
  if (attacker.skillType !== "tank") return null;
  const fragileAlly = allies
    .filter((ally) => ally.id !== attacker.id && ally.hp > 0 && isBackline(ally))
    .sort((a, b) => hpRatio(a) - hpRatio(b))[0];
  if (!fragileAlly) return null;
  const threateningEnemy = enemies.filter((e) => e.hp > 0)
    .map((enemy) => ({
      enemy,
      score: Math.max(0, 1.7 - distance(enemy, fragileAlly)) * 10 +
        (isFrontline(enemy) ? 6 : 0) + (enemy.skillType === "berserk" ? 8 : 0) + (isRanged(enemy) ? 6 : 0),
    }))
    .sort((a, b) => b.score - a.score)[0];
  return threateningEnemy?.score > 6 ? threateningEnemy.enemy : null;
}

function getAntiFocusPressure(enemy: CombatUnit, allies: CombatUnit[]): number {
  return allies.reduce((sum, ally) => {
    if (!isBackline(ally) || ally.hp <= 0) return sum;
    const dist = distance(enemy, ally);
    if (dist <= 0.9) return sum + 18;
    if (dist <= 1.4) return sum + 8;
    return sum;
  }, 0);
}

function getBaseTargetPriority(attacker: CombatUnit): TargetPriority {
  switch (attacker.skillType) {
    case "tank":   return "aggro";
    case "sniper": return "weakest";
    case "mage":   return "cluster";
    case "storm":  return "cluster";
    default:       return "default";
  }
}

function selectTarget(
  attacker: CombatUnit, enemies: CombatUnit[], allies: CombatUnit[],
  threatTable: ThreatTable, focusTable: FocusTable, teamFocusTable: TeamFocusTable, now: number,
): { target: CombatUnit | null; priority: TargetPriority } {
  if (enemies.length === 0) return { target: null, priority: "default" };

  const range     = getAttackRange(attacker);
  const inRange   = enemies.filter((enemy) => distance(attacker, enemy) <= range);
  if (!isRanged(attacker) && inRange.length === 0) return { target: null, priority: "default" };

  const candidates = inRange.length > 0 ? inRange : enemies;

  if (attacker.currentTargetId && now - safeNumber(attacker.lastTargetChangeAt, 0) < 800) {
    const locked = candidates.find((e) => e.id === attacker.currentTargetId && e.hp > 0);
    if (locked) return { target: locked, priority: "focus_fire" };
  }

  const protectedTarget = findProtectedBacklineTarget(attacker, allies, enemies);
  if (protectedTarget) return { target: protectedTarget, priority: "protect_backline" };

  const teamFocusTargetId    = teamFocusTable.get(attacker.clubId) ?? null;
  const currentFocusTargetId = focusTable.get(attacker.clubId) ?? null;

  const scored = candidates.map((enemy) => {
    const dist              = distance(attacker, enemy);
    const threat            = getThreat(threatTable, attacker.id, enemy.id);
    const ratio             = hpRatio(enemy);
    const antiFocusPressure = getAntiFocusPressure(enemy, allies);
    let score = threat;
    let priority: TargetPriority = getBaseTargetPriority(attacker);

    if (teamFocusTargetId === enemy.id)    { score += 30; priority = "team_focus"; }
    else if (currentFocusTargetId === enemy.id) { score += 22; priority = "focus_fire"; }
    if (antiFocusPressure > 0 && attacker.skillType === "tank") { score += antiFocusPressure; priority = "anti_focus"; }

    switch (attacker.skillType) {
      case "sniper":
        score += (1 - ratio) * 45 + clamp(dist, 0, 2) * 5;
        if (enemy.skillType === "mage" || enemy.skillType === "storm") score += 20;
        if (enemy.skillType === "sniper") score += 7;
        if (priority !== "focus_fire" && priority !== "team_focus") priority = "weakest";
        break;
      case "mage": {
        const packed = enemies.filter((c) => distance(enemy, c) <= 0.5).length;
        score += packed * 14 + 8 - dist * 2;
        if (enemy.skillType === "tank")   score -= 4;
        if (enemy.skillType === "sniper") score += 6;
        if (priority !== "focus_fire" && priority !== "team_focus") priority = "cluster";
        break;
      }
      case "storm": {
        const packed = enemies.filter((c) => distance(enemy, c) <= 0.65).length;
        score += packed * 16 + 8 - dist * 2;
        if (enemy.skillType === "mage" || enemy.skillType === "sniper") score += 6;
        if (priority !== "focus_fire" && priority !== "team_focus") priority = "cluster";
        break;
      }
      case "tank":
        score += 22 - dist * 10;
        if (enemy.skillType === "berserk" || enemy.skillType === "tank") score += 12;
        if (enemy.skillType === "sniper") score -= 4;
        if (antiFocusPressure > 0) score += antiFocusPressure;
        if (priority !== "focus_fire" && priority !== "team_focus" && priority !== "anti_focus") priority = "aggro";
        break;
      case "berserk":
        score += (1 - ratio) * 20 + 15 - dist * 8;
        if (enemy.skillType === "sniper" || enemy.skillType === "mage") score += 14;
        if (priority !== "focus_fire" && priority !== "team_focus") priority = "closest";
        break;
      default:
        score += (1 - ratio) * 26 + 10 - dist * 5;
        if (priority !== "focus_fire" && priority !== "team_focus") priority = "default";
    }

    return { enemy, score, priority };
  });

  scored.sort((a, b) => b.score - a.score);
  const selected = scored[0];
  if (!selected) return { target: null, priority: "default" };

  attacker.lastTargetChangeAt = now;
  focusTable.set(attacker.clubId, selected.enemy.id);
  return { target: selected.enemy, priority: selected.priority };
}

// ==============================
// HELPERS — DODGE AI
// ==============================

function isInDanger(unit: CombatUnit, now: number): boolean {
  if (!unit.dangerZones?.length) return false;
  const ux = safeNumber(unit.offsetX, 0);
  const uy = safeNumber(unit.offsetY, 0);
  return unit.dangerZones.some((z) => {
    if (z.expiresAt < now) return false;
    const dx = ux - z.x;
    const dy = uy - z.y;
    return Math.sqrt(dx * dx + dy * dy) <= z.radius;
  });
}

function computeEscapeVector(unit: CombatUnit, now: number): MovementVector {
  if (!unit.dangerZones?.length) return { x: 0, y: 0 };
  const ux = safeNumber(unit.offsetX, 0);
  const uy = safeNumber(unit.offsetY, 0);
  let vx = 0; let vy = 0;
  for (const z of unit.dangerZones) {
    if (z.expiresAt < now) continue;
    const dx   = ux - z.x;
    const dy   = uy - z.y;
    const dist = Math.max(0.001, Math.sqrt(dx * dx + dy * dy));
    const strength = 1 / dist;
    vx += (dx / dist) * strength;
    vy += (dy / dist) * strength;
  }
  const normalized = normalize(vx, vy);
  return { x: normalized.x * 1.8, y: normalized.y * 1.8 };
}

// ==============================
// HELPERS — FORMATION & BODYBLOCK
// ==============================

function computeFormationPosition(unit: CombatUnit, allies: CombatUnit[], enemies: CombatUnit[]): MovementVector {
  if (allies.length <= 1 || enemies.length === 0) return { x: 0, y: 0 };

  const formation = unit.formationType ?? getFormationType(allies, enemies);
  const center    = allies.reduce(
    (acc, a) => ({ x: acc.x + safeNumber(a.offsetX, 0), y: acc.y + safeNumber(a.offsetY, 0) }),
    { x: 0, y: 0 },
  );
  center.x /= allies.length;
  center.y /= allies.length;

  const closestEnemy = enemies.reduce((best, enemy) => {
    return distanceToPoint(enemy, center.x, center.y) < distanceToPoint(best, center.x, center.y) ? enemy : best;
  });

  const dir  = normalize(safeNumber(closestEnemy.offsetX, 0) - center.x, safeNumber(closestEnemy.offsetY, 0) - center.y);
  const perp = { x: -dir.y, y: dir.x };

  const sortedAllies = [...allies].sort((a, b) => a.id.localeCompare(b.id));
  const index = sortedAllies.findIndex((a) => a.id === unit.id);
  if (index < 0) return { x: 0, y: 0 };

  const spacing = 0.35;

  if (formation === "line") {
    const offset        = (index - (sortedAllies.length - 1) / 2) * spacing;
    const forwardOffset = isFrontline(unit) ? 0.25 : isBackline(unit) ? -0.25 : 0;
    return { x: perp.x * offset + dir.x * forwardOffset, y: perp.y * offset + dir.y * forwardOffset };
  }

  if (formation === "wedge") {
    const row     = Math.floor(index / 2);
    const side    = index % 2 === 0 ? -1 : 1;
    const forward = isFrontline(unit) ? row * 0.45 : Math.max(0, row - 1) * 0.28;
    return { x: dir.x * forward + perp.x * side * row * 0.28, y: dir.y * forward + perp.y * side * row * 0.28 };
  }

  // collapse
  return { x: dir.x * 0.3, y: dir.y * 0.3 };
}

function computeBodyblockPosition(unit: CombatUnit, allies: CombatUnit[], enemies: CombatUnit[]): MovementVector {
  if (unit.skillType !== "tank") return { x: 0, y: 0 };

  const fragile = allies
    .filter((a) => isBackline(a) && a.hp > 0)
    .sort((a, b) => hpRatio(a) - hpRatio(b))[0];
  if (!fragile) return { x: 0, y: 0 };

  const threat = enemies
    .filter((e) => isRanged(e) && e.hp > 0)
    .sort((a, b) => distance(a, fragile) - distance(b, fragile))[0];
  if (!threat) return { x: 0, y: 0 };
  // Guard distance — bodyblock uniquement si menace imminente
  if (distance(threat, fragile) >= 2) return { x: 0, y: 0 };

  const fx  = safeNumber(fragile.offsetX, 0);
  const fy  = safeNumber(fragile.offsetY, 0);
  const tx  = safeNumber(threat.offsetX, 0);
  const ty  = safeNumber(threat.offsetY, 0);
  const dir = normalize(fx - tx, fy - ty);

  // DEVANT le fragile (côté menace)
  const targetX = fx - dir.x * 0.3;
  const targetY = fy - dir.y * 0.3;

  return normalize(targetX - safeNumber(unit.offsetX, 0), targetY - safeNumber(unit.offsetY, 0));
}

// ==============================
// HELPERS — ACTIVE / ULTIMATE ABILITIES
// ==============================

function canUseAbility(ability: ActiveAbility, now: number): boolean {
  return !ability.lastUsedAt || now - ability.lastUsedAt >= ability.cooldownMs;
}

/**
 * Shield actif : applique une réduction de dégâts via slow (neutre visuellement).
 *
 * FIX vs doc 31 : le doc appliquait weaken value: -0.3 (négatif) ce qui cassait
 * applyEffectsToTarget (Math.max sur des valeurs négatives → undefined behavior).
 * Solution : on n'applique pas d'effet moteur ici — le shield HP est géré via
 * le champ `shield` en DB (projectile-impact/route.ts). On émet juste l'event
 * pour que le front affiche le FX shield_burst.
 */
function applySelfBuffShield(unit: CombatUnit, now: number): void {
  // Réduction de vitesse légère pour symboliser l'unité en position défensive
  applyEffectsToTarget(unit, [{ type: "slow", value: 0.15, expiresAt: now + 1000 }]);
}

function applyCleanse(unit: CombatUnit): void {
  unit.effects = (unit.effects ?? []).filter(
    (e) => e.type !== "stun" && e.type !== "slow" && e.type !== "weaken" && e.type !== "mark" && e.type !== "burn",
  );
}

function applyBlackholePull(
  attacker: CombatUnit, enemies: CombatUnit[], byId: Map<string, CombatUnit>,
  now: number, events: CombatEvent[],
): boolean {
  const packedCenter = chooseTeamFocusTarget(enemies);
  if (!packedCenter) return false;

  const centerX = safeNumber(packedCenter.offsetX, 0);
  const centerY = safeNumber(packedCenter.offsetY, 0);
  const radius  = 0.75;
  let affected  = 0;

  for (const enemy of enemies) {
    const liveEnemy = byId.get(enemy.id);
    if (!liveEnemy || liveEnemy.hp <= 0) continue;
    if (distanceToPoint(liveEnemy, centerX, centerY) > radius) continue;

    const dir = normalize(centerX - safeNumber(liveEnemy.offsetX, 0), centerY - safeNumber(liveEnemy.offsetY, 0));
    liveEnemy.offsetX = safeNumber(liveEnemy.offsetX, 0) + dir.x * 0.14;
    liveEnemy.offsetY = safeNumber(liveEnemy.offsetY, 0) + dir.y * 0.14;

    applyEffectsToTarget(liveEnemy, [
      { type: "pull", value: 1,    expiresAt: now + 500 },
      { type: "slow", value: 0.35, expiresAt: now + 900 },
    ]);
    affected++;
  }

  if (affected === 0) return false;

  events.push({
    type: "ultimate", attackerId: attacker.id, defenderId: packedCenter.id,
    damage: 0, rawDamage: 0, crit: false, skill: attacker.skillType, ability: "blackhole",
    rangeType: "ranged", damageKind: "magic", projectileType: "orb", travelMs: 0, result: "hit",
    splashRadius: radius, splashMultiplier: 0, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [],
    aggroBoost: 12, impactStyle: "blackhole", targetPriority: "cluster",
    note: "ultimate_blackhole_pull",
    projectileStartLng: safeNumber(attacker.offsetX, 0), projectileStartLat: safeNumber(attacker.offsetY, 0),
    projectileAimLng: centerX, projectileAimLat: centerY, hitRadius: radius,
    replayTag: "ULT_BLACKHOLE",
  });

  return true;
}

function applyMeteorUltimate(attacker: CombatUnit, enemies: CombatUnit[], now: number, events: CombatEvent[]): boolean {
  const target = chooseTeamFocusTarget(enemies);
  if (!target) return false;

  const aimX = safeNumber(target.offsetX, 0);
  const aimY = safeNumber(target.offsetY, 0);

  events.push({
    type: "ultimate", attackerId: attacker.id, defenderId: target.id,
    damage: 24, rawDamage: 24, crit: false, skill: attacker.skillType, ability: "meteor",
    rangeType: "ranged", damageKind: "magic", projectileType: "orb", travelMs: 1200, result: "hit",
    splashRadius: 0.7, splashMultiplier: 0.65, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [],
    aggroBoost: 18, impactStyle: "explosion", targetPriority: "cluster",
    note: "ultimate_meteor_cast",
    projectileStartLng: safeNumber(attacker.offsetX, 0), projectileStartLat: safeNumber(attacker.offsetY, 0),
    projectileAimLng: aimX, projectileAimLat: aimY,
    targetVelocityX: safeNumber(target.velocityX, 0), targetVelocityY: safeNumber(target.velocityY, 0),
    hitRadius: 0.22, replayTag: "ULT_METEOR", formationType: attacker.formationType,
  });

  // Injecte une danger zone sur les ennemis pour déclencher le dodge
  const zone: DangerZone = { x: aimX, y: aimY, radius: 0.7, expiresAt: now + 1200, kind: "aoe" };
  for (const enemy of enemies) {
    enemy.dangerZones = [...(enemy.dangerZones ?? []), zone];
  }

  return true;
}

function applyDashAoeUltimate(
  attacker: CombatUnit, target: CombatUnit, enemies: CombatUnit[],
  byId: Map<string, CombatUnit>, now: number, events: CombatEvent[],
): boolean {
  const dir = normalize(safeNumber(target.offsetX, 0) - safeNumber(attacker.offsetX, 0), safeNumber(target.offsetY, 0) - safeNumber(attacker.offsetY, 0));
  attacker.offsetX = safeNumber(attacker.offsetX, 0) + dir.x * 0.5;
  attacker.offsetY = safeNumber(attacker.offsetY, 0) + dir.y * 0.5;

  let hits = 0;
  for (const enemy of enemies) {
    const liveEnemy = byId.get(enemy.id);
    if (!liveEnemy || liveEnemy.hp <= 0 || distance(attacker, liveEnemy) > 0.45) continue;
    applyImmediateDamage(liveEnemy, 16);
    applyEffectsToTarget(liveEnemy, [{ type: "stun", value: 1, expiresAt: now + 450 }]);
    hits++;
  }

  if (hits === 0) return false;

  events.push({
    type: "ultimate", attackerId: attacker.id, defenderId: target.id,
    damage: hits * 16, rawDamage: hits * 16, crit: false, skill: attacker.skillType, ability: "dash_aoe",
    rangeType: "melee", damageKind: "physical", travelMs: 0, result: "hit",
    splashRadius: 0.45, splashMultiplier: 1, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [],
    aggroBoost: 16, impactStyle: "impact", targetPriority: "closest",
    note: "ultimate_dash_aoe", replayTag: "ULT_DASH_AOE",
  });

  return true;
}

/**
 * tryUseAbilities — résout les abilities actives de l'unité.
 *
 * ⚠️ Effets de bord intentionnels : cette fonction mute byId (positions des ennemis
 * via blackhole/dash_aoe) et pousse dans events (ultimates). Ces mutations sont
 * nécessaires pour que les résultats soient visibles dans le même tick.
 * Elle est appelée depuis computeMovement — les mutations sont donc effectuées
 * AVANT la résolution de l'attaque de l'unité, ce qui est correct.
 */
function tryUseAbilities(
  unit: CombatUnit, target: CombatUnit, enemies: CombatUnit[], allies: CombatUnit[],
  byId: Map<string, CombatUnit>, now: number, events: CombatEvent[],
): MovementVector {
  if (!unit.abilities?.length) return { x: 0, y: 0 };

  for (const ability of unit.abilities) {
    if (!canUseAbility(ability, now)) continue;

    switch (ability.type) {
      case "dash": {
        if (distance(unit, target) <= getAttackRange(unit) * 1.5) {
          const dir = normalize(safeNumber(target.offsetX, 0) - safeNumber(unit.offsetX, 0), safeNumber(target.offsetY, 0) - safeNumber(unit.offsetY, 0));
          ability.lastUsedAt = now;
          events.push({ type: "ultimate", attackerId: unit.id, defenderId: target.id, damage: 0, rawDamage: 0, crit: false, skill: unit.skillType, ability: "dash", rangeType: "melee", damageKind: "physical", travelMs: 0, result: "hit", splashRadius: 0, splashMultiplier: 0, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [], aggroBoost: 6, impactStyle: "impact", targetPriority: "closest", note: "active_dash", replayTag: "ACTIVE_DASH" });
          return { x: dir.x * 2.5, y: dir.y * 2.5 };
        }
        break;
      }
      case "blink": {
        if (hpRatio(unit) < 0.25 && enemies.length > 0) {
          const enemy = enemies[0];
          const dir = normalize(safeNumber(unit.offsetX, 0) - safeNumber(enemy.offsetX, 0), safeNumber(unit.offsetY, 0) - safeNumber(enemy.offsetY, 0));
          ability.lastUsedAt = now;
          events.push({ type: "ultimate", attackerId: unit.id, defenderId: enemy.id, damage: 0, rawDamage: 0, crit: false, skill: unit.skillType, ability: "blink", rangeType: "ranged", damageKind: "true", travelMs: 0, result: "hit", splashRadius: 0, splashMultiplier: 0, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [], aggroBoost: 0, impactStyle: "impact", targetPriority: "regroup", note: "active_blink_escape", replayTag: "ACTIVE_BLINK" });
          return { x: dir.x * 4, y: dir.y * 4 };
        }
        break;
      }
      case "shield": {
        if (hpRatio(unit) < 0.4) {
          applySelfBuffShield(unit, now);
          ability.lastUsedAt = now;
          events.push({ type: "ultimate", attackerId: unit.id, defenderId: unit.id, damage: 0, rawDamage: 0, crit: false, skill: unit.skillType, ability: "shield_burst", rangeType: "ranged", damageKind: "true", travelMs: 0, result: "hit", splashRadius: 0, splashMultiplier: 0, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [], aggroBoost: 0, impactStyle: "impact", targetPriority: "default", note: "active_shield", replayTag: "ACTIVE_SHIELD" });
        }
        break;
      }
      case "cleanse": {
        if ((unit.effects ?? []).length > 2 || hasEffect(unit, "stun")) {
          applyCleanse(unit);
          ability.lastUsedAt = now;
          events.push({ type: "ultimate", attackerId: unit.id, defenderId: unit.id, damage: 0, rawDamage: 0, crit: false, skill: unit.skillType, ability: "cleanse", rangeType: "ranged", damageKind: "true", travelMs: 0, result: "hit", splashRadius: 0, splashMultiplier: 0, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [], aggroBoost: 0, impactStyle: "impact", targetPriority: "default", note: "active_cleanse", replayTag: "ACTIVE_CLEANSE" });
        }
        break;
      }
      case "meteor": {
        if ((unit.skillType === "mage" || unit.skillType === "storm") && applyMeteorUltimate(unit, enemies, now, events)) {
          ability.lastUsedAt = now;
        }
        break;
      }
      case "blackhole": {
        if ((unit.skillType === "storm" || unit.skillType === "mage") && applyBlackholePull(unit, enemies, byId, now, events)) {
          ability.lastUsedAt = now;
        }
        break;
      }
      case "dash_aoe": {
        if ((unit.skillType === "berserk" || unit.skillType === "tank") && distance(unit, target) <= 1.2 && applyDashAoeUltimate(unit, target, enemies, byId, now, events)) {
          ability.lastUsedAt = now;
        }
        break;
      }
    }
  }

  return { x: 0, y: 0 };
}

// ==============================
// HELPERS — MOVEMENT
// ==============================

function computeMovement(
  unit: CombatUnit, target: CombatUnit, enemies: CombatUnit[], allies: CombatUnit[],
  now: number, byId: Map<string, CombatUnit>, events: CombatEvent[], regroup: boolean,
): MovementVector {
  let move: MovementVector = { x: 0, y: 0 };
  const ux = safeNumber(unit.offsetX, 0);
  const uy = safeNumber(unit.offsetY, 0);
  const tx = safeNumber(target.offsetX, 0);
  const ty = safeNumber(target.offsetY, 0);

  // ── Priorité 0 : Dodge (surpasse tout) ──
  if (isInDanger(unit, now)) {
    unit.status = "dodging";
    return computeEscapeVector(unit, now);
  }

  // ── Abilities actives (dash/blink ont leur propre vecteur de mouvement) ──
  const abilityMove = tryUseAbilities(unit, target, enemies, allies, byId, now, events);
  if (abilityMove.x !== 0 || abilityMove.y !== 0) {
    return abilityMove; // dash/blink override tout
  }

  const movePenalty = isCasting(unit, now) ? 0.3 : 1;

  // ── Regroup ──
  if (regroup) {
    const anchor = getClubAnchor(allies);
    move = addVector(move, normalize(anchor.x - ux, anchor.y - uy), 1.15 * movePenalty);
    unit.status = "regrouping";
  }

  // ── Formation ──
  const formationMove = computeFormationPosition(unit, allies, enemies);
  move = addVector(move, formationMove, 0.4 * movePenalty);

  if (shouldRetreat(unit, enemies)) {
    move = addVector(move, normalize(ux - tx, uy - ty), 1.2 * movePenalty);
    return move; // bodyblock non appliqué en retreat
  }

  // ── Bodyblock (guard distance intégré dans computeBodyblockPosition) ──
  const bodyblockMove = computeBodyblockPosition(unit, allies, enemies);
  move = addVector(move, bodyblockMove, 1.2 * movePenalty);

  if (shouldKite(unit, target)) {
    move = addVector(move, normalize(ux - tx, uy - ty), 0.8 * movePenalty);
  }

  const dist  = distance(unit, target);
  const range = getAttackRange(unit);
  const inRangeBuffered = dist <= range * 1.05 && dist >= range * 0.85;
  if (!inRangeBuffered && dist > range * 1.05) {
    move = addVector(move, normalize(tx - ux, ty - uy), 0.9 * movePenalty);
  }

  // ── Anti-blob général ──
  for (const ally of allies) {
    if (ally.id === unit.id) continue;
    const d = distance(unit, ally);
    if (d < 0.25) {
      const ax = safeNumber(ally.offsetX, 0);
      const ay = safeNumber(ally.offsetY, 0);
      move = addVector(move, normalize(ux - ax, uy - ay), 0.6);
    }
  }

  // ── Anti-stack AOE (urgence) ──
  for (const ally of allies) {
    if (ally.id === unit.id) continue;
    const d = distance(unit, ally);
    if (d < 0.18) {
      const ax = safeNumber(ally.offsetX, 0);
      const ay = safeNumber(ally.offsetY, 0);
      move = addVector(move, normalize(ux - ax, uy - ay), 0.8);
    }
  }

  return move;
}

/**
 * Applique le vecteur sur offsetX/Y avec inertie 0.6.
 * Reset velocity en dodge pour réactivité maximale.
 */
function applyMovement(unit: CombatUnit, move: MovementVector): void {
  const isDodging = unit.status === "dodging";
  const speed = isDodging ? 0.06 : isRanged(unit) ? 0.035 : 0.028;
  if (isDodging) { unit.velocityX = 0; unit.velocityY = 0; }
  const vx = safeNumber(unit.velocityX, 0) * 0.6 + move.x * speed;
  const vy = safeNumber(unit.velocityY, 0) * 0.6 + move.y * speed;
  unit.velocityX = vx;
  unit.velocityY = vy;
  unit.offsetX   = safeNumber(unit.offsetX, 0) + vx;
  unit.offsetY   = safeNumber(unit.offsetY, 0) + vy;
}

// ==============================
// HELPERS — SKILLSHOT
// ==============================

function predictAimPoint(defender: CombatUnit, travelMs: number): { lng: number; lat: number } {
  const TICK_RATE_FACTOR = 30;
  const seconds = Math.max(0, travelMs) / 1000;
  return {
    lng: safeNumber(defender.offsetX, 0) + safeNumber(defender.velocityX, 0) * Math.max(1, seconds * TICK_RATE_FACTOR),
    lat: safeNumber(defender.offsetY, 0) + safeNumber(defender.velocityY, 0) * Math.max(1, seconds * TICK_RATE_FACTOR),
  };
}

// ==============================
// HELPERS — COMBAT CALCULATIONS
// ==============================

function getSkillBonus(skillType: string): number {
  switch (skillType) {
    case "berserk": return 1.2;
    case "sniper":  return 1.15;
    case "mage":    return 1.1;
    case "storm":   return 1.08;
    case "tank":    return 0.9;
    default:        return 1;
  }
}

function computeAbilityDamageMultiplier(attacker: CombatUnit, defender: CombatUnit): number {
  switch (attacker.skillType) {
    case "tank": return 1;
    case "berserk": {
      const ratio = hpRatio(defender);
      if (ratio <= 0.3) return 1.55;
      if (ratio <= 0.5) return 1.25;
      return 1.08;
    }
    case "mage":   return 1.12;
    case "storm":  return 1.06;
    case "sniper": return distance(attacker, defender) >= 1.2 ? 1.25 : 1.08;
    default:       return 1;
  }
}

function computeAggroBoost(attacker: CombatUnit): number {
  const base = safeNumber(attacker.threatBonus, 0);
  switch (attacker.skillType) {
    case "tank":    return base + Math.max(25, safeNumber(attacker.tauntPower, 35));
    case "berserk": return base + 12;
    case "mage":    return base + 8;
    case "storm":   return base + 9;
    case "sniper":  return base + 5;
    default:        return base;
  }
}

function computeHitChance(attacker: CombatUnit, defender: CombatUnit): number {
  if (hasEffect(attacker, "stun")) return 0;
  let chance = safeNumber(attacker.accuracy, 80) - safeNumber(defender.evasion, 10);
  const dist = distance(attacker, defender);
  if (attacker.skillType === "sniper") { chance += 8; chance -= dist * 2; }
  else if (attacker.skillType === "mage" || attacker.skillType === "storm") { chance += 4; chance -= dist * 1.5; }
  else { chance -= dist * 1; }
  if (hasEffect(defender, "slow"))   chance += 5;
  if (defender.status === "moving")  chance -= 8;
  return clamp(chance, 10, 95);
}

function rollCrit(chancePercent: number, rand: CombatRandom): boolean {
  return rand() < clamp(chancePercent, 0, 100) / 100;
}

function computeRawDamage(attacker: CombatUnit, defender: CombatUnit, crit: boolean): number {
  const baseDamage = Math.max(1, safeNumber(attacker.dps, 0) > 0 ? safeNumber(attacker.dps, 10) : safeNumber(attacker.power, 10));
  let value = baseDamage * getSkillBonus(attacker.skillType) * computeAbilityDamageMultiplier(attacker, defender) * (crit ? 1.75 : 1);
  const weakenEffects = getEffects(attacker, "weaken");
  if (weakenEffects.length > 0) value *= Math.max(0, 1 - clamp(weakenEffects.reduce((s, e) => s + e.value, 0), 0, 1));
  const markEffects = getEffects(defender, "mark");
  if (markEffects.length > 0) value *= 1 + clamp(markEffects.reduce((s, e) => s + e.value, 0), 0, 1);
  return Math.max(1, Math.round(value));
}

function applyMitigation(rawDamage: number, damageKind: DamageKind, defender: CombatUnit): number {
  if (damageKind === "true") return Math.max(1, Math.round(rawDamage));
  if (damageKind === "physical") {
    const armor = clamp(safeNumber(defender.armor, 0), 0, 85);
    return Math.max(1, Math.round(rawDamage * (1 - armor / 100)));
  }
  const mr = clamp(safeNumber(defender.magicResist, 0), 0, 85);
  return Math.max(1, Math.round(rawDamage * (1 - mr / 100)));
}

function computeTravelMs(attacker: CombatUnit, defender: CombatUnit): number {
  if (!isRanged(attacker)) return 0;
  const dist = distance(attacker, defender);
  switch (attacker.skillType) {
    case "sniper": return clamp(Math.round(140 + dist * 180), 140, 1200);
    case "mage":   return clamp(Math.round(220 + dist * 220), 180, 1400);
    case "storm":  return clamp(Math.round(180 + dist * 200), 160, 1300);
    default:       return clamp(Math.round(180 + dist * 200), 160, 1200);
  }
}

function buildChainTargetIds(primaryTarget: CombatUnit, enemies: CombatUnit[], chainCount: number): string[] {
  if (chainCount <= 0) return [];
  return enemies
    .filter((enemy) => enemy.id !== primaryTarget.id && enemy.hp > 0)
    .sort((a, b) => distance(primaryTarget, a) - distance(primaryTarget, b))
    .slice(0, chainCount)
    .map((enemy) => enemy.id);
}

// ==============================
// HELPERS — DAMAGE APPLICATION
// ==============================

function applyImmediateDamage(target: CombatUnit, amount: number): void {
  target.hp = Math.max(0, target.hp - Math.max(0, Math.round(amount)));
}

function applyImmediateSplash(
  attacker: CombatUnit, primaryTarget: CombatUnit, enemies: CombatUnit[],
  byId: Map<string, CombatUnit>, damage: number, splashRadius: number,
  splashMultiplier: number, threatTable: ThreatTable,
): void {
  if (splashRadius <= 0 || splashMultiplier <= 0) return;
  for (const enemy of enemies) {
    if (enemy.id === primaryTarget.id) continue;
    const liveEnemy = byId.get(enemy.id);
    if (!liveEnemy || liveEnemy.hp <= 0 || distance(primaryTarget, liveEnemy) > splashRadius) continue;
    const splashDamage = Math.max(1, Math.round(damage * splashMultiplier));
    applyImmediateDamage(liveEnemy, splashDamage);
    pushThreat(threatTable, liveEnemy.id, attacker.id, getThreatModifierForBeingHit(attacker) + Math.round(splashDamage * 0.25));
  }
}

function applyImmediateChain(
  attacker: CombatUnit, chainTargetIds: string[], byId: Map<string, CombatUnit>,
  damage: number, chainDamageMultiplier: number, threatTable: ThreatTable,
): void {
  if (chainTargetIds.length === 0 || chainDamageMultiplier <= 0) return;
  chainTargetIds.forEach((targetId, index) => {
    const liveEnemy = byId.get(targetId);
    if (!liveEnemy || liveEnemy.hp <= 0) return;
    const chainDamage = Math.max(1, Math.round(damage * Math.pow(chainDamageMultiplier, index + 1)));
    applyImmediateDamage(liveEnemy, chainDamage);
    pushThreat(threatTable, liveEnemy.id, attacker.id, getThreatModifierForBeingHit(attacker) + Math.round(chainDamage * 0.25));
  });
}

function applyBurnDamage(units: CombatUnit[]): void {
  for (const unit of units) {
    const burns = getEffects(unit, "burn");
    if (!burns.length) continue;
    applyImmediateDamage(unit, Math.max(1, applyMitigation(burns.reduce((s, e) => s + e.value, 0), "true", unit)));
  }
}

// ==============================
// ENGINE — PUBLIC
// ==============================

export function runCombatTick(
  inputUnits: CombatUnit[],
  rand: CombatRandom = Math.random,
  now: number = Date.now(),
): CombatTickResult {
  const units = inputUnits.map((unit) => ({
    ...unit,
    effects:     [...(unit.effects     ?? [])],
    dangerZones: [...(unit.dangerZones ?? [])],
    abilities:   (unit.abilities ?? []).map((a) => ({ ...a })),
  }));

  for (const unit of units) purgeExpiredEffects(unit, now);

  const byId         = new Map(units.map((unit) => [unit.id, unit]));
  const events: CombatEvent[] = [];
  const threatTable  = buildThreatTable(units);
  const focusTable: FocusTable     = new Map();
  const teamFocusTable: TeamFocusTable = new Map();
  const attackers    = deterministicShuffle(units, rand);

  // ── Team strategy pass : focus cible + formation + regroup ──
  const clubs = [...new Set(units.map((u) => u.clubId))];
  for (const clubId of clubs) {
    const allies  = units.filter((u) => u.clubId === clubId && u.hp > 0);
    const enemies = units.filter((u) => u.clubId !== clubId && u.hp > 0);
    const focusTarget = chooseTeamFocusTarget(enemies);
    if (!focusTarget) continue;

    teamFocusTable.set(clubId, focusTarget.id);
    const formation = getFormationType(allies, enemies);
    for (const ally of allies) ally.formationType = formation;

    const regroupNow = shouldRegroup(allies, enemies);
    events.push({
      type: "team_call", attackerId: allies[0]?.id ?? clubId, defenderId: focusTarget.id,
      damage: 0, rawDamage: 0, crit: false, skill: "team_ai",
      ability: regroupNow ? "regroup" : "focus_call",
      rangeType: "ranged", damageKind: "true", travelMs: 0, result: "hit",
      splashRadius: 0, splashMultiplier: 0, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [],
      aggroBoost: 0, impactStyle: "impact",
      targetPriority: regroupNow ? "regroup" : "team_focus",
      teamFocusTargetId: focusTarget.id, formationType: formation,
      note: "team_strategy_call",
      replayTag: regroupNow ? "TEAM_REGROUP" : "TEAM_FOCUS",
    });
  }

  for (const attacker of attackers) {
    if (attacker.hp <= 0) { clearCastingState(attacker); continue; }
    if (hasEffect(attacker, "stun")) { clearCastingState(attacker); continue; }
    if (isInDanger(attacker, now)) clearCastingState(attacker);

    const allies  = units.filter((u) => u.clubId === attacker.clubId && u.hp > 0);
    const enemies = units.filter((u) => u.clubId !== attacker.clubId && u.hp > 0);
    if (enemies.length === 0) { clearCastingState(attacker); continue; }

    const nearestEnemy = enemies.reduce((closest, enemy) =>
      distance(attacker, enemy) < distance(attacker, closest) ? enemy : closest,
    );

    const retreating = shouldRetreat(attacker, enemies);
    const kiting     = shouldKite(attacker, nearestEnemy);
    // FIX D : regroup calculé UNE SEULE FOIS (évite double appel shouldRegroup)
    const regroup    = shouldRegroup(allies, enemies);

    const skipAttack =
      (retreating && hpRatio(attacker) < 0.4) ||
      (kiting && distance(attacker, nearestEnemy) < getAttackRange(attacker) * 0.85);

    if (retreating) {
      attacker.status = "retreating";
    } else if (kiting) {
      attacker.status = "kiting";
    } else if (regroup) {
      attacker.status = "regrouping";
    } else if (["retreating","kiting","dodging","regrouping"].includes(attacker.status)) {
      attacker.status = "engaged";
    }

    if (skipAttack) { clearCastingState(attacker); continue; }

    if (shouldInterruptCast(attacker)) {
      events.push({
        type: "cast_interrupt", attackerId: attacker.id, defenderId: attacker.currentTargetId ?? attacker.id,
        damage: 0, rawDamage: 0, crit: false, skill: attacker.skillType, ability: attacker.castingAbility ?? "none",
        rangeType: "ranged", damageKind: "true", travelMs: 0, result: "miss",
        splashRadius: 0, splashMultiplier: 0, chainCount: 0, chainDamageMultiplier: 0, chainTargetIds: [],
        aggroBoost: 0, impactStyle: "impact", targetPriority: "default",
        note: "cast_interrupted", replayTag: "CAST_INTERRUPT",
      });
      clearCastingState(attacker);
    }

    const selection = selectTarget(attacker, enemies, allies, threatTable, focusTable, teamFocusTable, now);
    const selectedTarget = selection.target;
    if (!selectedTarget) { clearCastingState(attacker); continue; }

    const defender = byId.get(selectedTarget.id);
    if (!defender || defender.hp <= 0) { clearCastingState(attacker); continue; }

    if ((attacker.currentTargetId ?? null) !== defender.id) attacker.lastTargetChangeAt = now;

    const moveVec = computeMovement(attacker, defender, enemies, allies, now, byId, events, regroup);
    applyMovement(attacker, moveVec);

    const isMoving = Math.abs(moveVec.x) + Math.abs(moveVec.y) > 0.01;
    const range    = getAttackRange(attacker);

    if (isMoving && isRanged(attacker) && distance(attacker, defender) > range * 0.9) {
      attacker.currentTargetId = defender.id;
      continue;
    }

    attacker.currentTargetId = defender.id;
    const dist = distance(attacker, defender);
    if (dist > range * 1.15) continue;

    const damageKind            = getDamageKind(attacker);
    const ranged                = isRanged(attacker);
    const splashRadius          = getSplashRadius(attacker);
    const splashMultiplier      = getSplashMultiplier(attacker);
    const chainCount            = getChainCount(attacker);
    const chainDamageMultiplier = getChainDamageMultiplier(attacker);
    const chainTargetIds        = buildChainTargetIds(defender, enemies, chainCount);
    const projectileType        = ranged ? getProjectileType(attacker) : undefined;
    const ability               = getAbilityName(attacker);
    const aggroBoost            = computeAggroBoost(attacker);
    const travelMs              = computeTravelMs(attacker, defender);
    const impactStyle           = getImpactStyle(attacker);
    const appliedEffects        = buildAppliedEffects(attacker, now);
    const teamFocusTargetId     = teamFocusTable.get(attacker.clubId) ?? null;

    if (requiresCast(attacker)) {
      const sameTarget = attacker.currentTargetId === defender.id && attacker.castingAbility === ability;
      if (!sameTarget || !attacker.castEndsAt) {
        beginCast(attacker, defender.id, ability, now);
        events.push({
          type: "cast_start", attackerId: attacker.id, defenderId: defender.id,
          damage: 0, rawDamage: 0, crit: false, skill: attacker.skillType, ability,
          rangeType: ranged ? "ranged" : "melee", damageKind, projectileType, travelMs: 0, result: "hit",
          splashRadius, splashMultiplier, chainCount, chainDamageMultiplier, chainTargetIds,
          aggroBoost, impactStyle, targetPriority: selection.priority,
          note: "cast_started", teamFocusTargetId, formationType: attacker.formationType, replayTag: "CAST_START",
        });
        continue;
      }
      if (isCasting(attacker, now)) continue;
      if (!isCastReady(attacker, now)) continue;
    }

    // ── Melee ──
    if (!ranged) {
      const hitChance = computeHitChance(attacker, defender);
      const hit = rand() * 100 < hitChance;
      if (!hit) {
        clearCastingState(attacker);
        events.push({ type: "attack", attackerId: attacker.id, defenderId: defender.id, damage: 0, rawDamage: 0, crit: false, skill: attacker.skillType, ability, rangeType: "melee", damageKind, projectileType, travelMs: 0, result: "miss", splashRadius, splashMultiplier, chainCount, chainDamageMultiplier, chainTargetIds, aggroBoost, impactStyle, targetPriority: selection.priority, note: "attack_missed", teamFocusTargetId, formationType: attacker.formationType, replayTag: "MELEE_MISS" });
        pushThreat(threatTable, defender.id, attacker.id, getThreatModifierForBeingHit(attacker) + Math.round(aggroBoost * 0.5));
        continue;
      }
      const crit            = rollCrit(safeNumber(attacker.critChance, 10), rand);
      const rawDamage       = computeRawDamage(attacker, defender, crit);
      const mitigatedDamage = applyMitigation(rawDamage, damageKind, defender);
      applyImmediateDamage(defender, mitigatedDamage);
      applyImmediateSplash(attacker, defender, enemies, byId, mitigatedDamage, splashRadius, splashMultiplier, threatTable);
      applyImmediateChain(attacker, chainTargetIds, byId, mitigatedDamage, chainDamageMultiplier, threatTable);
      applyEffectsToTarget(defender, appliedEffects);
      clearCastingState(attacker);
      pushThreat(threatTable, defender.id, attacker.id, getThreatModifierForBeingHit(attacker) + aggroBoost + Math.round(mitigatedDamage * 0.2));
      events.push({ type: "attack", attackerId: attacker.id, defenderId: defender.id, damage: mitigatedDamage, rawDamage, crit, skill: attacker.skillType, ability, rangeType: "melee", damageKind, projectileType, travelMs: 0, result: "hit", splashRadius, splashMultiplier, chainCount, chainDamageMultiplier, chainTargetIds, aggroBoost, impactStyle, targetPriority: selection.priority, appliedEffects: appliedEffects.length > 0 ? appliedEffects : undefined, teamFocusTargetId, formationType: attacker.formationType, replayTag: "MELEE_HIT" });
      continue;
    }

    // ── Ranged — skillshot ──
    const crit            = rollCrit(safeNumber(attacker.critChance, 10), rand);
    const rawDamage       = computeRawDamage(attacker, defender, crit);
    const mitigatedDamage = applyMitigation(rawDamage, damageKind, defender);
    const aimPoint        = predictAimPoint(defender, travelMs);
    clearCastingState(attacker);
    pushThreat(threatTable, defender.id, attacker.id, getThreatModifierForBeingHit(attacker) + aggroBoost + Math.round(mitigatedDamage * 0.2));
    events.push({ type: "attack", attackerId: attacker.id, defenderId: defender.id, damage: mitigatedDamage, rawDamage, crit, skill: attacker.skillType, ability, rangeType: "ranged", damageKind, projectileType, travelMs, result: "hit", splashRadius, splashMultiplier, chainCount, chainDamageMultiplier, chainTargetIds, aggroBoost, impactStyle, targetPriority: selection.priority, appliedEffects: appliedEffects.length > 0 ? appliedEffects : undefined, projectileStartLng: safeNumber(attacker.offsetX, 0), projectileStartLat: safeNumber(attacker.offsetY, 0), projectileAimLng: aimPoint.lng, projectileAimLat: aimPoint.lat, targetVelocityX: safeNumber(defender.velocityX, 0), targetVelocityY: safeNumber(defender.velocityY, 0), hitRadius: getProjectileHitRadius(attacker), teamFocusTargetId, formationType: attacker.formationType, replayTag: "RANGED_SHOT" });
  }

  applyBurnDamage(units);
  const deadUnitIds = units.filter((unit) => unit.hp <= 0).map((unit) => unit.id);
  return { units, events, deadUnitIds };
}
