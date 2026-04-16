"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Clock3,
  Gift,
  Lock,
  LockKeyhole,
  Radio,
  Shield,
  ShieldCheck,
  Swords,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import Navigation from "@/components/landing/Navigation";
import { Button } from "@/components/ui/button";
import { type LiveWar, useLiveWars } from "@/hooks/useLiveWars";

const fallbackFronts: LiveWar[] = [
  {
    territory_id: "north-realm",
    territory_name: "North Realm",
    lat: 52,
    lng: 18,
    gold_income: null,
    energy_income: null,
    upkeep_cost: null,
    capture_progress: 78,
    club_id: null,
    club_name: "Team Alpha",
    club_color: "#22d3ee",
    alliance_id: null,
    alliance_name: null,
    war_id: "fallback-war-1",
    status: "safe zone",
    total_xp: 1560,
  },
  {
    territory_id: "central-zone",
    territory_name: "Central Zone",
    lat: 48,
    lng: 8,
    gold_income: null,
    energy_income: null,
    upkeep_cost: null,
    capture_progress: 85,
    club_id: null,
    club_name: "Club Omega",
    club_color: "#f97316",
    alliance_id: null,
    alliance_name: null,
    war_id: "fallback-war-2",
    status: "pressure rising",
    total_xp: 2240,
  },
  {
    territory_id: "east-reach",
    territory_name: "East Reach",
    lat: 51,
    lng: 31,
    gold_income: null,
    energy_income: null,
    upkeep_cost: null,
    capture_progress: 66,
    club_id: null,
    club_name: "Rally needed",
    club_color: "#f59e0b",
    alliance_id: null,
    alliance_name: null,
    war_id: "fallback-war-3",
    status: "rally needed",
    total_xp: 980,
  },
  {
    territory_id: "south-sector",
    territory_name: "South Sector",
    lat: 42,
    lng: 11,
    gold_income: null,
    energy_income: null,
    upkeep_cost: null,
    capture_progress: 52,
    club_id: null,
    club_name: "Rival Spire",
    club_color: "#8b5cf6",
    alliance_id: null,
    alliance_name: null,
    war_id: "fallback-war-4",
    status: "contested",
    total_xp: 720,
  },
];

const feedItems = [
  ["2 mins ago", "Team Alpha rallied 12 members", "cyan"],
  ["4 mins ago", "North Realm pressure increased", "orange"],
  ["7 mins ago", "Club Omega defended Central Zone", "violet"],
  ["10 mins ago", "New reward tier unlocked", "emerald"],
] as const;

const objectives = [
  ["Capture First Territory", "65%", "Reward:", "Rare Emblem", "In Progress", "View Map", "cyan"],
  ["Defend Current Zone", "90%", "Reward:", "+500 Prestige", "Almost There", "Reinforce", "orange"],
  ["Rally 5 Members", "3/5", "Reward:", "Squad Bonus", "Active", "Invite", "cyan"],
  ["Complete Daily Live Call", "100%", "Reward:", "Voice Boost Badge", "Completed", "Claim Reward", "emerald"],
] as const;

function pressureFor(war: LiveWar, index: number) {
  const raw = war.capture_progress ?? (war.total_xp ? war.total_xp / 28 : 0);
  return Math.min(100, Math.max(index === 0 ? 58 : 34, Math.round(raw)));
}

function HeroBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#040e1c] via-[#071828] to-[#06111f]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(34,211,238,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.4)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute right-0 top-0 h-[28rem] w-[38rem] translate-x-1/4 -translate-y-1/4 rounded-full bg-orange-500/20 blur-[120px]" />
      <div className="absolute right-10 top-8 h-[20rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[90px]" />

      <svg
        viewBox="0 0 900 320"
        className="absolute right-0 top-0 hidden h-full w-[55%] opacity-80 lg:block"
        preserveAspectRatio="xMaxYMid meet"
      >
        <defs>
          <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="heroOrange" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="heroCyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0e7490" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <rect x="120" y="20" width="760" height="280" rx="20" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.35" />
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 14 }).map((__, column) => {
            const x = column * 58 + (row % 2 ? 29 : 0) + 100;
            const y = row * 36 + 30;
            return (
              <polygon
                key={`${row}-${column}`}
                points={`${x},${y} ${x + 22},${y + 12} ${x + 22},${y + 36} ${x},${y + 48} ${x - 22},${y + 36} ${x - 22},${y + 12}`}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="0.8"
                strokeOpacity="0.25"
              />
            );
          }),
        )}
        <path
          d="M460 60 L580 30 L720 80 L740 180 L620 230 L470 200 Z"
          fill="url(#heroOrange)"
          stroke="#fb923c"
          strokeWidth="3"
          filter="url(#heroGlow)"
          opacity="0.7"
        />
        <path
          d="M200 50 L320 20 L400 70 L380 150 L260 170 L180 120 Z"
          fill="url(#heroCyan)"
          stroke="#22d3ee"
          strokeWidth="3"
          filter="url(#heroGlow)"
          opacity="0.65"
        />
        <path d="M380 110 C430 90 450 80 460 60" stroke="#fb923c" strokeWidth="2" strokeDasharray="8 6" fill="none" opacity="0.6" />
        <path d="M380 110 C410 130 440 140 470 140" stroke="#22d3ee" strokeWidth="2" strokeDasharray="6 8" fill="none" opacity="0.5" />
        {[
          [290, 95, "#22d3ee"],
          [560, 130, "#fb923c"],
          [680, 160, "#fb923c"],
          [400, 160, "#22d3ee"],
        ].map(([x, y, color]) => (
          <g key={`${x}-${y}`} filter="url(#heroGlow)">
            <circle cx={x as number} cy={y as number} r="28" fill={color as string} opacity="0.12" />
            <circle cx={x as number} cy={y as number} r="11" fill={color as string} opacity="0.85" />
            <circle cx={x as number} cy={y as number} r="4.5" fill="#ffffff" opacity="0.9" />
          </g>
        ))}
        <text x="230" y="80" fill="#a5f3fc" fontSize="22" fontWeight="900" letterSpacing="2" filter="url(#heroGlow)">NORTH REALM</text>
        <text x="490" y="120" fill="#fed7aa" fontSize="20" fontWeight="900" letterSpacing="1" filter="url(#heroGlow)">CENTRAL ZONE</text>
        <text x="600" y="210" fill="#ede9fe" fontSize="18" fontWeight="900" letterSpacing="1" filter="url(#heroGlow)">EAST REACH</text>
      </svg>
    </div>
  );
}

function TacticalMap() {
  return (
    <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] border border-cyan-300/25 bg-[#071525]/90 p-4 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(249,115,22,0.2),transparent_22%),radial-gradient(circle_at_28%_28%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_68%_72%,rgba(139,92,246,0.18),transparent_24%)]" />
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(34,211,238,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
        <div>
          <div className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-cyan-200/70">
            Territory control
          </div>
          <div className="font-display text-xl font-black text-white">
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

      <svg
        viewBox="0 0 900 470"
        className="relative z-10 h-[360px] w-full drop-shadow-[0_0_24px_rgba(34,211,238,0.28)]"
        role="img"
        aria-label="Territory control map"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cyanZone" x1="0" x2="1">
            <stop offset="0%" stopColor="#0e7490" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.32" />
          </linearGradient>
          <linearGradient id="orangeZone" x1="0" x2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.44" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.78" />
          </linearGradient>
          <linearGradient id="violetZone" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.72" />
          </linearGradient>
        </defs>

        <g opacity="0.22">
          {Array.from({ length: 16 }).map((_, row) =>
            Array.from({ length: 24 }).map((__, column) => {
              const x = column * 42 + (row % 2 ? 21 : 0) - 18;
              const y = row * 28 + 16;
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

        <path
          d="M94 150 L198 88 L337 112 L386 185 L318 262 L152 244 Z"
          fill="url(#cyanZone)"
          stroke="#22d3ee"
          strokeWidth="4"
          filter="url(#glow)"
        />
        <path
          d="M296 202 L410 138 L562 158 L647 236 L588 326 L420 332 L310 278 Z"
          fill="url(#orangeZone)"
          stroke="#fb923c"
          strokeWidth="4"
          filter="url(#glow)"
        />
        <path
          d="M527 292 L634 224 L784 256 L824 358 L708 424 L560 390 Z"
          fill="url(#violetZone)"
          stroke="#a855f7"
          strokeWidth="4"
          filter="url(#glow)"
        />

        <path d="M314 210 C394 192 470 210 548 246" stroke="#fb923c" strokeWidth="3" strokeDasharray="10 10" fill="none" />
        <path d="M220 175 C292 142 372 146 438 184" stroke="#22d3ee" strokeWidth="3" strokeDasharray="8 12" fill="none" />
        <path d="M555 318 C620 288 674 292 744 340" stroke="#a855f7" strokeWidth="3" strokeDasharray="8 12" fill="none" />

        {[
          [210, 160, "#22d3ee"],
          [430, 226, "#fb923c"],
          [575, 244, "#fb923c"],
          [690, 342, "#a855f7"],
          [322, 288, "#22d3ee"],
        ].map(([x, y, color]) => (
          <g key={`${x}-${y}`} filter="url(#glow)">
            <circle cx={x} cy={y} r="26" fill={color as string} opacity="0.12" />
            <circle cx={x} cy={y} r="10" fill={color as string} />
            <circle cx={x} cy={y} r="4" fill="#ffffff" opacity="0.82" />
          </g>
        ))}

        <text x="160" y="150" fill="#c8fdff" fontSize="30" fontWeight="900" letterSpacing="2">
          NORTH REALM
        </text>
        <text x="360" y="248" fill="#fff7ed" fontSize="28" fontWeight="900" letterSpacing="1">
          CENTRAL ZONE
        </text>
        <text x="635" y="326" fill="#ede9fe" fontSize="28" fontWeight="900" letterSpacing="1">
          EAST REACH
        </text>
        <text x="580" y="388" fill="#ddd6fe" fontSize="24" fontWeight="900" letterSpacing="1">
          SOUTH SECTOR
        </text>

        <g>
          <rect x="94" y="286" width="154" height="42" rx="12" fill="#062f3d" stroke="#22d3ee" strokeWidth="2" />
          <text x="124" y="314" fill="#a5f3fc" fontSize="18" fontWeight="900">SAFE ZONE</text>
        </g>
        <g>
          <rect x="494" y="114" width="204" height="46" rx="12" fill="#3b1b07" stroke="#fb923c" strokeWidth="2" />
          <text x="520" y="143" fill="#fed7aa" fontSize="18" fontWeight="900">PRESSURE RISING</text>
        </g>
        <g>
          <rect x="688" y="164" width="154" height="42" rx="12" fill="#062f3d" stroke="#22d3ee" strokeWidth="2" />
          <text x="716" y="192" fill="#a5f3fc" fontSize="18" fontWeight="900">RALLY NEEDED</text>
        </g>
      </svg>
    </div>
  );
}

function ActiveWarCard({
  onOpenMap,
  onRally,
  pressure,
  war,
}: {
  onOpenMap: () => void;
  onRally: () => void;
  pressure: number;
  war: LiveWar;
}) {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-orange-300/30 bg-slate-950/78 p-5 shadow-[0_0_42px_rgba(249,115,22,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.2),transparent_36%)]" />
      <div className="relative space-y-5">
        <div>
          <div className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-orange-200/75">
            Active war card
          </div>
          <h2 className="mt-2 font-display text-3xl font-black text-white">
            Shadow Strike
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Active rivalry: {war.club_name || "Team Alpha"} vs Club Omega
          </p>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-center">
          <div>
            <Shield className="mx-auto h-8 w-8 text-cyan-300" />
            <div className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">Attacker</div>
            <div className="font-black text-cyan-100">{war.club_name || "Team Alpha"}</div>
          </div>
          <div className="font-display text-3xl font-black text-orange-200">VS</div>
          <div>
            <Shield className="mx-auto h-8 w-8 text-orange-300" />
            <div className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">Defender</div>
            <div className="font-black text-orange-100">Club Omega</div>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm font-bold">
            <span className="text-slate-300">Territory contested: {war.territory_name}</span>
            <span className="text-orange-100">{pressure}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-orange-300 to-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.45)]"
              style={{ width: `${pressure}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Time remaining
          </div>
          <div className="mt-1 font-display text-3xl font-black text-white">
            03:45:12
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            className="min-h-12 rounded-xl bg-cyan-300 text-sm font-black uppercase tracking-[0.14em] text-slate-950 hover:bg-cyan-200"
            onClick={onRally}
          >
            Rally members
          </Button>
          <Button
            variant="outline"
            className="min-h-12 rounded-xl border-orange-300/35 bg-orange-500/10 text-sm font-black uppercase tracking-[0.14em] text-orange-100 hover:bg-orange-500/18"
            onClick={onOpenMap}
          >
            Open command room
          </Button>
        </div>
      </div>
    </article>
  );
}

function CommandCenter() {
  return (
    <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
      <div className="rounded-[1.6rem] border border-orange-300/25 bg-orange-500/10 p-5">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-200/80">
          <AlertTriangle className="h-4 w-4" />
          Critical pressure window
        </div>
        <div className="mt-3 font-display text-5xl font-black text-orange-200">
          00:15:30
        </div>
        <div className="mt-4 rounded-xl border border-orange-300/20 bg-black/25 p-3 text-sm font-bold text-orange-100">
          Pressure increasing. Mobilize now.
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-cyan-300/18 bg-white/[0.045] p-5">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          <TrendingUp className="h-4 w-4 text-cyan-300" />
          Top contributors
        </div>
        <div className="mt-4 space-y-3">
          {["CyberBlade", "NeoStrategist", "Ghost_Unit"].map((name, index) => (
            <div key={name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10 text-xs font-black text-cyan-100">
                  {index + 1}
                </div>
                <span className="font-bold text-white">{name}</span>
              </div>
              <span className="text-sm font-black text-cyan-100">
                {1250 - index * 140} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-cyan-300/18 bg-white/[0.045] p-5">
        <div className="flex items-center gap-3">
          <Clock3 className="h-6 w-6 text-cyan-300" />
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Next reset
            </div>
            <div className="mt-1 text-2xl font-black text-white">In 2h 45m</div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.6rem] border border-emerald-300/20 bg-emerald-400/10 p-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Gift className="h-7 w-7 text-emerald-300" />
            <Lock className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-950 text-orange-200" />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-emerald-100/80">
              Reward loop locked
            </div>
            <div className="mt-1 text-sm text-slate-300">85% to unlock next prestige tier</div>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" />
        </div>
      </div>
    </aside>
  );
}

export default function MultiWarView() {
  const router = useRouter();
  const { wars, loading } = useLiveWars();

  const displayedFronts = useMemo(() => {
    const active = wars.filter((war) => war.war_id || war.status || war.total_xp > 0);
    return active.length > 0 ? active.slice(0, 8) : fallbackFronts;
  }, [wars]);

  const activeWar = displayedFronts[0] || fallbackFronts[0];
  const activePressure = pressureFor(activeWar, 0);
  const totalXp = displayedFronts.reduce((sum, war) => sum + (war.total_xp ?? 0), 0);

  return (
    <div className="min-h-screen overflow-hidden bg-[#040b14] text-white">
      <Navigation />
      <main className="relative pb-14 pt-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="absolute left-[-12rem] top-20 h-[36rem] w-[36rem] rounded-full bg-cyan-400/10 blur-[150px]" />
          <div className="absolute right-[-10rem] top-36 h-[34rem] w-[34rem] rounded-full bg-orange-500/12 blur-[160px]" />
        </div>

        <div className="container-arena relative z-10 space-y-6">
          <section className="relative overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-slate-950/72 p-6 shadow-[0_0_70px_rgba(34,211,238,0.08)] md:p-8">
            <HeroBg />
            <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="lg:max-w-[52rem]">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.2em] text-cyan-100">
                  <Radio className="h-3.5 w-3.5" />
                  War room online
                </div>
                <h1 className="mt-5 max-w-4xl font-display text-4xl font-black uppercase leading-none text-white md:text-6xl">
                  Turn rivalry into a daily comeback loop
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                  Create territory pressure, rally members, and make every community action visible before the next reset.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="min-h-12 rounded-xl bg-cyan-300 px-6 text-sm font-black uppercase tracking-[0.14em] text-slate-950 hover:bg-cyan-200"
                    onClick={() => router.push("/live-calls")}
                  >
                    Start first war
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-12 rounded-xl border-orange-300/35 bg-orange-500/10 px-6 text-sm font-black uppercase tracking-[0.14em] text-orange-100 hover:bg-orange-500/18"
                    onClick={() => router.push("/war-map")}
                  >
                    Open war map
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-12 rounded-xl border-cyan-300/20 bg-cyan-300/5 px-6 text-sm font-black uppercase tracking-[0.14em] text-cyan-100 hover:bg-cyan-300/10"
                    onClick={() => router.push("/clubs")}
                  >
                    Rally members
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:w-[430px]">
                <StatTile icon={Swords} label="Fronts" value={displayedFronts.length} tone="orange" />
                <StatTile icon={Trophy} label="Total XP" value={totalXp.toLocaleString("en-US")} tone="cyan" />
                <StatTile icon={Zap} label="Readiness" value="92%" tone="emerald" />
              </div>
            </div>
          </section>

          {loading ? (
            <section className="rounded-[2rem] border border-cyan-300/18 bg-slate-950/70 p-8 text-center text-slate-300">
              Syncing territory pressure...
            </section>
          ) : null}

          <section className="grid gap-5 xl:grid-cols-[0.78fr_1.55fr_0.8fr]">
            <ActiveWarCard
              war={activeWar}
              pressure={activePressure}
              onOpenMap={() => router.push("/war-map")}
              onRally={() => router.push("/clubs")}
            />
            <TacticalMap />
            <CommandCenter />
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.74fr_1.26fr]">
            <div className="rounded-[2rem] border border-cyan-300/18 bg-slate-950/72 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-[0.72rem] font-black uppercase tracking-[0.2em] text-cyan-100">
                  War feed
                </div>
                <span className="flex items-center gap-2 text-sm font-bold text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {feedItems.map(([time, label, tone]) => (
                  <div key={`${time}-${label}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                        tone === "cyan"
                          ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                          : tone === "orange"
                            ? "border-orange-300/20 bg-orange-500/10 text-orange-200"
                            : tone === "violet"
                              ? "border-violet-300/20 bg-violet-500/10 text-violet-200"
                              : "border-emerald-300/20 bg-emerald-400/10 text-emerald-200"
                      }`}>
                        {tone === "cyan" ? (
                          <Shield className="h-4 w-4" />
                        ) : tone === "orange" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : tone === "violet" ? (
                          <Swords className="h-4 w-4" />
                        ) : (
                          <Gift className="h-4 w-4" />
                        )}
                      </span>
                      <span className="truncate text-sm font-bold text-slate-200">{label}</span>
                    </div>
                    <span className="shrink-0 text-xs text-slate-500">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-orange-300/18 bg-slate-950/72 p-5">
              <div className="mb-4 text-[0.72rem] font-black uppercase tracking-[0.2em] text-orange-100">
                War objectives
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {objectives.map(([title, progress, rewardLabel, rewardValue, state, cta, tone]) => (
                  <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="min-h-[44px] text-sm font-black text-white">{title}</div>
                    <div className="mt-3 flex items-center justify-between text-xs font-bold">
                      <span className={tone === "orange" ? "text-orange-200" : tone === "emerald" ? "text-emerald-200" : "text-cyan-200"}>
                        {state}
                      </span>
                      <span className="text-slate-400">{progress}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      <LockKeyhole className="h-3.5 w-3.5 text-cyan-300/80" />
                      <span>{rewardLabel}</span>
                      <span className="font-black text-white">{rewardValue}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${tone === "orange" ? "bg-orange-300" : tone === "emerald" ? "bg-emerald-300" : "bg-cyan-300"}`}
                        style={{ width: progress.endsWith("%") ? progress : "60%" }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 min-h-10 w-full rounded-xl border-white/10 bg-white/[0.04] text-xs font-black uppercase tracking-[0.12em] text-slate-100 hover:bg-white/10"
                      onClick={() => router.push(cta === "View Map" ? "/war-map" : cta === "Invite" ? "/clubs" : "/live-calls")}
                    >
                      {cta}
                    </Button>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-cyan-300/18 bg-slate-950/72 p-4">
            <div className="flex flex-col gap-4 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
                <span className="font-black uppercase tracking-[0.16em] text-cyan-100">
                  Trust strip
                </span>
                <span>Virtual engagement only. No cash value. No financial return.</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Discord/Twitch ready</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Community-first</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Secure data</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Retention focused</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: typeof Swords;
  label: string;
  tone: "cyan" | "orange" | "emerald";
  value: string | number;
}) {
  const toneClass = {
    cyan: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    orange: "border-orange-300/20 bg-orange-500/10 text-orange-200",
    emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  }[tone];

  return (
    <div className={`rounded-[1.2rem] border p-4 text-center ${toneClass}`}>
      <Icon className="mx-auto h-5 w-5" />
      <div className="mt-2 font-display text-2xl font-black text-white">{value}</div>
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
    </div>
  );
}
