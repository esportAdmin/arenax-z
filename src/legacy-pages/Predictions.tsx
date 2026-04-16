import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Flame,
  Gauge,
  LockKeyhole,
  Mic2,
  Radio,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users,
} from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { DailyChallengeModal } from "@/components/engagement/DailyChallengeModal";
import { Button } from "@/components/ui/button";
import { TeamLogo } from "@/components/ui/team-logo";
import { useAuth } from "@/contexts/AuthContext";
import { useArenaBalance } from "@/hooks/useArenaBalance";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { type Match, useMatches } from "@/hooks/useMatches";
import { useLiveCalls } from "@/hooks/useLiveCalls";
import { getHoursFromNow, getNextUtcMidnight } from "@/lib/countdown";

type GameFilter = "all" | "lol" | "cs2" | "valorant" | "dota2" | "rl" | "pubg" | "cod" | "r6";
type StatusFilter = "all" | "live" | "upcoming" | "finished";

const gameFilters: { id: GameFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "valorant", label: "Valorant" },
  { id: "lol", label: "LoL" },
  { id: "cs2", label: "CS2" },
  { id: "dota2", label: "Dota 2" },
  { id: "rl", label: "Rocket League" },
  { id: "pubg", label: "PUBG" },
  { id: "cod", label: "CoD" },
  { id: "r6", label: "R6" },
];

const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All calls" },
  { id: "live", label: "Live now" },
  { id: "upcoming", label: "Upcoming" },
  { id: "finished", label: "Completed" },
];

const pulseMembers = [
  ["CyberNinja99", "+120", "bg-cyan-300"],
  ["PixelQueen", "+85", "bg-violet-300"],
  ["NeroStrike", "+42", "bg-orange-300"],
] as const;

const recentCalls = [
  ["Today", "Daily ritual", "+250 XP", "Victory"],
  ["Yesterday", "Weekend raid", "+180 XP", "Reached"],
  ["2 days ago", "Community pulse", "+95 XP", "Completed"],
  ["3 days ago", "Return call", "+120 XP", "Reached"],
] as const;

function gameMatches(match: Match, gameFilter: GameFilter) {
  if (gameFilter === "all") return true;
  const map: Record<GameFilter, string[]> = {
    all: [],
    lol: ["league of legends", "lol"],
    cs2: ["cs2", "counter-strike", "cs:go", "csgo"],
    valorant: ["valorant"],
    dota2: ["dota 2", "dota2"],
    rl: ["rocket league"],
    pubg: ["pubg"],
    cod: ["call of duty", "cod"],
    r6: ["rainbow six", "r6"],
  };
  return map[gameFilter].some((name) => match.game.toLowerCase().includes(name));
}

function statusMatches(match: Match, statusFilter: StatusFilter) {
  if (statusFilter === "live") return match.isLive;
  if (statusFilter === "upcoming") return !match.isLive && !match.isFinished;
  if (statusFilter === "finished") return match.isFinished;
  return true;
}

function dominantTeam(match: Match) {
  return match.teamA.signalScore >= match.teamB.signalScore ? match.teamA : match.teamB;
}

function attentionScore(match: Match) {
  return Math.min(100, Math.max(25, Math.round((match.teamA.signalScore + match.teamB.signalScore) / 4.7)));
}

function SignalBars({ score }: { score: number }) {
  const active = Math.min(5, Math.max(1, Math.ceil(score / 45)));
  return (
    <div className="flex items-end gap-1">
      {[1, 2, 3, 4, 5].map((bar) => (
        <span
          key={bar}
          className={`w-2 rounded-t-sm ${bar <= active ? "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.65)]" : "bg-white/10"}`}
          style={{ height: `${10 + bar * 5}px` }}
        />
      ))}
    </div>
  );
}

function Waveform() {
  return (
    <div className="relative h-20 overflow-hidden rounded-2xl border border-cyan-300/20 bg-cyan-300/5">
      <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-200/15" />
      <div className="absolute inset-0 flex items-center justify-center gap-1 px-5">
        {Array.from({ length: 38 }).map((_, index) => (
          <span
            key={index}
            className="w-1 rounded-full bg-cyan-300/80 shadow-[0_0_10px_rgba(34,211,238,0.55)]"
            style={{ height: `${12 + Math.abs(Math.sin(index * 0.72)) * 42}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  icon: Icon,
  tone = "cyan",
}: {
  label: string;
  value: string | number;
  icon: typeof Radio;
  tone?: "cyan" | "orange" | "violet" | "emerald";
}) {
  const toneClass = {
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    orange: "border-orange-300/30 bg-orange-300/10 text-orange-100",
    violet: "border-violet-300/30 bg-violet-300/10 text-violet-100",
    emerald: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
  }[tone];
  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[0.68rem] font-black uppercase tracking-[0.18em] opacity-75">{label}</div>
        <Icon className="h-4 w-4 opacity-80" />
      </div>
      <div className="mt-3 font-display text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function CommandCard({
  match,
  index,
  isAuthenticated,
  placing,
  onSubmitLiveCall,
}: {
  match: Match;
  index: number;
  isAuthenticated: boolean;
  placing: boolean;
  onSubmitLiveCall: (matchId: string, selectedTeam: string, activityCommitment: number, signalWeight: number) => Promise<boolean>;
}) {
  const leader = dominantTeam(match);
  const statusLabel = match.isFinished ? "Completed" : match.isLive ? "Live now" : "Upcoming";
  const handleAction = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth";
      return;
    }
    if (!match.isFinished) {
      await onSubmitLiveCall(match.id, leader.name, 50, Math.max(1, leader.signalScore / 100));
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`group relative overflow-hidden rounded-[24px] border p-4 transition-all duration-300 ${
        match.isLive ? "border-cyan-300/45 bg-cyan-300/[0.09] shadow-[0_0_34px_rgba(34,211,238,0.12)]" : "border-white/12 bg-white/[0.045] hover:border-cyan-300/35"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.13),transparent_36%)] opacity-80" />
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.18em] ${match.isLive ? "border-cyan-300/35 bg-cyan-300/15 text-cyan-100" : "border-orange-300/35 bg-orange-300/10 text-orange-100"}`}>
                {statusLabel}
              </span>
              <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-300">
                {match.game}
              </span>
            </div>
            <h3 className="mt-3 truncate text-lg font-black text-white">{match.teamA.name} vs. {match.teamB.name}</h3>
            <p className="mt-1 truncate text-xs uppercase tracking-[0.16em] text-slate-500">{match.tournament}</p>
          </div>
          <div className="flex -space-x-2">
            <TeamLogo name={match.teamA.name} logo={match.teamA.logo} size={42} className="rounded-xl border border-cyan-300/20 bg-black/35 p-1" />
            <TeamLogo name={match.teamB.name} logo={match.teamB.logo} size={42} className="rounded-xl border border-orange-300/20 bg-black/35 p-1" />
          </div>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-end gap-4 rounded-2xl border border-white/10 bg-black/20 p-3">
          <div>
            <div className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-slate-500">Digital signal</div>
            <div className="mt-2 flex items-center gap-3">
              <SignalBars score={leader.signalScore} />
              <span className="truncate text-sm font-bold text-cyan-100">{leader.name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white">{attentionScore(match)}%</div>
            <div className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-500">Attention</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-200">
            <TimerReset className="h-4 w-4" />
            {match.isFinished ? "Results available" : match.isLive ? "Locks in 00:15:30" : `Starts ${match.time}`}
          </div>
          <Button
            size="sm"
            disabled={placing || match.isFinished}
            onClick={handleAction}
            className="min-h-10 min-w-[150px] border border-orange-300/45 bg-orange-400/10 px-4 text-sm font-black uppercase tracking-[0.12em] text-orange-100 hover:bg-orange-300/20"
          >
            {match.isFinished ? "View results" : match.isLive ? "Make live call" : "Rally members"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

const LiveCalls = () => {
  const { user } = useAuth();
  const { profile, liveCalls, placing, submitLiveCall } = useLiveCalls();
  const { matches, loading, error } = useMatches({ refreshInterval: 30000 });
  const { completeDailyChallenge } = useArenaBalance();
  const { hasCompletedToday, isLoading: challengeLoading, markChallengeComplete } = useDailyChallenge();
  const [gameFilter, setGameFilter] = useState<GameFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const filteredMatches = useMemo(
    () => matches.filter((match) => gameMatches(match, gameFilter) && statusMatches(match, statusFilter)),
    [gameFilter, matches, statusFilter],
  );
  const featuredMatch = matches.find((match) => match.isLive) || matches.find((match) => !match.isFinished) || matches[0] || null;
  const liveMatchesCount = matches.filter((match) => match.isLive).length;
  const totalLiveCalls = profile?.total_live_calls || liveCalls.length || 0;
  const membersRallied = Math.max(248, totalLiveCalls * 12);

  const handleChallengeComplete = async () => {
    markChallengeComplete();
    await completeDailyChallenge(50);
    setShowChallengeModal(false);
  };
  const scrollToBoard = () => document.getElementById("command-board")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen overflow-hidden bg-[#050b16] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(124,58,237,0.15),transparent_25%),radial-gradient(circle_at_78%_82%,rgba(249,115,22,0.12),transparent_24%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:38px_38px] opacity-60" />
      <main className="relative mx-auto max-w-[1500px] space-y-7 px-4 pb-14 pt-24 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.14fr_0.86fr]">
          <div className="relative overflow-hidden rounded-[32px] border border-cyan-300/20 bg-slate-950/70 p-5 shadow-[0_0_55px_rgba(34,211,238,0.08)] sm:p-7 lg:p-9">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_24%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_92%_80%,rgba(249,115,22,0.12),transparent_32%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.2em] text-cyan-100">
                  <Radio className="h-3.5 w-3.5" /> Live calls command room
                </div>
                <div>
                  <h1 className="max-w-3xl font-display text-[2.4rem] font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
                    Turn today&apos;s live moments <span className="block bg-gradient-to-r from-cyan-200 via-cyan-300 to-orange-300 bg-clip-text text-transparent">into a return ritual.</span>
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                    Launch community calls, create visible momentum, and give members a reason to come back before the next reset.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" disabled={challengeLoading} onClick={() => setShowChallengeModal(true)} className="min-h-12 w-full rounded-xl bg-cyan-300 px-6 text-sm font-black uppercase tracking-[0.14em] text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.35)] hover:bg-cyan-200 sm:w-auto">
                    <Mic2 className="mr-2 h-4 w-4" /> Start live call
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setShowChallengeModal(true)} className="min-h-12 w-full rounded-xl border-cyan-300/25 bg-cyan-300/5 px-6 text-sm font-black uppercase tracking-[0.14em] text-cyan-100 hover:bg-cyan-300/10 sm:w-auto">
                    <CalendarClock className="mr-2 h-4 w-4" /> Schedule ritual
                  </Button>
                  <Button size="lg" variant="outline" onClick={scrollToBoard} className="min-h-12 w-full rounded-xl border-orange-300/35 bg-orange-400/10 px-6 text-sm font-black uppercase tracking-[0.14em] text-orange-100 hover:bg-orange-300/20 sm:w-auto">
                    View command board <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricTile label="Live now" value={liveMatchesCount} icon={Radio} />
                  <MetricTile label="Calls today" value={Math.max(2, liveCalls.length || 2)} icon={Mic2} tone="violet" />
                  <MetricTile label="Members rallied" value={membersRallied} icon={Users} tone="orange" />
                  <MetricTile label="Reset timer" value="08:42" icon={TimerReset} tone="emerald" />
                </div>
              </div>
              <div className="rounded-[28px] border border-cyan-300/30 bg-black/30 p-4 shadow-[0_0_38px_rgba(34,211,238,0.1)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[0.7rem] font-black uppercase tracking-[0.22em] text-cyan-200/70">Today&apos;s ritual card</div>
                    <h2 className="mt-2 font-display text-3xl font-black text-white">Daily Live Call</h2>
                    <p className="text-sm font-bold text-slate-400">3:00 PM EST</p>
                  </div>
                  <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-100">Active</span>
                </div>
                <div className="mt-5"><Waveform /></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button className="min-h-11 rounded-xl bg-cyan-300 text-sm font-black uppercase tracking-[0.14em] text-slate-950 hover:bg-cyan-200" onClick={() => setShowChallengeModal(true)}>Join live call</Button>
                  <Button variant="outline" className="min-h-11 rounded-xl border-cyan-300/25 bg-cyan-300/5 text-sm font-black uppercase tracking-[0.14em] text-cyan-100 hover:bg-cyan-300/10" onClick={() => setShowChallengeModal(true)}>Create first call</Button>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <CountdownPill label="Daily reset" target={getNextUtcMidnight()} />
                  <CountdownPill label="Next lock" target={getHoursFromNow(2)} tone="amber" />
                </div>
              </div>
            </div>
          </div>
          <MomentumPanel hasCompletedToday={hasCompletedToday} />
        </section>
        <section id="command-board" className="rounded-[32px] border border-cyan-300/18 bg-slate-950/72 p-5 shadow-[0_0_48px_rgba(34,211,238,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[0.7rem] font-black uppercase tracking-[0.2em] text-cyan-100"><Activity className="h-3.5 w-3.5" /> Command board</div>
              <h2 className="mt-3 font-display text-3xl font-black text-white sm:text-4xl">Pick the next rally moment</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map((status) => (
                <button key={status.id} onClick={() => setStatusFilter(status.id)} className={`rounded-full border px-3 py-2 text-xs font-black uppercase tracking-[0.14em] transition-all ${statusFilter === status.id ? "border-cyan-300/40 bg-cyan-300/15 text-cyan-100" : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"}`}>{status.label}</button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {gameFilters.map((game) => (
              <button key={game.id} onClick={() => setGameFilter(game.id)} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-black uppercase tracking-[0.14em] transition-all ${gameFilter === game.id ? "border-orange-300/45 bg-orange-300/14 text-orange-100" : "border-white/10 bg-white/[0.04] text-slate-400 hover:border-white/20 hover:text-white"}`}>{game.label}</button>
            ))}
          </div>
          {loading ? <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center text-slate-300">Loading the live-call slate...</div> : null}
          {error ? <div className="mt-6 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-4 text-sm text-orange-100">{error}</div> : null}
          {!loading && filteredMatches.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-10 text-center">
              <Sparkles className="mx-auto h-10 w-10 text-cyan-300" />
              <h3 className="mt-4 text-xl font-black text-white">No active call cards for this filter.</h3>
              <p className="mt-2 text-sm text-slate-400">Switch filters or come back when the next slate opens.</p>
            </div>
          ) : null}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {filteredMatches.map((match, index) => (
              <CommandCard key={match.id} match={match} index={index} placing={placing} isAuthenticated={!!user} onSubmitLiveCall={submitLiveCall} />
            ))}
          </div>
        </section>
        <RecentAndTrust featuredMatch={featuredMatch} userEmail={user?.email} onOpenModal={() => setShowChallengeModal(true)} onScrollToBoard={scrollToBoard} />
      </main>
      <DailyChallengeModal isOpen={showChallengeModal} onComplete={handleChallengeComplete} userName={user?.email || "Commander"} currentStreak={profile?.total_wins || 0} />
    </div>
  );
};

function MomentumPanel({ hasCompletedToday }: { hasCompletedToday: boolean }) {
  return (
    <aside className="grid gap-5 lg:grid-cols-2 xl:grid-cols-1">
      <div className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5 shadow-[0_0_44px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between gap-4">
          <div><div className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-slate-500">Momentum sidebar</div><h2 className="mt-2 text-2xl font-black">Community pulse</h2></div>
          <Gauge className="h-8 w-8 text-cyan-300" />
        </div>
        <div className="mt-5 space-y-3">
          {pulseMembers.map(([name, score, color]) => (
            <div key={name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${color}`} /><span className="font-bold text-slate-200">{name}</span></div>
              <span className="font-black text-cyan-100">{score}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-orange-300/20 bg-orange-400/10 p-4">
          <div className="flex items-center gap-2 text-orange-100"><Flame className="h-5 w-5" /><span className="text-xl font-black">5 day streak</span></div>
          <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-gradient-to-r from-orange-300 to-cyan-300" /></div>
          <p className="mt-3 text-sm text-slate-300">Suggestion: rally members before reset to unlock Club Pulse.</p>
        </div>
      </div>
      <div className="rounded-[28px] border border-orange-300/20 bg-slate-950/72 p-5">
        <div className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-orange-200/70">Return loop panel</div>
        <h2 className="mt-2 text-2xl font-black">Bring them back tomorrow</h2>
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
            <div className="flex items-center justify-between gap-3"><span className="font-bold text-cyan-50">Daily mission</span><span className="text-sm font-black text-cyan-100">{hasCompletedToday ? "Secured" : "Open"}</span></div>
            <p className="mt-2 text-sm text-slate-300">Participate in 3 live calls before the daily reset.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-orange-200" /><span className="font-bold text-white">Locked premium layer</span></div>
            <p className="mt-2 text-sm text-slate-400">Command benefits unlock after a consistent ritual streak.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function RecentAndTrust({
  featuredMatch,
  onOpenModal,
  onScrollToBoard,
  userEmail,
}: {
  featuredMatch: Match | null;
  onOpenModal: () => void;
  onScrollToBoard: () => void;
  userEmail?: string;
}) {
  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[0.42fr_0.58fr]">
        <div className="rounded-[32px] border border-cyan-300/18 bg-slate-950/72 p-5">
          <div className="flex items-center justify-between gap-4"><div><div className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-cyan-200/70">Hero call</div><h2 className="mt-2 text-2xl font-black">User signal</h2></div><ShieldCheck className="h-7 w-7 text-cyan-300" /></div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-cyan-300/10 font-black text-cyan-100">{userEmail?.slice(0, 1).toUpperCase() || "C"}</div><div className="min-w-0"><div className="truncate font-black text-white">{userEmail || "Commander"}</div><div className="text-xs text-slate-500">Activity synced</div></div></div>
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            </div>
            <Button className="mt-4 min-h-10 w-full rounded-xl bg-cyan-300 text-sm font-black uppercase tracking-[0.14em] text-slate-950 hover:bg-cyan-200" onClick={onOpenModal}>Call results</Button>
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-slate-950/72 p-5">
          <div className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-slate-500">Recent live calls</div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {recentCalls.map(([date, label, value, state]) => (
              <div key={date} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between gap-3"><span className="text-sm font-black text-white">{label}</span><span className="text-xs font-bold text-cyan-100">{value}</span></div>
                <div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-cyan-300" /></div>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500"><span>{date}</span><span>{state}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {featuredMatch ? (
        <section className="rounded-[32px] border border-orange-300/20 bg-slate-950/72 p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><div className="text-[0.7rem] font-black uppercase tracking-[0.2em] text-orange-200/70">Next action</div><h2 className="mt-2 text-2xl font-black sm:text-3xl">Rally around {dominantTeam(featuredMatch).name}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">Signal is visible, attention is warm, and the timer creates a reason to act now.</p></div>
            <Button className="min-h-11 w-full rounded-xl border border-orange-300/35 bg-orange-400/10 px-5 text-sm font-black uppercase tracking-[0.14em] text-orange-100 hover:bg-orange-300/20 lg:w-auto" variant="outline" onClick={onScrollToBoard}>Open command board</Button>
          </div>
        </section>
      ) : null}
      <section className="rounded-[28px] border border-cyan-300/18 bg-slate-950/72 p-4">
        <div className="flex flex-col gap-4 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3"><ShieldCheck className="h-5 w-5 text-cyan-300" /><span className="font-black uppercase tracking-[0.16em] text-cyan-100">Trust strip</span><span>Virtual engagement only. No cash value. No financial return.</span></div>
          <div className="flex flex-wrap gap-2"><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Discord/Twitch ready</span><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Secure data</span><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">Retention focused</span></div>
        </div>
      </section>
    </>
  );
}

export default LiveCalls;
