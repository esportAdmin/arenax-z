"use client";

type Player = {
  username: string;
  score: number;
};

interface Props {
  players: Player[];
}

export default function GlobalLeaderboard({ players }: Props) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-4">Global Leaderboard</h2>

      <div className="space-y-2">
        {players.map((p, i) => (
          <div
            key={i}
            className="flex justify-between border-b border-slate-700 pb-2"
          >
            <span>
              {i + 1}. {p.username}
            </span>

            <span className="font-semibold">{p.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
