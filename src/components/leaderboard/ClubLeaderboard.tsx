"use client";

import { useClubLeaderboard } from "@/hooks/useClubLeaderboard";

export default function ClubLeaderboard() {
  const clubs = useClubLeaderboard();

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-bold mb-4">Global Club Leaderboard</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th>#</th>
            <th>Club</th>
            <th>Territories</th>
            <th>Capitals</th>
            <th>Wins</th>
          </tr>
        </thead>

        <tbody>
          {clubs.map((club, index) => (
            <tr key={club.club_id} className="border-t border-slate-700">
              <td>{index + 1}</td>

              <td className="font-semibold">{club.club_name}</td>

              <td>{club.territories}</td>

              <td>{club.capitals}</td>

              <td>{club.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
