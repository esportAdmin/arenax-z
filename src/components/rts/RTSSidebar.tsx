"use client";

import { useMemo, useState } from "react";
import { ArmyUnitLive } from "@/hooks/useArmyUnitsLive";
import { useUnitMovementsLive } from "@/hooks/useUnitMovementsLive";

import CommandPanel from "./CommandPanel";
import UnitOrdersQueuePanel from "./UnitOrdersQueuePanel";

interface Props {
  units: ArmyUnitLive[];
  selectedUnitIds: string[];
  onSelectUnit: (id: string) => void;
}

export default function RTSSidebar({
  units,
  selectedUnitIds,
  onSelectUnit,
}: Props) {
  const { movements } = useUnitMovementsLive();

  // 🔥 GLOBAL RTS STATE
  const [mode, setMode] = useState<"move" | "attack" | "hold">("move");
  const [formation, setFormation] = useState<"line" | "column">("line");

  const selectedUnits = useMemo(
    () => units.filter((u) => selectedUnitIds.includes(u.unit_id)),
    [units, selectedUnitIds],
  );

  // 🔥 SAFE ACCESS (évite crash si view pas sync)
  function getClubName(unit: ArmyUnitLive) {
    return (unit as any).club_name ?? "Unknown";
  }

  function getUnitType(unit: ArmyUnitLive) {
    return (unit as any).unit_type ?? "unit";
  }

  function getStatus(unit: ArmyUnitLive) {
    return (unit as any).status ?? "idle";
  }

  return (
    <>
      {/* ========================= */}
      {/* LEFT PANEL - UNITS LIST */}
      {/* ========================= */}

      <div className="absolute left-4 top-4 z-30 w-72 rounded-xl border border-white/10 bg-black/80 p-4 text-white backdrop-blur">
        <div className="mb-3 text-sm font-bold text-cyan-300">Units</div>

        <div className="max-h-[300px] space-y-2 overflow-y-auto">
          {units.map((unit) => {
            const selected = selectedUnitIds.includes(unit.unit_id);

            return (
              <div
                key={unit.unit_id}
                onClick={() => onSelectUnit(unit.unit_id)}
                className={`cursor-pointer rounded px-3 py-2 text-xs transition ${
                  selected ? "bg-cyan-500 text-black" : "bg-white/5"
                }`}
              >
                <div className="font-semibold">{getClubName(unit)}</div>

                <div className="text-white/60">
                  {getUnitType(unit)} • {getStatus(unit)}
                </div>

                <div className="mt-1 text-white/70">
                  HP: {unit.hp}/{unit.max_hp}
                </div>
              </div>
            );
          })}

          {units.length === 0 && (
            <div className="text-xs text-white/50">No units</div>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* RIGHT PANEL - COMMAND */}
      {/* ========================= */}

      <CommandPanel
        selectedUnits={selectedUnits}
        mode={mode}
        onModeChange={setMode}
        formation={formation}
        onFormationChange={setFormation}
        onAbility={() => {}}
      />

      {/* ========================= */}
      {/* BOTTOM PANEL - ORDERS */}
      {/* ========================= */}

      <div className="absolute bottom-4 left-4 z-30 w-80">
        <UnitOrdersQueuePanel
          selectedUnits={selectedUnits}
          mode={mode}
          formation={formation}
        />
      </div>

      {/* ========================= */}
      {/* RIGHT PANEL - MOVEMENTS */}
      {/* ========================= */}

      <div className="absolute right-4 top-4 z-30 w-72 rounded-xl border border-white/10 bg-black/80 p-4 text-white backdrop-blur">
        <div className="mb-3 text-sm font-bold text-purple-300">Movements</div>

        <div className="max-h-[300px] space-y-2 overflow-y-auto">
          {movements.map((m) => (
            <div
              key={m.movement_id}
              className="rounded bg-white/5 px-3 py-2 text-xs"
            >
              <div>Unit: {m.unit_id.slice(0, 6)}...</div>

              <div className="text-white/60">
                {(m as any).from_territory_name ?? "?"} →{" "}
                {(m as any).to_territory_name ?? "?"}
              </div>

              {/* ✅ SAFE progress */}
              {typeof (m as any).progress === "number" && (
                <div className="text-white/70">
                  Progress: {Math.round(((m as any).progress ?? 0) * 100)}%
                </div>
              )}
            </div>
          ))}

          {movements.length === 0 && (
            <div className="text-xs text-white/50">No movements</div>
          )}
        </div>
      </div>
    </>
  );
}
