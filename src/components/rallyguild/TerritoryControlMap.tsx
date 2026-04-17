const hexRows = Array.from({ length: 15 }, (_, row) => row);
const hexColumns = Array.from({ length: 22 }, (_, column) => column);

const markers = [
  [210, 160, "#22d3ee"],
  [430, 226, "#fb923c"],
  [575, 244, "#fb923c"],
  [690, 342, "#a855f7"],
  [322, 288, "#22d3ee"],
] as const;

const zoneChips = [
  ["Safe zone", 84, 286, 154, "#22d3ee", "#062f3d"],
  ["Pressure rising", 492, 112, 220, "#fb923c", "#3b1b07"],
  ["Rally needed", 688, 164, 164, "#22d3ee", "#062f3d"],
  ["Contested", 376, 318, 150, "#fb923c", "#32180b"],
] as const;

/**
 * Renders a code-native territory-control map until exact SVG assets exist.
 *
 * Example:
 * ```tsx
 * <TerritoryControlMap />
 * ```
 */
export function TerritoryControlMap() {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[2.3rem] border border-cyan-300/28 bg-[#06111f]/92 p-3 shadow-[0_0_72px_rgba(34,211,238,0.14),inset_0_0_38px_rgba(34,211,238,0.07)] md:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(249,115,22,0.24),transparent_22%),radial-gradient(circle_at_28%_28%,rgba(34,211,238,0.2),transparent_28%),radial-gradient(circle_at_68%_72%,rgba(139,92,246,0.2),transparent_24%)]" />
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
      <div className="absolute inset-x-14 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-200/70 to-transparent" />
      <div className="absolute left-0 top-16 h-48 w-px bg-gradient-to-b from-transparent via-cyan-200/60 to-transparent" />
      <div className="absolute right-0 bottom-16 h-48 w-px bg-gradient-to-b from-transparent via-orange-200/60 to-transparent" />

      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-black/30 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div>
          <div className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-200/70">
            Territory control
          </div>
          <div className="font-display text-xl font-black uppercase text-white">
            RallyGuild War Room
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[0.68rem] font-black uppercase tracking-[0.15em]">
          <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-cyan-100">
            Global pressure 78%
          </span>
          <span className="rounded-full border border-orange-300/25 bg-orange-300/10 px-3 py-1 text-orange-100">
            Rally readiness 92%
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.8rem] border border-cyan-300/18 bg-black/24 p-2 shadow-[inset_0_0_32px_rgba(34,211,238,0.08)]">
        <svg
          viewBox="0 0 900 520"
          className="relative z-10 h-[410px] w-full drop-shadow-[0_0_26px_rgba(34,211,238,0.3)]"
          role="img"
          aria-label="Territory control map"
        >
          <defs>
            <filter id="rgTerritoryGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="rgHotCore" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="13" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="rgCyanZone" x1="0" x2="1">
              <stop offset="0%" stopColor="#0e7490" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.34" />
            </linearGradient>
            <linearGradient id="rgOrangeZone" x1="0" x2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.46" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.82" />
            </linearGradient>
            <linearGradient id="rgVioletZone" x1="0" x2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.46" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.74" />
            </linearGradient>
          </defs>

          <path d="M84 52 H816 L860 96 V424 L816 468 H84 L40 424 V96 Z" fill="rgba(2,6,23,0.18)" stroke="#67e8f9" strokeOpacity="0.28" strokeWidth="2" />
          <path d="M64 82 H244 M656 82 H836 M64 438 H238 M664 438 H836" stroke="#67e8f9" strokeOpacity="0.52" strokeWidth="3" />
          <path d="M36 154 V306 M864 154 V306" stroke="#fb923c" strokeOpacity="0.42" strokeWidth="3" />

          <g opacity="0.2">
            {hexRows.map((row) =>
              hexColumns.map((column) => {
                const x = column * 42 + (row % 2 ? 21 : 0) - 18;
                const y = row * 28 + 44;
                return (
                  <polygon
                    key={`${row}-${column}`}
                    points={`${x},${y} ${x + 18},${y + 10} ${x + 18},${y + 30} ${x},${y + 40} ${x - 18},${y + 30} ${x - 18},${y + 10}`}
                    fill="none"
                    stroke="#67e8f9"
                    strokeWidth="1"
                  />
                );
              }),
            )}
          </g>

          <path d="M94 172 L206 96 L356 118 L424 198 L344 294 L152 272 Z" fill="url(#rgCyanZone)" stroke="#22d3ee" strokeWidth="5" filter="url(#rgTerritoryGlow)" />
          <path d="M302 220 L420 148 L586 164 L684 246 L618 354 L426 362 L300 304 Z" fill="url(#rgOrangeZone)" stroke="#fb923c" strokeWidth="5" filter="url(#rgTerritoryGlow)" />
          <path d="M540 320 L642 246 L800 280 L844 384 L718 452 L564 414 Z" fill="url(#rgVioletZone)" stroke="#a855f7" strokeWidth="5" filter="url(#rgTerritoryGlow)" />
          <path d="M276 330 L344 294 L426 362 L330 410 L232 368 Z" fill="rgba(34,211,238,0.22)" stroke="#22d3ee" strokeWidth="3" filter="url(#rgTerritoryGlow)" />

          <path d="M314 230 C394 206 488 220 574 270" stroke="#fb923c" strokeWidth="3" strokeDasharray="12 10" fill="none" />
          <path d="M220 188 C304 148 394 154 462 198" stroke="#22d3ee" strokeWidth="3" strokeDasharray="8 12" fill="none" />
          <path d="M570 344 C636 314 696 318 764 368" stroke="#a855f7" strokeWidth="3" strokeDasharray="8 12" fill="none" />
          <path d="M456 248 C480 226 512 222 548 244" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="15" fill="none" filter="url(#rgHotCore)" />

          {markers.map(([x, y, color]) => (
            <g key={`${x}-${y}`} filter="url(#rgTerritoryGlow)">
              <circle cx={x} cy={y + 22} r="30" fill={color} opacity="0.13" />
              <circle cx={x} cy={y + 22} r="11" fill={color} />
              <circle cx={x} cy={y + 22} r="4" fill="#ffffff" opacity="0.82" />
            </g>
          ))}

          <text x="154" y="164" fill="#c8fdff" fontSize="31" fontWeight="900" letterSpacing="2">NORTH REALM</text>
          <text x="362" y="264" fill="#fff7ed" fontSize="30" fontWeight="900" letterSpacing="1">CENTRAL ZONE</text>
          <text x="640" y="344" fill="#ede9fe" fontSize="29" fontWeight="900" letterSpacing="1">EAST REACH</text>
          <text x="590" y="410" fill="#ddd6fe" fontSize="24" fontWeight="900" letterSpacing="1">SOUTH SECTOR</text>

          {zoneChips.map(([label, x, y, width, stroke, fill]) => (
            <g key={label}>
              <rect x={x} y={y} width={width} height="42" rx="12" fill={fill} stroke={stroke} strokeWidth="2" />
              <text x={x + 26} y={y + 28} fill={stroke} fontSize="17" fontWeight="900" letterSpacing="1">
                {label.toUpperCase()}
              </text>
            </g>
          ))}

          <g filter="url(#rgHotCore)">
            <circle cx="498" cy="254" r="34" fill="#fb923c" opacity="0.28" />
            <circle cx="498" cy="254" r="10" fill="#fed7aa" />
          </g>
        </svg>
      </div>

      <div className="relative mt-4 grid gap-2 text-[0.68rem] font-black uppercase tracking-[0.14em] sm:grid-cols-3">
        <div className="rounded-2xl border border-cyan-300/18 bg-cyan-300/8 px-3 py-2 text-cyan-100">
          North Realm <span className="text-white">92%</span> control
        </div>
        <div className="rounded-2xl border border-orange-300/22 bg-orange-500/10 px-3 py-2 text-orange-100">
          Central Zone pressure rising
        </div>
        <div className="rounded-2xl border border-violet-300/18 bg-violet-500/10 px-3 py-2 text-violet-100">
          Rival Spire rally needed
        </div>
      </div>
    </div>
  );
}
