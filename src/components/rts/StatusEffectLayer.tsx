"use client";

import type { ArmyUnitLive } from "@/hooks/useArmyUnitsLive";
import type { StatusEffectType } from "@/lib/rts/combatEngine";

const EFFECT_CONFIG: Record<
  StatusEffectType,
  { icon: string; color: string; label: string }
> = {
  burn: { icon: "🔥", color: "#f97316", label: "Burn" },
  slow: { icon: "❄️", color: "#38bdf8", label: "Slow" },
  stun: { icon: "⚡", color: "#facc15", label: "Stun" },
  weaken: { icon: "💀", color: "#a78bfa", label: "Weaken" },
  mark: { icon: "🎯", color: "#f43f5e", label: "Mark" },
  pull: { icon: "🪝", color: "#60a5fa", label: "Pull" },
};

interface Props {
  units: ArmyUnitLive[];
  projection: (coords: [number, number]) => [number, number];
}

export default function StatusEffectLayer({ units, projection }: Props) {
  const now = Date.now();

  return (
    <>
      {units.map((unit) => {
        if (unit.lat == null || unit.lng == null) return null;

        const activeEffects = (unit.effects ?? []).filter(
          (effect) => effect.expiresAt > now,
        );

        if (activeEffects.length === 0) return null;

        const [x, y] = projection([unit.lng, unit.lat]);

        return (
          <div
            key={`effects-${unit.unit_id}`}
            className="pointer-events-none absolute z-40 flex gap-[2px]"
            style={{
              left: x,
              top: y - 20,
              transform: "translate(-50%, -100%)",
            }}
          >
            {activeEffects.map((effect) => {
              const config = EFFECT_CONFIG[effect.type];
              if (!config) return null;

              return (
                <span
                  key={effect.type}
                  title={config.label}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] shadow-md"
                  style={{
                    backgroundColor: `${config.color}33`,
                    border: `1px solid ${config.color}`,
                  }}
                >
                  {config.icon}
                </span>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
