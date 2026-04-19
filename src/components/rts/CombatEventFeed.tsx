"use client";

import { useEffect, useMemo, useState } from "react";

export interface CombatFeedEvent {
  attackerId: string;
  defenderId: string;
  damage: number;

  rawDamage?: number;
  crit?: boolean;

  result?: "hit" | "miss" | "blocked";

  skill?: string;
  ability?: string;

  rangeType?: "melee" | "ranged";

  damageKind?: "physical" | "magic" | "true";

  projectileType?: string;

  splashRadius?: number;
  splashMultiplier?: number;

  chainCount?: number;
  chainDamageMultiplier?: number;
  chainTargetIds?: string[];

  aggroBoost?: number;
  targetPriority?:
    | "default"
    | "focus_fire"
    | "aggro"
    | "weakest"
    | "closest"
    | "cluster";

  impactStyle?: "impact" | "explosion" | "chain";

  note?: string;
  travelMs?: number;
}

interface FeedEntry extends CombatFeedEvent {
  entryId: string;
  createdAt: number;
}

interface Props {
  events: CombatFeedEvent[];
  maxEntries?: number;
}

function formatLabel(event: CombatFeedEvent) {
  if (event.result === "miss") return "MISS";
  if (event.result === "blocked") return "BLOCK";

  const parts: string[] = [];
  parts.push(String(event.damage ?? 0));

  if (event.crit) parts.push("CRIT");
  if ((event.splashRadius ?? 0) > 0) parts.push("AOE");
  if ((event.chainCount ?? 0) > 0) parts.push("CHAIN");

  if (event.ability && event.ability !== "none") {
    parts.push(event.ability);
  }

  return parts.join(" • ");
}

function buildEntryId(event: CombatFeedEvent, index: number) {
  return [
    event.attackerId,
    event.defenderId,
    event.damage ?? 0,
    event.result ?? "hit",
    event.ability ?? "none",
    event.projectileType ?? "none",
    event.impactStyle ?? "impact",
    index,
    Date.now(),
    Math.random().toString(36).slice(2, 8),
  ].join("-");
}

export default function CombatEventFeed({ events, maxEntries = 24 }: Props) {
  const [feed, setFeed] = useState<FeedEntry[]>([]);

  useEffect(() => {
    if (!events || events.length === 0) return;

    const stamped: FeedEntry[] = events.map((event, index) => ({
      ...event,
      entryId: buildEntryId(event, index),
      createdAt: Date.now(),
    }));

    setFeed((prev) => [...stamped, ...prev].slice(0, maxEntries));
  }, [events, maxEntries]);

  const rendered = useMemo(() => {
    return feed.map((entry) => {
      const toneClass =
        entry.result === "miss"
          ? "text-slate-400"
          : entry.crit
            ? "text-yellow-300"
            : entry.damageKind === "magic"
              ? "text-fuchsia-300"
              : "text-red-400";

      return {
        ...entry,
        toneClass,
        label: formatLabel(entry),
      };
    });
  }, [feed]);

  return (
    <div className="absolute bottom-4 left-4 z-40 w-80 overflow-hidden rounded-xl border border-cyan-400/20 bg-black/80 p-3 text-xs text-white backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-bold text-cyan-300">Combat Feed</div>
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          live
        </div>
      </div>

      <div className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
        {rendered.map((entry) => (
          <div
            key={entry.entryId}
            className="rounded-md border border-white/5 bg-white/5 px-2 py-1.5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className={`font-semibold ${entry.toneClass}`}>
                {entry.label}
              </div>

              <div className="text-[10px] text-white/35">
                {entry.targetPriority ?? "default"}
              </div>
            </div>

            <div className="mt-1 flex items-center justify-between gap-3 text-[10px] text-white/55">
              <div className="truncate">
                {entry.attackerId.slice(0, 4)} → {entry.defenderId.slice(0, 4)}
              </div>

              <div className="truncate text-right">
                {entry.skill ?? "unit"}
                {entry.impactStyle ? ` • ${entry.impactStyle}` : ""}
              </div>
            </div>
          </div>
        ))}

        {rendered.length === 0 && (
          <div className="rounded-md border border-white/5 bg-white/5 px-2 py-3 text-center text-white/40">
            No combat events yet
          </div>
        )}
      </div>
    </div>
  );
}
