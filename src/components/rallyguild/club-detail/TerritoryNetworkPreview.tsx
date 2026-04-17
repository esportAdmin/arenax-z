"use client";

const nodes: Array<[number, number, string]> = [
  [24, 118, "#22d3ee"],
  [116, 82, "#22d3ee"],
  [196, 68, "#facc15"],
  [302, 38, "#22d3ee"],
  [392, 84, "#facc15"],
  [452, 116, "#8b5cf6"],
  [536, 34, "#facc15"],
];

/**
 * Provides a lightweight tactical network preview while the exact map asset is
 * still a human-owned design dependency.
 */
export function TerritoryNetworkPreview() {
  return (
    <div className="mt-6 overflow-hidden rounded-[1.35rem] border border-cyan-300/15 bg-black/25 p-3">
      <svg className="h-36 w-full text-cyan-300" viewBox="0 0 560 180">
        <defs>
          <linearGradient id="club-map-line" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#facc15" />
          </linearGradient>
        </defs>
        <path
          d="M24 118 C96 62 136 94 196 68 S318 28 392 84 488 68 536 34"
          fill="none"
          opacity="0.75"
          stroke="url(#club-map-line)"
          strokeDasharray="8 10"
          strokeWidth="3"
        />
        <path
          d="M70 136 C130 150 210 124 260 142 S368 158 452 116"
          fill="none"
          opacity="0.55"
          stroke="#8b5cf6"
          strokeDasharray="5 9"
          strokeWidth="2"
        />
        {nodes.map(([cx, cy, color]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} fill={`${color}22`} r="12" />
            <circle cx={cx} cy={cy} fill={color} r="5" />
          </g>
        ))}
      </svg>
    </div>
  );
}
