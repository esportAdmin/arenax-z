"use client";

import { useState, useEffect } from "react";
import { useGlobalWarMap } from "@/hooks/useGlobalWarMap";
import { useActiveWars } from "@/hooks/useActiveWars";
import dynamic from "next/dynamic";

/* =========================
   TYPES
========================= */

type Territory = {
  id: string;
  name?: string;
  map_x: number | null;
  map_y: number | null;
  controlling_club_id?: string | null;
  clubs?: {
    name: string;
  } | null;
};

/* =========================
   DYNAMIC IMPORT (TYPÉ)
========================= */

const WorldMapSvg = dynamic<{
  territories: Territory[];
  onSelect: (t: Territory) => void;
}>(() => import("./WorldMapSvg").then((mod) => mod.default as any), {
  ssr: false,
});

/* =========================
   COMPONENT
========================= */

export default function GlobalWarMap() {
  const { territories } = useGlobalWarMap();
  const wars = useActiveWars();

  const [selected, setSelected] = useState<Territory | null>(null);

  /* =========================
     DEBUG (CRITIQUE)
  ========================= */

  useEffect(() => {
    console.log("🗺 TERRITORIES:", territories);
  }, [territories]);

  useEffect(() => {
    console.log("⚔ WARS:", wars);
  }, [wars]);

  const selectedWar = selected
    ? wars.find((w) => w.territory?.id === selected.id)
    : null;

  const totalTerritories = territories.length;
  const claimedTerritories = territories.filter(
    (t) => t.controlling_club_id,
  ).length;
  const unclaimedTerritories = totalTerritories - claimedTerritories;

  return (
    <div className="flex flex-col gap-6">
      {/* DEBUG VISUEL */}
      <div style={{ color: "yellow", fontSize: "12px" }}>
        DEBUG → territories: {territories.length} | wars: {wars.length}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Territories", value: totalTerritories, color: "#22d3ee" },
          { label: "Controlled", value: claimedTerritories, color: "#3b82f6" },
          {
            label: "Unclaimed",
            value: unclaimedTerritories,
            color: "#6b7280",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "rgba(8,15,30,0.8)",
              border: `1px solid ${stat.color}30`,
              borderRadius: 8,
              padding: "12px 16px",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAP */}
        <div
          className="lg:col-span-2"
          style={{
            background: "rgba(4,8,20,0.95)",
            border: "1px solid rgba(0,217,255,0.15)",
            borderRadius: 12,
          }}
        >
          {/* 🔥 FIX HEIGHT */}
          <div
            style={{
              width: "100%",
              height: "500px",
              border: "1px dashed red", // DEBUG VISUEL
            }}
          >
            <WorldMapSvg
              territories={territories}
              onSelect={(t: Territory) => setSelected(t)}
            />
          </div>
        </div>

        {/* PANEL */}
        <div
          style={{
            background: "rgba(6,12,28,0.95)",
            border: "1px solid rgba(0,217,255,0.15)",
            borderRadius: 12,
            padding: 20,
            minHeight: 500,
          }}
        >
          {selected ? (
            <>
              <h2 style={{ color: "#22d3ee" }}>{selected.name ?? "UNKNOWN"}</h2>

              <div>
                <strong>Controlled by:</strong>{" "}
                {selected.clubs?.name ?? "Unclaimed"}
              </div>

              {selectedWar && (
                <div
                  style={{
                    background: "rgba(255,59,59,0.1)",
                    border: "1px solid red",
                    padding: 10,
                    borderRadius: 8,
                    marginTop: 10,
                  }}
                >
                  <div style={{ color: "#ff3b3b", fontWeight: "bold" }}>
                    ⚔ Active War
                  </div>

                  <div>
                    {selectedWar.challenger?.name} vs{" "}
                    {selectedWar.defender?.name}
                  </div>

                  <div>
                    {selectedWar.challenger_xp} - {selectedWar.defender_xp} XP
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelected(null)}
                style={{ marginTop: 10 }}
              >
                Close
              </button>
            </>
          ) : (
            <div style={{ opacity: 0.5 }}>Click a territory</div>
          )}
        </div>
      </div>
    </div>
  );
}
