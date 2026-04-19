"use client";

import { useMemo, useState } from "react";
import { useGlobalWarMap, Territory } from "@/hooks/useGlobalWarMap";
import { useTerritoryConnections } from "@/hooks/useTerritoryConnections";
import { useMyClub } from "@/hooks/useMyClub";
import { useActiveWars, ActiveWar } from "@/hooks/useActiveWars";
import { useWarProgress } from "@/hooks/useWarProgress";
import { useAttackableTerritories } from "@/hooks/useAttackableTerritories";

function WarProgressPanel({ war }: { war: ActiveWar }) {
  const { attackerXp, defenderXp } = useWarProgress(
    war.id,
    war.challenger?.id ?? "",
    war.defender?.id ?? "",
  );

  const total = attackerXp + defenderXp;
  const attackerPercent = total === 0 ? 50 : (attackerXp / total) * 100;
  const defenderPercent = total === 0 ? 50 : (defenderXp / total) * 100;

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-semibold text-white">Siege Progress</div>

      <div className="flex justify-between text-xs text-slate-300">
        <span>Attacker: {attackerXp} XP</span>
        <span>Defender: {defenderXp} XP</span>
      </div>

      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
        <div
          className="bg-orange-500 h-full transition-all duration-300"
          style={{ width: `${attackerPercent}%` }}
        />
        <div
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${defenderPercent}%` }}
        />
      </div>

      <div className="text-xs text-slate-400">
        War ID: <span className="font-mono">{war.id.slice(0, 8)}...</span>
      </div>
    </div>
  );
}

export default function EuropeWarMap() {
  const { territories, recentCapture } = useGlobalWarMap();
  const connections = useTerritoryConnections();
  const myClubId = useMyClub();
  const wars = useActiveWars();
  const attackableRows = useAttackableTerritories(myClubId ?? undefined);

  const [selected, setSelected] = useState<Territory | null>(null);

  const attackable = useMemo(
    () => attackableRows.map((t) => t.territory_id),
    [attackableRows],
  );

  function getWar(territoryId: string) {
    return wars.find((w) => w.territory?.id === territoryId);
  }

  const frontlines = useMemo(() => {
    return connections.map((c: any) => {
      const a = territories.find((t) => t.id === c.territory_a);
      const b = territories.find((t) => t.id === c.territory_b);

      if (!a || !b) return { ...c, frontline: false };

      const isFrontline =
        (!!a.controlling_club_id &&
          !!b.controlling_club_id &&
          a.controlling_club_id !== b.controlling_club_id) ||
        attackable.includes(a.id) ||
        attackable.includes(b.id);

      return { ...c, frontline: isFrontline };
    });
  }, [connections, territories, attackable]);

  function getColor(t: Territory) {
    if (t.controlling_club_id === myClubId) return "#3b82f6";
    if (attackable.includes(t.id)) return "#ef4444";
    if (t.controlling_club_id) return "#9ca3af";
    return "#6b7280";
  }

  async function invade() {
    if (!selected || !myClubId) return;

    const res = await fetch("/api/territories/invade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: myClubId,
        territoryId: selected.id,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
    } else {
      alert("War started!");
    }
  }

  const selectedWar = selected ? getWar(selected.id) : undefined;

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="relative w-full h-[540px] bg-slate-900 rounded-xl overflow-hidden">
        <style jsx>{`
          @keyframes frontlineFlow {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -20;
            }
          }

          .frontline {
            stroke: #ef4444;
            stroke-width: 3;
            stroke-dasharray: 8 6;
            animation: frontlineFlow 1s linear infinite;
          }

          @keyframes siegePulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.6);
              opacity: 0.4;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .siege-ring {
            animation: siegePulse 1.5s infinite;
            border: 2px solid red;
            border-radius: 50%;
          }
        `}</style>

        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {frontlines.map((c: any) => {
            const a = territories.find((t) => t.id === c.territory_a);
            const b = territories.find((t) => t.id === c.territory_b);

            if (!a || !b) return null;

            return (
              <line
                key={c.id}
                x1={a.map_x ?? 0}
                y1={a.map_y ?? 0}
                x2={b.map_x ?? 0}
                y2={b.map_y ?? 0}
                className={c.frontline ? "frontline" : ""}
                stroke={c.frontline ? undefined : "#475569"}
                strokeWidth={c.frontline ? undefined : 2}
              />
            );
          })}
        </svg>

        {territories.map((t: Territory) => {
          const captured = recentCapture === t.id;
          const war = getWar(t.id);
          const isAttackable = attackable.includes(t.id);

          return (
            <div
              key={t.id}
              onClick={() => setSelected(t)}
              style={{
                position: "absolute",
                left: t.map_x ?? 0,
                top: t.map_y ?? 0,
                transform: "translate(-50%,-50%)",
              }}
              className="cursor-pointer"
            >
              <div className="relative flex flex-col items-center">
                {captured && (
                  <div
                    className="absolute w-8 h-8 rounded-full border-2 border-orange-400 animate-ping"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  />
                )}

                {war && (
                  <>
                    <div
                      className="siege-ring absolute w-10 h-10"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%,-50%)",
                      }}
                    />
                    <div
                      className="absolute text-red-400 text-xs font-bold"
                      style={{
                        left: "50%",
                        top: "-8px",
                        transform: "translateX(-50%)",
                      }}
                    >
                      ⚔
                    </div>
                  </>
                )}

                {isAttackable && !war && (
                  <div
                    className="absolute w-8 h-8 rounded-full border border-red-400 opacity-70 animate-pulse"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  />
                )}

                <div
                  className="w-5 h-5 rounded-full border border-white"
                  style={{ background: getColor(t) }}
                />

                <div className="text-xs text-white mt-1 text-center">
                  {t.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        {selected ? (
          <>
            <h2 className="text-xl font-bold">{selected.name}</h2>

            <p className="text-sm text-muted-foreground">
              Controlled by: {selected.controlling_club?.name ?? selected.clubs?.name ?? "Unclaimed"}
            </p>

            {attackable.includes(selected.id) && !selectedWar && (
              <div className="mt-3 text-xs text-red-400">Frontline target</div>
            )}

            {selectedWar && <WarProgressPanel war={selectedWar} />}

            {attackable.includes(selected.id) && !selectedWar && (
              <button
                onClick={invade}
                className="mt-4 bg-orange-500 px-4 py-2 rounded-lg text-white hover:bg-orange-600"
              >
                Invade Territory
              </button>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">Select a territory</p>
        )}
      </div>
    </div>
  );
}
