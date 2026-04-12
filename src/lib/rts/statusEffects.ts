export type StatusEffectType =
  | "stun"
  | "slow"
  | "weaken"
  | "burn"
  | "mark"
  | "shield_break";

export interface StatusEffect {
  id?: string;
  unitId: string;
  type: StatusEffectType;

  value: number;
  durationMs: number;

  appliedAt: number;
  expiresAt: number;

  sourceUnitId?: string;
  stackable?: boolean;
}

export function isEffectActive(effect: StatusEffect, now: number) {
  return effect.expiresAt > now;
}

export function applyEffectModifiers(params: {
  baseDamage: number;
  effects: StatusEffect[];
}): number {
  let damage = params.baseDamage;

  for (const e of params.effects) {
    if (e.type === "weaken") {
      damage *= 1 - e.value;
    }

    if (e.type === "mark") {
      damage *= 1 + e.value;
    }
  }

  return Math.max(1, Math.round(damage));
}

export function hasStun(effects: StatusEffect[]) {
  return effects.some((e) => e.type === "stun");
}

export function getSpeedMultiplier(effects: StatusEffect[]) {
  let mult = 1;

  for (const e of effects) {
    if (e.type === "slow") {
      mult *= 1 - e.value;
    }
  }

  return Math.max(0.2, mult);
}
