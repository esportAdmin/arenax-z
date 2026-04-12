interface Player {
  rank: number;
  displayRank?: number;
  username: string;
  avatar: string;
  level: number;
  power: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  territories: number;
  club: string;
  region: string;
  status: string;
  streak: number;
}

interface LeaderboardTableProps {
  players: Player[];
  startRank: number;
  totalPlayers: number;
  visibleCount: number;
  hasMore: boolean;
  onLoadMore: () => void;
}

function statusLabel(status: string) {
  if (status === "online") {
    return { text: "Online", tone: "text-emerald-300" };
  }
  if (status === "in-game") {
    return { text: "In Game", tone: "text-amber-300" };
  }
  return { text: "Offline", tone: "text-slate-400" };
}

export default function LeaderboardTable({
  players,
  startRank,
  totalPlayers,
  visibleCount,
  hasMore,
  onLoadMore,
}: LeaderboardTableProps) {
  return (
    <div className="section-shell">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Full rankings
          </div>
          <h3 className="mt-2 text-2xl font-display font-bold text-white">
            Every position players care about
          </h3>
          <div className="mt-2 text-sm text-slate-400">
            Showing {visibleCount} of {totalPlayers} challengers below the podium.
          </div>
        </div>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={!hasMore}
          className="w-full rounded-full border border-warning/20 bg-warning/10 px-5 py-3 text-sm font-semibold text-warning transition-colors hover:bg-warning/14 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500 md:w-auto"
        >
          {hasMore ? "Load more players" : "Full ladder loaded"}
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 md:hidden">
        Swipe horizontally to inspect the full ladder. The mobile view keeps the full data table intact without flattening the ranking signal.
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px]">
            <thead className="border-b border-white/10 bg-white/5 text-left text-[11px] uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-5 py-4">Rank</th>
                <th className="px-5 py-4">Player</th>
                <th className="px-5 py-4">Level</th>
                <th className="px-5 py-4">Power</th>
                <th className="px-5 py-4">W/L</th>
                <th className="px-5 py-4">Win Rate</th>
                <th className="px-5 py-4">Kills</th>
                <th className="px-5 py-4">Territories</th>
                <th className="px-5 py-4">Club</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                const status = statusLabel(player.status);
                return (
                  <tr
                    key={player.rank}
                    className="border-b border-white/6 transition-colors hover:bg-white/[0.03]"
                    style={{
                      animationDelay: `${index * 0.04}s`,
                      animation: "fade-in 0.35s ease-out forwards",
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-display font-bold text-white">
                        #{player.displayRank ?? startRank + index}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                          {player.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {player.username}
                          </div>
                          <div className="text-sm text-slate-400">
                            {player.region}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                        {player.level}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-base font-display font-bold text-white">
                      {player.power.toLocaleString("en-US")}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-emerald-300">
                        {player.wins}
                      </span>
                      <span className="mx-1 text-slate-500">/</span>
                      <span className="font-semibold text-rose-300">
                        {player.losses}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/8">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                            style={{ width: `${player.winRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-emerald-300">
                          {player.winRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-200">
                      {player.kills.toLocaleString("en-US")}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-200">
                      {player.territories}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300">
                      {player.club}
                    </td>
                    <td className={`px-5 py-4 text-sm font-semibold ${status.tone}`}>
                      {status.text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
