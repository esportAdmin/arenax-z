"use client";

import { useMemo } from "react";
import { ArmyUnitLive } from "@/hooks/useArmyUnitsLive";

interface Props {
  selectedUnits: ArmyUnitLive[];
  mode: "move" | "attack" | "hold";
  onModeChange: (mode: "move" | "attack" | "hold") => void;
  formation: "line" | "column";
  onFormationChange: (formation: "line" | "column") => void;
  onAbility: (ability: string) => void;
  abilityCooldowns?: Partial<
    Record<"global_burst" | "global_shield" | "mark_priority" | "execute_wave", number>
  >;
}

function formatCooldown(ms?: number): string | null {
  if (!ms || ms <= 0) return null;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function CommandPanel({
  selectedUnits,
  mode,
  onModeChange,
  formation,
  onFormationChange,
  onAbility,
  abilityCooldowns = {},
}: Props) {
  const totalPower = useMemo(
    () => selectedUnits.reduce((sum, unit) => sum + unit.power, 0),
    [selectedUnits],
  );

  const avgSpeed = useMemo(
    () =>
      selectedUnits.length > 0
        ? Math.round(
            selectedUnits.reduce((sum, unit) => sum + unit.speed, 0) /
              selectedUnits.length,
          )
        : 0,
    [selectedUnits],
  );

  const canCast = selectedUnits.length > 0;

  return (
    <div className="absolute bottom-4 right-4 z-30 w-80 rounded-xl border border-cyan-400/20 bg-black/80 p-4 text-white backdrop-blur">
      <div className="mb-3 text-sm font-bold text-cyan-300">Command Panel</div>

      <div className="mb-4 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded bg-white/5 p-2">
          Units
          <div className="mt-1 font-semibold">{selectedUnits.length}</div>
        </div>

        <div className="rounded bg-white/5 p-2">
          Power
          <div className="mt-1 font-semibold">{totalPower}</div>
        </div>

        <div className="rounded bg-white/5 p-2">
          Speed
          <div className="mt-1 font-semibold">{avgSpeed}</div>
        </div>
      </div>

      <div className="mb-3 text-xs text-white/60">Orders</div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => onModeChange("move")}
          className={`rounded px-3 py-2 text-xs ${
            mode === "move" ? "bg-cyan-500 text-black" : "bg-white/10"
          }`}
        >
          Move
        </button>

        <button
          type="button"
          onClick={() => onModeChange("attack")}
          className={`rounded px-3 py-2 text-xs ${
            mode === "attack" ? "bg-red-500 text-white" : "bg-white/10"
          }`}
        >
          Attack
        </button>

        <button
          type="button"
          onClick={() => onModeChange("hold")}
          className={`rounded px-3 py-2 text-xs ${
            mode === "hold" ? "bg-yellow-500 text-black" : "bg-white/10"
          }`}
        >
          Hold
        </button>
      </div>

      <div className="mb-3 text-xs text-white/60">Formation</div>
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => onFormationChange("line")}
          className={`rounded px-3 py-2 text-xs ${
            formation === "line" ? "bg-cyan-500 text-black" : "bg-white/10"
          }`}
        >
          Line
        </button>

        <button
          type="button"
          onClick={() => onFormationChange("column")}
          className={`rounded px-3 py-2 text-xs ${
            formation === "column" ? "bg-cyan-500 text-black" : "bg-white/10"
          }`}
        >
          Column
        </button>
      </div>

      <div className="mb-3 text-xs text-white/60">Abilities</div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => onAbility("global_burst")}
          disabled={!canCast || !!abilityCooldowns.global_burst}
          className="rounded bg-purple-600 px-3 py-2 font-semibold transition-opacity hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {formatCooldown(abilityCooldowns.global_burst) ?? "Burst"}
        </button>

        <button
          type="button"
          onClick={() => onAbility("global_shield")}
          disabled={!canCast || !!abilityCooldowns.global_shield}
          className="rounded bg-blue-600 px-3 py-2 font-semibold transition-opacity hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {formatCooldown(abilityCooldowns.global_shield) ?? "Shield"}
        </button>

        <button
          type="button"
          onClick={() => onAbility("mark_priority")}
          disabled={!canCast || !!abilityCooldowns.mark_priority}
          className="rounded bg-fuchsia-600 px-3 py-2 font-semibold transition-opacity hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {formatCooldown(abilityCooldowns.mark_priority) ?? "Mark"}
        </button>

        <button
          type="button"
          onClick={() => onAbility("execute_wave")}
          disabled={!canCast || !!abilityCooldowns.execute_wave}
          className="rounded bg-red-600 px-3 py-2 font-semibold transition-opacity hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {formatCooldown(abilityCooldowns.execute_wave) ?? "Execute"}
        </button>
      </div>
    </div>
  );
}
