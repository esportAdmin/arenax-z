import { Award, Check, Crown, TrendingUp } from "lucide-react";
import Link from "next/link";
import {
  PremiumAvatarRing,
  PremiumCardShell,
  PremiumGoldPill,
  PremiumMetricTile,
  PremiumRingProgress,
  PremiumRibbonBadge,
  premiumColors,
} from "@/components/dashboard/premium/PremiumPrimitives";

type PlayerSummary = {
  rankGlobal: number;
  population: number;
  name: string;
  tierLabel: string;
  totalScore: number;
  signalRate: number;
  challenges: number;
  levelLabel: string;
  levelProgress: number;
  badges: Array<{ label: string; icon: "crown" | "award" }>;
};

export default function PremiumPlayerCard() {
  const data: PlayerSummary = {
    rankGlobal: 42,
    population: 10_000,
    name: "EsportsPro123",
    tierLabel: "Professional",
    totalScore: 8450,
    signalRate: 72,
    challenges: 128,
    levelLabel: "Level 2",
    levelProgress: 25,
    badges: [
      { label: "Top 100", icon: "crown" },
      { label: "Consistent", icon: "award" },
    ],
  };

  return (
    <PremiumCardShell className="h-[766px]">
      <div className="relative h-full px-8 pt-8 pb-7">
        <PremiumRibbonBadge />

        <div className="flex items-end gap-2 font-display">
          <div className="text-[44px] font-black tracking-tight text-white">
            #{data.rankGlobal}
          </div>
          <div className="pb-[10px] text-2xl font-bold text-white/35">
            / {data.population.toLocaleString("en-US")}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/profile"
            className="group inline-flex flex-col items-center justify-center rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <PremiumAvatarRing
              initials="EP"
              className="transition-transform group-hover:scale-[1.02]"
            />
            <div className="mt-6 text-3xl font-display font-bold text-white underline-offset-4 group-hover:underline">
              {data.name}
            </div>
          </Link>
          <div className="mt-3">
            <PremiumGoldPill>{data.tierLabel}</PremiumGoldPill>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-4">
          <PremiumMetricTile
            label="Total Score:"
            value={data.totalScore.toLocaleString("en-US")}
            icon={<TrendingUp className="h-5 w-5" />}
            href="/leaderboard"
          />
          <PremiumRingProgress
            label="Signal Rate"
            value={data.signalRate}
            color="#7ED8A5"
            href="/live-calls"
          />
          <PremiumMetricTile
            label="Challenges:"
            value={data.challenges.toLocaleString("en-US")}
            icon={<Check className="h-5 w-5" />}
            href="/rewards"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-white/85">
              {data.levelLabel}
            </div>
            <div
              className="text-lg font-semibold"
              style={{ color: premiumColors.blue }}
            >
              {data.levelProgress}%
            </div>
          </div>
          <div className="mt-3 h-[10px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full shadow-[0_0_18px_rgba(74,169,255,0.35)]"
              style={{
                width: `${data.levelProgress}%`,
                background: `linear-gradient(90deg, ${premiumColors.blue} 0%, ${premiumColors.blueDeep} 100%)`,
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          {data.badges.map((badge) => (
            <Link
              key={badge.label}
              href={badge.icon === "crown" ? "/leaderboard" : "/profile"}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-white/20 hover:bg-white/[0.10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              {badge.icon === "crown" ? (
                <Crown className="h-4 w-4" color={premiumColors.gold} />
              ) : (
                <Award className="h-4 w-4" color={premiumColors.gold} />
              )}
              {badge.label}
            </Link>
          ))}
        </div>
      </div>
    </PremiumCardShell>
  );
}
