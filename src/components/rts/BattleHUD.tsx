"use client";

import { useEffect, useState } from "react";

interface Props {
  territoryId: string;
}

export default function BattleHUD({ territoryId }: Props) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/battle/${territoryId}`)
      .then((r) => r.json())
      .then(setData);
  }, [territoryId]);

  if (!data.length) return null;

  return (
    <div className="absolute bottom-4 left-4 bg-black/80 p-4 rounded text-white w-72">
      <div className="text-cyan-300 font-bold mb-2">Battle</div>

      {data.map((team) => (
        <div key={team.club_id} className="mb-2">
          <div className="text-xs">{team.club_name}</div>

          <div className="h-2 bg-white/10 rounded mt-1">
            <div
              className="h-full bg-red-500"
              style={{ width: `${team.power}%` }}
            />
          </div>

          <div className="text-[10px] mt-1">
            Units: {team.units} | Power: {team.power}
          </div>
        </div>
      ))}
    </div>
  );
}
