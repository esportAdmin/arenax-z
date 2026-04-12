"use client";

export default function WarProgressBar({ war }: { war: any }) {
  const total = war.challenger_xp + war.defender_xp;

  const challengerPercent =
    total === 0 ? 50 : (war.challenger_xp / total) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span>{war.challenger?.name}</span>

        <span>{war.defender?.name}</span>
      </div>

      <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
        <div
          style={{ width: `${challengerPercent}%` }}
          className="bg-blue-500"
        />

        <div
          style={{ width: `${100 - challengerPercent}%` }}
          className="bg-red-500"
        />
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{war.challenger_xp} XP</span>

        <span>{war.defender_xp} XP</span>
      </div>
    </div>
  );
}
