"use client";

import { Marker } from "react-simple-maps";
import { useState } from "react";

interface WarMarkerProps {
  war: {
    id: string;
    territory_name: string;
    coordinates: [number, number];
    attacker_club: string;
    defender_club: string;
    status: string;
  };
}

export default function WarMarker({ war }: WarMarkerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Marker
      coordinates={war.coordinates}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Pulsing war indicator */}
      <g className="cursor-pointer">
        {/* Outer pulse ring */}
        <circle r={12} fill="#ff0055" opacity={0.3} className="animate-ping" />

        {/* Main marker */}
        <circle
          r={6}
          fill="#ff0055"
          stroke="#fff"
          strokeWidth={2}
          className="hover:r-8 transition-all"
        />

        {/* Crossed swords icon */}
        <text
          textAnchor="middle"
          y={2}
          fontSize={8}
          fill="#fff"
          style={{ pointerEvents: "none" }}
        >
          ⚔️
        </text>
      </g>

      {/* Tooltip */}
      {showTooltip && (
        <g>
          <foreignObject x={15} y={-30} width={200} height={80}>
            <div className="bg-black/90 backdrop-blur-md border border-cyan-400 rounded-lg p-3 text-xs">
              <div className="text-cyan-400 font-bold mb-1">
                {war.territory_name}
              </div>
              <div className="text-gray-300">
                <span className="text-red-400">{war.attacker_club}</span>
                {" vs "}
                <span className="text-blue-400">{war.defender_club}</span>
              </div>
              <div className="text-yellow-400 text-[10px] mt-1">
                🔥 LIVE BATTLE
              </div>
            </div>
          </foreignObject>
        </g>
      )}
    </Marker>
  );
}
