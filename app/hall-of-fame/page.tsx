import { createClient } from "@supabase/supabase-js";

type HallOfFameRow = {
  season_name: string;
  rank: number;
  username: string;
  xp: number;
  reward: number;
  created_at: string;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function HallOfFame() {
  const { data } = await supabase.from("hall_of_fame_public").select("*");

  const grouped: Record<string, HallOfFameRow[]> = {};

  data?.forEach((row: HallOfFameRow) => {
    if (!grouped[row.season_name]) {
      grouped[row.season_name] = [];
    }
    grouped[row.season_name].push(row);
  });

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">🏆 Hall of Fame</h1>

      {Object.entries(grouped).map(([season, players]) => (
        <div key={season} className="mb-10">
          <h2 className="text-xl font-semibold mb-4">{season}</h2>

          <div className="grid grid-cols-3 gap-6">
            {players.map((p: HallOfFameRow) => (
              <div
                key={p.username}
                className={`p-6 rounded-xl shadow-md text-center ${
                  p.rank === 1
                    ? "bg-yellow-100"
                    : p.rank === 2
                      ? "bg-gray-100"
                      : "bg-orange-100"
                }`}
              >
                <div className="text-2xl font-bold">
                  {p.rank === 1 && "🥇"}
                  {p.rank === 2 && "🥈"}
                  {p.rank === 3 && "🥉"}
                </div>

                <div className="mt-2 font-semibold">{p.username}</div>
                <div className="text-sm text-gray-600">{p.xp} XP</div>
                <div className="text-sm text-green-600">+{p.reward} Arena</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
