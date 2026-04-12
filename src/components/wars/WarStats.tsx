interface WarStatsProps {
  liveWars: number;
  totalViewers: number;
}

export default function WarStats({ liveWars, totalViewers }: WarStatsProps) {
  const stats = [
    { label: "Live Wars", value: liveWars.toString(), icon: "⚔️", color: "red" },
    { label: "Total Viewers", value: totalViewers.toLocaleString(), icon: "👁️", color: "orange" },
    { label: "Active Territories", value: "1,245", icon: "🗺️", color: "yellow" },
    { label: "Prize Pool", value: "$2.5M", icon: "💰", color: "green" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-[#0a1628]/80 to-[#0a1628]/40 backdrop-blur-sm border border-red-500/20 rounded-lg p-6 hover:border-red-500/40 transition-all duration-300 group"
        >
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <div className={`text-3xl font-bold text-${stat.color}-400 mb-1`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wide">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
