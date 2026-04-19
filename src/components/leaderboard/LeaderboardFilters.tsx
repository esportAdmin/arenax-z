interface LeaderboardFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
}

const categories = [
  { value: "power", label: "Power", description: "Raw signal" },
  { value: "wins", label: "Wins", description: "Momentum" },
  { value: "winrate", label: "Win Rate", description: "Consistency" },
  { value: "kills", label: "Kills", description: "Impact" },
];

const regions = ["all", "global", "americas", "europe", "asia", "oceania", "arctic"];
const timeframes = [
  { value: "all-time", label: "All Time" },
  { value: "monthly", label: "This Month" },
  { value: "weekly", label: "This Week" },
  { value: "daily", label: "Today" },
];

export default function LeaderboardFilters({
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  selectedTimeframe,
  setSelectedTimeframe,
}: LeaderboardFiltersProps) {
  return (
    <div className="mb-10 section-shell">
      <div className="grid gap-6 xl:grid-cols-[1fr_auto_auto] xl:items-end">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Ranking lens
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`min-h-[74px] rounded-2xl border px-3 py-3.5 text-center transition-all sm:px-4 sm:py-4 sm:text-left ${
                  selectedCategory === category.value
                    ? "border-warning/35 bg-warning/[0.14] text-white shadow-[0_0_24px_rgba(251,191,36,0.16)]"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-white/18"
                }`}
              >
                <div className="text-sm font-semibold uppercase tracking-[0.14em]">
                  {category.label}
                </div>
                <div
                  className={`mt-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    selectedCategory === category.value
                      ? "text-warning"
                      : "text-slate-500"
                  }`}
                >
                  {category.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Region
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`min-h-10 rounded-full px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] transition-all sm:px-4 sm:text-xs ${
                  selectedRegion === region
                    ? "bg-primary text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.24)]"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/18"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Timeframe
          </div>
          <div className="flex flex-wrap gap-2">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`min-h-10 rounded-full px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] transition-all sm:px-4 sm:text-xs ${
                  selectedTimeframe === timeframe.value
                    ? "bg-white text-slate-950"
                    : "border border-white/10 bg-white/5 text-slate-300 hover:border-white/18"
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
