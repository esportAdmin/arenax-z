import { Eye, Map, Radio, Swords } from "lucide-react";

interface WarStatsProps {
  liveWars: number;
  totalViewers: number;
}

const colorClasses = {
  orange: "text-orange-300 border-orange-300/20 bg-orange-500/10",
  cyan: "text-cyan-300 border-cyan-300/20 bg-cyan-300/10",
  amber: "text-amber-300 border-amber-300/20 bg-amber-300/10",
  emerald: "text-emerald-300 border-emerald-300/20 bg-emerald-400/10",
};

export default function WarStats({ liveWars, totalViewers }: WarStatsProps) {
  const stats = [
    { label: "Live wars", value: liveWars.toString(), icon: Swords, color: colorClasses.orange },
    { label: "Active viewers", value: totalViewers.toLocaleString("en-US"), icon: Eye, color: colorClasses.cyan },
    { label: "Territories tracked", value: "1,245", icon: Map, color: colorClasses.amber },
    { label: "Rally pulse", value: "Live", icon: Radio, color: colorClasses.emerald },
  ];

  return (
    <div className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className={`rounded-[1.25rem] border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${color}`}
        >
          <Icon className="mb-3 h-6 w-6" />
          <div className="font-display text-3xl font-black text-white">
            {value}
          </div>
          <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
