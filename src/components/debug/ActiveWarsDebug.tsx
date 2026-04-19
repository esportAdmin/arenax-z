"use client";

import Link from "next/link";
import { Flame, Shield, Swords } from "lucide-react";
import { useActiveWars } from "@/hooks/useActiveWars";

/**
 * Renders a production-safe live war preview for the landing page.
 *
 * @example
 * <ActiveWarsDebug />
 */
export default function ActiveWarsDebug() {
  const wars = useActiveWars();
  const visibleWars = wars.slice(0, 4);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {visibleWars.length === 0 ? (
        <div className="surface-panel col-span-full overflow-hidden p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="data-pill">War room standby</div>
              <h3 className="mt-3 text-2xl font-display font-bold text-white">
                No active fronts yet
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Create the first rivalry, rally members, and turn the map into a
                reason to come back before the next reset.
              </p>
            </div>
            <Link
              href="/wars"
              className="inline-flex h-11 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/15 px-5 text-sm font-semibold text-cyan-50 shadow-[0_0_26px_rgba(34,211,238,0.12)] transition hover:border-cyan-200/50 hover:bg-cyan-300/20"
            >
              Open war room
            </Link>
          </div>
        </div>
      ) : (
        visibleWars.map((war) => (
          <Link
            key={war.id}
            href="/wars"
            className="surface-panel group relative overflow-hidden p-5 transition hover:border-cyan-300/35 hover:bg-white/[0.06]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent opacity-60" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100">
                  <Flame className="h-3.5 w-3.5" />
                  Active front
                </div>
                <h3 className="mt-4 text-xl font-display font-bold text-white">
                  {war.territory?.name || "Unknown territory"}
                </h3>
              </div>
              <Swords className="h-5 w-5 text-orange-200 transition group-hover:scale-110" />
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-slate-400">
                  <Shield className="h-4 w-4 text-cyan-200" />
                  Challenger
                </span>
                <span className="font-semibold text-white">
                  {war.challenger?.name || "Rally Guild"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400">Defender</span>
                <span className="font-semibold text-white">
                  {war.defender?.name || "Open Rival"}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-orange-300"
                  style={{
                    width: `${Math.min(100, Math.max(12, Number(war.challenger_xp || 0) / 10))}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-500">
                <span>{war.status || "In progress"}</span>
                <span>{Number(war.challenger_xp || 0).toLocaleString("en-US")} XP</span>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
