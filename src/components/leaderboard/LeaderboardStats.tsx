import { Gamepad2, Gem, Sword, Users } from "lucide-react";

const stats = [
  { label: "Total Players", value: "450,000+", icon: Users, tone: "from-amber-400/22 to-yellow-500/6" },
  { label: "Active Today", value: "125,847", icon: Gamepad2, tone: "from-emerald-400/20 to-lime-500/6" },
  { label: "Total Matches", value: "8.9M+", icon: Sword, tone: "from-orange-400/22 to-rose-500/6" },
  { label: "Reward Vault", value: "12.5M ARENA", icon: Gem, tone: "from-cyan-400/22 to-sky-500/6" },
];

export default function LeaderboardStats() {
  return (
    <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className={`surface-panel hero-sheen bg-gradient-to-br ${tone} p-4 sm:p-5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {label}
            </span>
            <Icon className="h-4 w-4 text-white/80" />
          </div>
          <div className="mt-4 text-2xl font-display font-bold text-white sm:text-3xl">
            {value}
          </div>
        </div>
      ))}
    </div>
  );
}
