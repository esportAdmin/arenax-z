"use client";

import { useActiveWars } from "@/hooks/useActiveWars";

export default function ActiveWarsDebug() {
  const wars = useActiveWars();

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: 20, marginBottom: 10 }}>Active Wars (DEBUG)</h2>

      {wars.length === 0 && <p>No active wars</p>}

      {wars.map((war) => (
        <div
          key={war.id}
          style={{
            border: "1px solid #444",
            padding: 10,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <p>
            <strong>Territory:</strong> {war.territory?.name || "Unknown"}
          </p>

          <p>
            <strong>Clubs:</strong> {war.challenger?.name || "?"} vs{" "}
            {war.defender?.name || "?"}
          </p>

          <p>
            <strong>XP:</strong> {war.challenger_xp} - {war.defender_xp}
          </p>

          <p>
            <strong>Status:</strong> {war.status}
          </p>
        </div>
      ))}
    </div>
  );
}
