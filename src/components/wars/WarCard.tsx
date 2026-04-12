interface War {
  id: number;
  title: string;
  region: string;
  territory: string;
  attacker: {
    name: string;
    emblem: string;
    power: number;
    troops: number;
  };
  defender: {
    name: string;
    emblem: string;
    power: number;
    troops: number;
  };
  status: string;
  startTime: string;
  duration: string;
  prize: string;
  intensity: string;
  viewers: number;
  winner?: string;
}

interface WarCardProps {
  war: War;
  index: number;
}

export default function WarCard({ war, index }: WarCardProps) {
  const getStatusStyles = (status: string) => {
    const styles: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      live: {
        bg: "from-red-500/20 to-red-500/5",
        border: "border-red-500/40 hover:border-red-500",
        text: "text-red-500",
        badge: "🔴 LIVE",
      },
      upcoming: {
        bg: "from-yellow-500/20 to-yellow-500/5",
        border: "border-yellow-500/40 hover:border-yellow-500",
        text: "text-yellow-500",
        badge: "🟡 UPCOMING",
      },
      ended: {
        bg: "from-gray-500/20 to-gray-500/5",
        border: "border-gray-500/40 hover:border-gray-500",
        text: "text-gray-500",
        badge: "⚫ ENDED",
      },
    };
    return styles[status] || styles.live;
  };

  const getIntensityColor = (intensity: string) => {
    const colors: Record<string, string> = {
      extreme: "text-red-500",
      high: "text-orange-500",
      medium: "text-yellow-500",
    };
    return colors[intensity] || colors.medium;
  };

  const statusStyles = getStatusStyles(war.status);

  return (
    <div
      className={`group relative bg-gradient-to-br ${statusStyles.bg} backdrop-blur-sm border ${statusStyles.border} rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: "fadeInUp 0.6s ease-out forwards",
      }}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`bg-black/60 backdrop-blur-sm ${statusStyles.text} px-3 py-1 rounded-full text-xs font-bold border ${statusStyles.border}`}>
          {statusStyles.badge}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* War Title */}
        <h3 className={`text-xl font-bold mb-2 ${statusStyles.text}`}>
          {war.title}
        </h3>

        {/* Region & Territory */}
        <div className="text-sm text-gray-400 mb-4">
          <span className="font-medium">{war.region}</span> • {war.territory}
        </div>

        {/* VS Section */}
        <div className="mb-6">
          {/* Attacker */}
          <div className="flex items-center justify-between mb-3 p-3 bg-black/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{war.attacker.emblem}</div>
              <div>
                <div className="text-sm font-bold text-white">{war.attacker.name}</div>
                <div className="text-xs text-gray-500">Attacker</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-cyan-400">{war.attacker.power.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{war.attacker.troops.toLocaleString()} troops</div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="text-center my-2">
            <span className="text-2xl font-bold text-red-500">⚔️ VS ⚔️</span>
          </div>

          {/* Defender */}
          <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{war.defender.emblem}</div>
              <div>
                <div className="text-sm font-bold text-white">{war.defender.name}</div>
                <div className="text-xs text-gray-500">Defender</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-purple-400">{war.defender.power.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{war.defender.troops.toLocaleString()} troops</div>
            </div>
          </div>
        </div>

        {/* War Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Time</div>
            <div className="text-sm font-bold text-white">{war.startTime}</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Duration</div>
            <div className="text-sm font-bold text-white">{war.duration}</div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Intensity</div>
            <div className={`text-sm font-bold uppercase ${getIntensityColor(war.intensity)}`}>
              {war.intensity}
            </div>
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Prize</div>
            <div className="text-sm font-bold text-green-400">{war.prize}</div>
          </div>
        </div>

        {/* Viewers (Live Only) */}
        {war.status === "live" && (
          <div className="mb-4 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg py-2">
            <span className="text-red-500">👁️</span>
            <span className="text-sm font-bold text-red-500">
              {war.viewers.toLocaleString()} watching
            </span>
          </div>
        )}

        {/* Winner (Ended Only) */}
        {war.status === "ended" && war.winner && (
          <div className="mb-4 flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg py-2">
            <span className="text-green-500">🏆</span>
            <span className="text-sm font-bold text-green-500">
              {war.winner === "attacker" ? war.attacker.name : war.defender.name} WON
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`w-full py-3 border ${statusStyles.border} ${statusStyles.text} rounded-lg font-bold uppercase tracking-wide hover:bg-opacity-20 transition-all duration-300 group-hover:shadow-lg`}
        >
          {war.status === "live" && "⚔️ WATCH LIVE"}
          {war.status === "upcoming" && "📅 SET REMINDER"}
          {war.status === "ended" && "📊 VIEW RESULTS"}
        </button>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}
