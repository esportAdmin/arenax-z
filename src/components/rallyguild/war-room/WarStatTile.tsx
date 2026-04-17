import type { LucideIcon } from "lucide-react";

type StatTileTone = "cyan" | "orange" | "emerald";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  tone: StatTileTone;
  value: string | number;
}

/**
 * Renders a compact metric tile in the war-room hero.
 *
 * Example:
 * ```tsx
 * <StatTile icon={Zap} label="Readiness" value="92%" tone="emerald" />
 * ```
 */
export function StatTile({ icon: Icon, label, tone, value }: StatTileProps) {
  const toneClass = {
    cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    orange: "border-orange-300/20 bg-orange-500/10 text-orange-200",
    emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  }[tone];

  return (
    <div className={`rounded-[1.2rem] border p-4 text-center ${toneClass}`}>
      <Icon className="mx-auto h-5 w-5" />
      <div className="mt-2 font-display text-2xl font-black text-white">
        {value}
      </div>
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
