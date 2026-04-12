"use client";

import { useMemo, useState } from "react";
import { ArmyUnitLive } from "@/hooks/useArmyUnitsLive";
import { useUnitOrders } from "@/hooks/useUnitOrders";

interface Props {
  selectedUnits: ArmyUnitLive[];
  targetTerritoryId?: string | null;

  // 🔥 AJOUT
  mode: "move" | "attack" | "hold";
  formation: "line" | "column";
}

export default function UnitOrdersQueuePanel({
  selectedUnits,
  targetTerritoryId = null,
  mode,
  formation,
}: Props) {
  const [targetId, setTargetId] = useState(targetTerritoryId ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const unitIds = useMemo(
    () => selectedUnits.map((unit) => unit.unit_id),
    [selectedUnits],
  );

  const { orders } = useUnitOrders(unitIds);

  async function queueOrders() {
    if (!targetId || selectedUnits.length === 0) return;

    try {
      setLoading(true);
      setMessage(null);

      for (const unit of selectedUnits) {
        const response = await fetch("/api/units/queue-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            unitId: unit.unit_id,
            targetTerritoryId: targetId,

            // 🔥 CRITIQUE (propagation formation + mode)
            commandMode: mode,
            formation,
          }),
        });

        const json = await response.json();

        if (!response.ok || !json?.success) {
          throw new Error(json?.message ?? "Failed to queue order");
        }
      }

      setMessage("Orders queued");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white">
      <div className="mb-3 text-sm font-bold text-cyan-300">Orders Queue</div>

      <div className="mb-3 text-xs text-white/70">
        Selected units: {selectedUnits.length}
      </div>

      <input
        value={targetId}
        onChange={(e) => setTargetId(e.target.value)}
        placeholder="Target territory UUID"
        className="mb-3 w-full rounded bg-black/40 px-3 py-2 text-sm"
      />

      <button
        type="button"
        onClick={queueOrders}
        disabled={loading || selectedUnits.length === 0 || !targetId}
        className="rounded bg-cyan-500 px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
      >
        {loading ? "Queueing..." : "Queue Orders"}
      </button>

      {message && <div className="mt-3 text-xs text-white/70">{message}</div>}

      <div className="mt-4 border-t border-white/10 pt-4">
        <div className="mb-2 text-xs font-semibold text-white/70">
          Current Queue
        </div>

        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded bg-black/30 px-3 py-2 text-xs text-white/80"
            >
              <div>Unit: {order.unit_id.slice(0, 6)}...</div>
              <div>Target: {order.target_territory_id.slice(0, 6)}...</div>
              <div>Status: {order.status}</div>
              <div>Position: {order.position}</div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="text-xs text-white/50">No queued orders</div>
          )}
        </div>
      </div>
    </div>
  );
}
