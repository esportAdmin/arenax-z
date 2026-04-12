interface Player {
  rank: number;
  displayRank?: number;
  username: string;
  avatar: string;
  level: number;
  power: number;
  wins: number;
  winRate: number;
  club: string;
  status: string;
  streak: number;
}

interface TopThreePodiumProps {
  topThree: Player[];
}

function podiumTone(rank: number) {
  if (rank === 1) {
    return "from-amber-400/28 to-yellow-500/8 border-amber-400/35 text-amber-200";
  }
  if (rank === 2) {
    return "from-slate-200/18 to-slate-400/6 border-slate-300/22 text-slate-100";
  }
  return "from-orange-500/22 to-amber-700/6 border-orange-400/25 text-orange-200";
}

export default function TopThreePodium({ topThree }: TopThreePodiumProps) {
  const [second, first, third] = [topThree[1], topThree[0], topThree[2]];

  const renderCard = (player: Player | undefined, order: number) => {
    if (!player) {
      return null;
    }

    const displayRank = player.displayRank ?? player.rank;
    const tone = podiumTone(displayRank);
    const height =
      displayRank === 1
        ? "min-h-[320px] sm:min-h-[350px]"
        : displayRank === 2
          ? "min-h-[290px] sm:min-h-[320px]"
          : "min-h-[280px] sm:min-h-[300px]";

    return (
      <div
        className={`flex ${order === 2 ? "order-1" : order === 1 ? "order-2" : "order-3"} w-full max-w-full sm:max-w-[290px] flex-col justify-end`}
      >
        <div
          className={`surface-panel hero-sheen bg-gradient-to-br ${tone} ${height} flex flex-col justify-between p-4 sm:p-5`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300/80">
                Rank {displayRank}
              </div>
              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-xl font-display font-black text-white">
                {player.avatar}
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Level {player.level}
            </div>
          </div>

          <div>
            <div className="text-xl font-display font-bold text-white sm:text-2xl">
              {player.username}
            </div>
            <div className="mt-1 text-sm text-slate-300">{player.club}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Power
              </div>
              <div className="mt-2 text-xl font-display font-bold text-white">
                {player.power.toLocaleString("en-US")}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Win Rate
              </div>
              <div className="mt-2 text-xl font-display font-bold text-white">
                {player.winRate}%
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Wins
              </div>
              <div className="mt-2 text-xl font-display font-bold text-white">
                {player.wins.toLocaleString("en-US")}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
              <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                Streak
              </div>
              <div className="mt-2 text-xl font-display font-bold text-white">
                {player.streak}
              </div>
            </div>
          </div>

          <div className="text-xs uppercase tracking-[0.16em] text-slate-300/80">
            {player.status === "online" && "Online now"}
            {player.status === "in-game" && "In game"}
            {player.status !== "online" && player.status !== "in-game" && "Offline"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-12">
      <div className="mb-6">
        <div className="data-pill">Top 3 champions</div>
        <h2 className="mt-3 text-3xl font-display font-bold text-white">
          The players everyone else is chasing
        </h2>
      </div>

      <div className="flex flex-col gap-4 sm:flex-wrap sm:items-end sm:justify-center sm:gap-5 xl:flex-nowrap">
        {renderCard(second, 1)}
        {renderCard(first, 2)}
        {renderCard(third, 3)}
      </div>
    </div>
  );
}
