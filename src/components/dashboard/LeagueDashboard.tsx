import { Navbar } from "@/components/layout/Navbar";

/**
 * LeagueDashboard
 *
 * Club-first strategic dashboard.
 * Focused on league position, contribution, and competitive pressure.
 * No economy. No challenges. No distractions.
 */
export default function LeagueDashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-body">
      <Navbar />

      {/* Background */}
      <div className="pointer-events-none absolute inset-0 cyber-grid opacity-[0.05]" />
      <div className="pointer-events-none absolute -top-24 left-[-140px] h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-28 right-[-140px] h-[520px] w-[520px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-12 pt-24">
        {/* HERO – Club Position */}
        <div className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Current Season
              </p>
              <h1 className="mt-2 text-3xl font-bold">
                Club Alpha — #3 Overall
              </h1>
              <p className="mt-2 text-muted-foreground">
                12 points behind Club Titan
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Season Ends In</p>
              <p className="mt-2 text-2xl font-semibold">18 days</p>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Personal Contribution */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold">Your Contribution</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Points This Season
                </span>
                <span className="text-xl font-semibold">+84</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rank Inside Club</span>
                <span className="text-xl font-semibold">#2</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Weekly Progress</span>
                <span className="text-xl font-semibold text-primary">
                  +18 pts
                </span>
              </div>
            </div>
          </div>

          {/* Top Club Members */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold">Top Contributors</h2>

            <div className="mt-6 space-y-3">
              <LeaderboardRow rank={1} name="PlayerOne" points={126} />
              <LeaderboardRow rank={2} name="You" points={84} />
              <LeaderboardRow rank={3} name="AcePred" points={72} />
              <LeaderboardRow rank={4} name="Shadow" points={61} />
              <LeaderboardRow rank={5} name="Nova" points={55} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardRow({
  rank,
  name,
  points,
}: {
  rank: number;
  name: string;
  points: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">#{rank}</span>
        <span className="font-medium">{name}</span>
      </div>
      <span className="font-semibold">{points} pts</span>
    </div>
  );
}
