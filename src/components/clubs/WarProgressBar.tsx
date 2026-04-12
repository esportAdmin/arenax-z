"use client";

interface Props {
  war: any;
}

export function WarProgressBar({ war }: Props) {
  if (!war) return null;

  const challengerXP = war.challenger_xp || 0;
  const defenderXP = war.defender_xp || 0;

  const total = challengerXP + defenderXP || 1;

  const challengerPercent = Math.round((challengerXP / total) * 100);
  const defenderPercent = 100 - challengerPercent;

  return (
    <div className="glass-card p-6 mt-4">
      <div className="font-bold mb-4">War Progress</div>

      {/* CHALLENGER */}

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>{war.challenger_id}</span>
          <span>{challengerXP.toLocaleString()} XP</span>
        </div>

        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500"
            style={{ width: `${challengerPercent}%` }}
          />
        </div>
      </div>

      {/* DEFENDER */}

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>{war.defender_id}</span>
          <span>{defenderXP.toLocaleString()} XP</span>
        </div>

        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${defenderPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
