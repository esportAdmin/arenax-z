import { ArrowRight } from "lucide-react";

import { NeonButton } from "@/components/rallyguild/NeonButton";

import type { DirectoryClub } from "./data";

const toneClass = {
  blue: "border-blue-300/35 shadow-[0_0_30px_rgba(96,165,250,0.15)]",
  cyan: "border-cyan-300/45 shadow-[0_0_34px_rgba(34,211,238,0.2)]",
  gold: "border-amber-300/45 shadow-[0_0_34px_rgba(251,191,36,0.18)]",
  red: "border-rose-400/45 shadow-[0_0_34px_rgba(244,63,94,0.18)]",
  slate: "border-slate-300/35 shadow-[0_0_28px_rgba(148,163,184,0.14)]",
  violet: "border-violet-300/45 shadow-[0_0_34px_rgba(168,85,247,0.2)]",
};

const iconClass = {
  blue: "text-blue-300 bg-blue-400/12 border-blue-300/24",
  cyan: "text-cyan-200 bg-cyan-300/12 border-cyan-300/24",
  gold: "text-amber-200 bg-amber-400/12 border-amber-300/24",
  red: "text-rose-200 bg-rose-400/12 border-rose-300/24",
  slate: "text-slate-200 bg-slate-400/10 border-slate-300/20",
  violet: "text-violet-200 bg-violet-400/12 border-violet-300/24",
};

/**
 * Renders one premium club directory card.
 *
 * Example:
 * ```tsx
 * <ClubDirectoryCard club={club} />
 * ```
 */
export function ClubDirectoryCard({ club }: { club: DirectoryClub }) {
  const Icon = club.icon;
  const joinable = club.status === "Recruiting";

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.65rem] border bg-slate-950/76 p-4 transition-transform hover:-translate-y-1 ${toneClass[club.tone]}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.13),transparent_32%),radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.12),transparent_34%)] opacity-80" />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${iconClass[club.tone]}`}>
            <Icon className="h-9 w-9" />
          </div>
          <div className="rounded-bl-2xl rounded-tr-2xl border border-white/12 bg-white/[0.055] px-3 py-1 text-xs font-black text-white">
            #{club.rank}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-black uppercase text-white">
            {club.name}
          </h2>
          <span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] ${
            joinable
              ? "bg-emerald-400/14 text-emerald-200"
              : club.status === "Full"
                ? "bg-rose-400/14 text-rose-200"
                : "bg-amber-400/14 text-amber-200"
          }`}>
            {club.status}
          </span>
        </div>

        <p className="mt-2 min-h-10 text-sm leading-5 text-slate-300">{club.slogan}</p>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            ["Members", club.members],
            ["Territories", club.territories],
            ["Power", "98.5K"],
            ["Read Rate", club.readRate],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.055] p-2 text-center">
              <div className="font-display text-sm font-black text-white">{value}</div>
              <div className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.08em] text-slate-500">
                {label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">
            {club.region}
          </span>
          <NeonButton className="min-h-10 px-4" tone={joinable ? "cyan" : "ghost"}>
            {joinable ? "Join Club" : "View Details"}
            <ArrowRight className="h-3.5 w-3.5" />
          </NeonButton>
        </div>
      </div>
    </article>
  );
}
