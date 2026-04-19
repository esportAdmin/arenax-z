import { Flame, Share2, ShieldCheck, Trophy } from "lucide-react";

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
    return {
      text: "Online",
      tone: "text-emerald-300",
      shell: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    };
  }
  if (status === "in-game") {
    return {
      text: "In Game",
      tone: "text-amber-300",
      shell: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    };
  }
  return {
    text: "Offline",
    tone: "text-slate-400",
    shell: "border-white/10 bg-white/5 text-slate-400",
  };
}

function rankTone(rank: number) {
  if (rank === 1) {
    return "border-amber-300/40 bg-amber-300/[0.15] text-amber-200";
  }
  if (rank === 2) {
    return "border-slate-200/25 bg-slate-200/10 text-slate-100";
  }
  if (rank === 3) {
    return "border-orange-300/30 bg-orange-300/[0.12] text-orange-200";
  }
  return "border-cyan-300/20 bg-cyan-300/10 text-cyan-100";
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
          className="min-h-12 w-full rounded-full border border-warning/25 bg-warning/[0.12] px-5 py-3 text-center text-sm font-black uppercase tracking-[0.12em] text-warning transition-colors hover:bg-warning/[0.18] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500 md:w-auto"
        >
          {hasMore ? "Load more players" : "Full ladder loaded"}
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-cyan-300/14 bg-cyan-300/[0.045] px-4 py-3 text-sm text-slate-300 md:hidden">
        Mobile rank cards show the core signal first. Open desktop for the full
        statistical table.
      </div>

      <div className="grid gap-3 md:hidden">
        {players.map((player, index) => {
          const status = statusLabel(player.status);
          const rank = player.displayRank ?? startRank + index;

          return (
            <article
              key={player.rank}
              className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.2)]"
            >
              <div className="pointer-events-none absolute right-[-3rem] top-[-3rem] h-28 w-28 rounded-full bg-warning/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-sm font-black ${rankTone(rank)}`}>
                      #{rank}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-display text-lg font-black text-white">
                        {player.username}
                      </div>
                      <div className="mt-1 truncate text-sm text-slate-400">
                        {player.club}
                      </div>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${status.shell}`}>
                    {status.text}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
                    <Trophy className="h-4 w-4 text-warning" />
                    <div className="mt-2 text-lg font-black text-white">
                      {player.power.toLocaleString("en-US")}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Power
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    <div className="mt-2 text-lg font-black text-white">
                      {player.winRate}%
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Rate
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/18 p-3">
                    <Flame className="h-4 w-4 text-orange-300" />
                    <div className="mt-2 text-lg font-black text-white">
                      {player.streak}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Streak
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/18 px-3 py-2 text-xs text-slate-400">
                  <span>{player.region}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-cyan-100">
                    <Share2 className="h-3.5 w-3.5" />
                    Shareable rank card
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55 md:block">
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
                    className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.03]"
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
                        <div className="min-w-0">
                          <div className="max-w-[180px] truncate font-semibold text-white">
                            {player.username}
                          </div>
                          <div className="max-w-[180px] truncate text-sm text-slate-400">
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
                      <span className="block max-w-[170px] truncate">{player.club}</span>
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
