import { Globe, Medal, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  PremiumCardShell,
  PremiumMiniAvatar,
  premiumColors,
} from "@/components/dashboard/premium/PremiumPrimitives";

type LeaderboardEntry = {
  rank: number;
  name: string;
  score: number;
  accuracy: number;
  challenges: number;
  highlight?: boolean;
};

function getRankBadgeStyle(rank: number) {
  if (rank === 1) {
    return {
      className: "",
      style: {
        background:
          "linear-gradient(180deg, rgba(231,200,118,0.35) 0%, rgba(184,138,34,0.18) 100%)",
        border: "1px solid rgba(231,200,118,0.35)",
        color: premiumColors.gold,
      },
    };
  }

  if (rank === 2) {
    return {
      className: "",
      style: {
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 100%)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "rgba(255,255,255,0.88)",
      },
    };
  }

  if (rank === 3) {
    return {
      className: "",
      style: {
        background:
          "linear-gradient(180deg, rgba(255,146,64,0.22) 0%, rgba(255,146,64,0.10) 100%)",
        border: "1px solid rgba(255,146,64,0.22)",
        color: "rgba(255,255,255,0.86)",
      },
    };
  }

  return {
    className: "bg-white/10",
    style: { color: "rgba(255,255,255,0.75)" },
  };
}

export default function PremiumLeaderboardCard() {
  const entries: LeaderboardEntry[] = [
    {
      rank: 1,
      name: "EsportsPro123",
      score: 8450,
      accuracy: 72,
      challenges: 128,
      highlight: true,
    },
    {
      rank: 2,
      name: "Duastatarianic",
      score: 8000,
      accuracy: 82,
      challenges: 128,
    },
    { rank: 3, name: "Kaviamamyj", score: 7800, accuracy: 80, challenges: 130 },
    { rank: 4, name: "Roporunt86", score: 7500, accuracy: 73, challenges: 120 },
    { rank: 5, name: "Narlovajfanew", score: 7400, accuracy: 68, challenges: 98 },
    { rank: 6, name: "GreatReouk_", score: 7300, accuracy: 52, challenges: 96 },
    { rank: 8, name: "Rowhteos", score: 7200, accuracy: 34, challenges: 64 },
    { rank: 9, name: "NsbeTeam", score: 7000, accuracy: 39, challenges: 48 },
    { rank: 10, name: "EsportsPro123", score: 7000, accuracy: 24, challenges: 18 },
  ];

  return (
    <PremiumCardShell className="h-[766px]">
      <div className="h-full px-8 pt-8 pb-7">
        <div>
          <div className="text-3xl font-display font-bold text-white">
            Global Leaderboard
          </div>
          <div className="mt-1 text-sm text-white/45">Top 100 Players</div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-[78px_minmax(220px,1fr)_120px_120px_90px] items-center gap-2 px-5 py-3 text-sm font-semibold text-white/55">
                <div>Rank</div>
                <div>Player</div>
                <div className="text-center">Score</div>
                <div className="text-center">Accuracy</div>
                <div className="text-center">Challenges</div>
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="max-h-[520px] overflow-y-auto">
                {entries.map((entry, index) => {
                  const badge = getRankBadgeStyle(entry.rank);
                  const href = `/profile?user=${encodeURIComponent(entry.name)}`;
                  const rowClassName =
                    `${index < entries.length - 1 ? "border-b border-white/10 " : ""}` +
                    (entry.highlight
                      ? "px-5 py-3 ring-1 ring-[rgba(231,200,118,0.35)] bg-[linear-gradient(90deg,rgba(231,200,118,0.14)_0%,rgba(0,0,0,0)_65%)]"
                      : "px-5 py-3");

                  return (
                    <Link
                      key={`${entry.rank}-${entry.name}`}
                      href={href}
                      className={`${rowClassName} block transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60`}
                    >
                      <div className="grid grid-cols-[78px_minmax(220px,1fr)_120px_120px_90px] items-center gap-2">
                        <div className="flex items-center">
                          <div
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${badge.className}`}
                            style={badge.style}
                          >
                            <span className="text-sm font-bold">{entry.rank}</span>
                          </div>
                        </div>

                        <div className="flex min-w-0 items-center gap-3">
                          <PremiumMiniAvatar
                            initials={entry.name.slice(0, 2).toUpperCase()}
                          />
                          <div className="min-w-0">
                            <div
                              className={
                                (entry.highlight
                                  ? "font-semibold"
                                  : "font-medium text-white/80") + " truncate"
                              }
                              style={
                                entry.highlight
                                  ? { color: premiumColors.gold }
                                  : undefined
                              }
                              title={entry.name}
                            >
                              {entry.name}
                            </div>
                          </div>
                        </div>

                        <div className="text-center text-lg font-semibold text-white/80">
                          {entry.score.toLocaleString("en-US")}
                        </div>

                        <div
                          className="text-center text-lg font-semibold"
                          style={
                            entry.highlight
                              ? { color: premiumColors.gold }
                              : { color: "rgba(255,255,255,0.70)" }
                          }
                        >
                          {entry.accuracy}%
                        </div>

                        <div className="text-center text-lg font-semibold text-white/70">
                          {entry.challenges}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-4">
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 rounded-2xl border border-blue-400/25 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-blue-400/40 hover:bg-blue-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Medal className="h-4 w-4" color={premiumColors.blue} />
              #1 in the U.S. <span className="ml-1">🇺🇸</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center gap-2 rounded-2xl border border-[rgba(231,200,118,0.25)] bg-[rgba(231,200,118,0.10)] px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-[rgba(231,200,118,0.40)] hover:bg-[rgba(231,200,118,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <Globe className="h-4 w-4" color={premiumColors.gold} />
              #42 Global
            </Link>
          </div>
          <Link
            href="/leaderboard"
            className="flex items-center gap-2 rounded-2xl border border-purple-400/25 bg-purple-500/10 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-purple-400/40 hover:bg-purple-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <Sparkles className="h-4 w-4" color={premiumColors.purple} />
            Top 0.42%
          </Link>
        </div>
      </div>
    </PremiumCardShell>
  );
}
