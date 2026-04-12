type Match = {
  id: string;
  team_a: string;
  team_b: string;
};

export default function UpcomingMatches({ matches }: { matches: Match[] }) {
  async function predict(matchId: string, winner: string) {
    await fetch("/api/live-calls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        match_id: matchId,
        predicted_winner: winner,
      }),
    });

    alert("Prediction submitted");
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Matches</h3>

      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between p-4 bg-card/30 rounded-lg"
          >
            <div>
              {match.team_a} vs {match.team_b}
            </div>

            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-blue-600 rounded"
                onClick={() => predict(match.id, match.team_a)}
              >
                {match.team_a}
              </button>

              <button
                className="px-3 py-1 bg-red-600 rounded"
                onClick={() => predict(match.id, match.team_b)}
              >
                {match.team_b}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
