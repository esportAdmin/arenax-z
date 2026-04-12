"use client";

import { useEffect, useState } from "react";
import { useUnitMovements } from "@/hooks/useUnitMovements";
import { useMoveUnit } from "@/hooks/useMoveUnit";

interface Props {
  clubId: string | null;
  selectedTerritoryId?: string | null;
  selectedUnitId?: string | null;
}

export default function UnitMovementPanel({
  clubId,
  selectedTerritoryId = null,
  selectedUnitId = null,
}: Props) {
  const { units, movements, loading } = useUnitMovements(clubId);
  const { loading: moving, result, moveUnit } = useMoveUnit();

  const [unitId, setUnitId] = useState(selectedUnitId ?? "");
  const [targetTerritoryId, setTargetTerritoryId] = useState(
    selectedTerritoryId ?? "",
  );

  useEffect(() => {
    if (selectedUnitId) {
      setUnitId(selectedUnitId);
    }
  }, [selectedUnitId]);

  useEffect(() => {
    if (selectedTerritoryId) {
      setTargetTerritoryId(selectedTerritoryId);
    }
  }, [selectedTerritoryId]);

  if (!clubId) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/60">
        No club selected
      </div>
    );
  }

  const selectedUnit = units.find((u) => u.id === unitId) ?? null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
      <div className="mb-3 text-sm font-bold text-cyan-300">Unit Command</div>

      {loading ? (
        <div className="text-sm text-white/60">Loading units...</div>
      ) : (
        <>
          <div className="space-y-2">
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full rounded bg-black/40 px-3 py-2 text-sm"
            >
              <option value="">Select unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.unit_type} · power {unit.power} · speed {unit.speed} ·{" "}
                  {unit.status}
                </option>
              ))}
            </select>

            {selectedUnit && (
              <div className="rounded bg-black/30 p-3 text-xs text-white/80">
                <div>Type: {selectedUnit.unit_type}</div>
                <div>Power: {selectedUnit.power}</div>
                <div>Speed: {selectedUnit.speed}</div>
                <div>Status: {selectedUnit.status}</div>
                <div>Territory: {selectedUnit.territory_id}</div>
              </div>
            )}

            <input
              value={targetTerritoryId}
              onChange={(e) => setTargetTerritoryId(e.target.value)}
              placeholder="Target territory UUID"
              className="w-full rounded bg-black/40 px-3 py-2 text-sm"
            />

            <button
              type="button"
              disabled={moving || !unitId || !targetTerritoryId}
              onClick={() => moveUnit(unitId, targetTerritoryId)}
              className="rounded bg-cyan-500 px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {moving ? "Moving..." : "Move Unit"}
            </button>

            {result?.message && (
              <div
                className={`text-xs ${
                  result.success ? "text-green-400" : "text-red-400"
                }`}
              >
                {result.message}
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="mb-2 text-xs font-semibold text-white/70">
              Active Movements
            </div>

            <div className="space-y-2">
              {movements.map((move) => (
                <div
                  key={move.id}
                  className="rounded bg-black/30 px-3 py-2 text-xs text-white/80"
                >
                  <div>
                    {move.unit_id.slice(0, 6)}... · {move.status}
                  </div>
                  <div className="text-white/50">
                    {move.from_territory_id.slice(0, 6)}... →{" "}
                    {move.to_territory_id.slice(0, 6)}...
                  </div>
                </div>
              ))}

              {movements.length === 0 && (
                <div className="text-xs text-white/50">No active movements</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
