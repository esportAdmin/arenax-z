import { feedItems } from "./data";

const toneClass = {
  cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
  orange: "border-orange-300/20 bg-orange-500/10 text-orange-200",
  violet: "border-violet-300/20 bg-violet-500/10 text-violet-200",
  emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
};

/**
 * Renders the live event feed under the main war-room surface.
 *
 * Example:
 * ```tsx
 * <WarFeed />
 * ```
 */
export function WarFeed() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/76 p-5 shadow-[0_0_44px_rgba(34,211,238,0.09)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.16),transparent_30%)]" />
      <div className="relative mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-cyan-100/72">
            War feed
          </div>
          <div className="mt-1 font-display text-xl font-black uppercase text-white">
            Live room pulse
          </div>
        </div>
        <span className="flex items-center gap-2 text-sm font-bold text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.75)]" />
          Live
        </span>
      </div>
      <div className="relative space-y-3">
        {feedItems.map(({ icon: Icon, label, time, tone }) => (
          <div
            key={`${time}-${label}`}
            className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.055)]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${toneClass[tone]}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate text-sm font-bold text-slate-200">
                {label}
              </span>
            </div>
            <span className="shrink-0 text-xs text-slate-500">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
