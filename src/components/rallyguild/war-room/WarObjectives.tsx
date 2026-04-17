import { LockKeyhole } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";

import { objectives } from "./data";

interface WarObjectivesProps {
  onRoute: (href: string) => void;
}

/**
 * Renders the objective strip with reward and comeback-loop actions.
 *
 * Example:
 * ```tsx
 * <WarObjectives onRoute={(href) => router.push(href)} />
 * ```
 */
export function WarObjectives({ onRoute }: WarObjectivesProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-orange-300/22 bg-slate-950/76 p-5 shadow-[0_0_46px_rgba(249,115,22,0.1)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(34,211,238,0.14),transparent_28%),radial-gradient(circle_at_92%_100%,rgba(249,115,22,0.16),transparent_32%)]" />
      <div className="relative mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-orange-100/72">
            War objectives
          </div>
          <div className="mt-1 font-display text-2xl font-black uppercase text-white">
            Mission strip
          </div>
        </div>
        <div className="rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-[0.68rem] font-black uppercase tracking-[0.16em] text-cyan-100">
          4 active loops
        </div>
      </div>

      <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {objectives.map((item) => (
          <article
            key={item.title}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform hover:-translate-y-0.5"
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 ${
                item.tone === "orange"
                  ? "bg-orange-300"
                  : item.tone === "emerald"
                    ? "bg-emerald-300"
                    : "bg-cyan-300"
              } opacity-80`}
            />
            <div className="min-h-[44px] pr-6 text-sm font-black text-white">
              {item.title}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold">
              <span className={item.tone === "orange" ? "text-orange-200" : item.tone === "emerald" ? "text-emerald-200" : "text-cyan-200"}>
                {item.state}
              </span>
              <span className="text-slate-400">{item.progress}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <LockKeyhole className="h-3.5 w-3.5 text-cyan-300/80" />
              <span>{item.rewardLabel}</span>
              <span className="font-black text-white">{item.rewardValue}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full shadow-[0_0_12px_currentColor] ${item.tone === "orange" ? "bg-orange-300 text-orange-300" : item.tone === "emerald" ? "bg-emerald-300 text-emerald-300" : "bg-cyan-300 text-cyan-300"}`}
                style={{ width: item.progress.endsWith("%") ? item.progress : "60%" }}
              />
            </div>
            <NeonButton
              className="mt-4 min-h-10 w-full"
              onClick={() => {
                const href =
                  item.cta === "View Map"
                    ? "/war-map"
                    : item.cta === "Invite"
                      ? "/clubs"
                      : "/live-calls";
                onRoute(href);
              }}
              tone="ghost"
            >
              {item.cta}
            </NeonButton>
          </article>
        ))}
      </div>
    </div>
  );
}
