import { Trophy, Sparkles } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  PremiumCardShell,
  PremiumBluePillButton,
  PremiumMiniAvatar,
  premiumColors,
} from "@/components/dashboard/premium/PremiumPrimitives";

type ChallengeMatch = {
  matchup: string;
  game: string;
  initials: string;
  done?: boolean;
};

/**
 * PremiumDailyChallengeCard
 *
 * Right panel — daily challenge.
 *
 * @example
 * <PremiumDailyChallengeCard />
 */
export default function PremiumDailyChallengeCard() {
  const matches: ChallengeMatch[] = [
    { matchup: "Team A vs Team B", game: "CS:GO", initials: "TA" },
    { matchup: "Team C vs Team D", game: "Valorant", initials: "TC" },
    { matchup: "Team E vs Team F", game: "Overwatch", initials: "TE" },
  ];

  return (
    <PremiumCardShell className="h-[766px]">
      <div className="h-full px-8 pt-8 pb-7">
        {/* Header */}
        <div>
          <div className="text-3xl font-display font-bold text-white">Daily Ritual</div>
          <div className="mt-1 text-sm text-white/45">Earn 500 Points + 10 XP</div>
        </div>

        {/* Matches */}
        <div className="mt-6 space-y-4">
          {matches.map((m, idx) => (
            <div
              key={m.matchup}
              className="rounded-3xl border border-[rgba(231,200,118,0.25)] bg-[linear-gradient(180deg,rgba(231,200,118,0.10)_0%,rgba(0,0,0,0.0)_80%)] px-5 py-4"
              style={idx === 1 ? { opacity: 0.86 } : undefined}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-full border border-[rgba(231,200,118,0.25)] p-[3px]">
                    <PremiumMiniAvatar initials={m.initials} className="h-11 w-11" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white/85">{m.matchup}</div>
                    <div
                      className="mt-1 inline-flex items-center rounded-full border border-[rgba(231,200,118,0.25)] px-3 py-1 text-sm font-semibold"
                      style={{ color: premiumColors.gold, background: "rgba(231,200,118,0.06)" }}
                    >
                      {m.game}
                    </div>
                  </div>
                </div>

                <PremiumBluePillButton
                  href={`/live-calls?from=daily_ritual&matchup=${encodeURIComponent(
                    m.matchup,
                  )}&game=${encodeURIComponent(m.game)}`}
                >
                  Rally
                </PremiumBluePillButton>
              </div>
            </div>
          ))}
        </div>

        {/* Progress line */}
        <div className="mt-8">
          <div className="h-[8px] w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full shadow-[0_0_22px_rgba(74,169,255,0.40)]"
              style={{
                width: "100%",
                background: `linear-gradient(90deg, ${premiumColors.blueDeep} 0%, ${premiumColors.blue} 100%)`,
              }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between text-base font-semibold text-white/55">
            <div>3/3 <span className="font-medium">Completed</span></div>
            <div>Reset: 03:45:22</div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-8 rounded-3xl border border-[rgba(231,200,118,0.25)] bg-[rgba(231,200,118,0.06)] px-6 py-5">
          <div className="flex items-center justify-between gap-6">
            <Button
              asChild
              type="button"
              className="h-12 rounded-full px-8 font-semibold"
              style={{
                background: `linear-gradient(180deg, rgba(231,200,118,0.35) 0%, rgba(184,138,34,0.18) 100%)`,
                border: "1px solid rgba(231,200,118,0.35)",
                color: "#1a1405",
              }}
            >
              <Link href="/live-calls?from=daily_ritual_complete">Complete Ritual</Link>
            </Button>

            <div className="flex-1">
              <div className="flex items-center gap-2 text-base font-semibold" style={{ color: premiumColors.gold }}>
                <Trophy className="h-5 w-5" color={premiumColors.gold} />
                Earn 500 Points
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white/70">
                <Sparkles className="h-4 w-4" color={premiumColors.gold} />
                +10 XP
              </div>
            </div>

            <div className="text-3xl">🏆</div>
          </div>
        </div>
      </div>
    </PremiumCardShell>
  );
}
