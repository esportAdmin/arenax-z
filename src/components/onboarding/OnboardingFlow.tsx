"use client";

/**
 * OnboardingFlow.tsx
 * ─────────────────────────────────────────────────────────────────────
 * Flow onboarding complet :
 *   Step 0 : Setup profil (username, consentement RGPD)
 *   Step 1 : Présentation du jeu
 *   Step 2 : Tutoriel interactif (placeholder)
 *   Step 3 : Placement en queue — premier match
 * ─────────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface OnboardingFlowProps {
  userId:      string;
  initialStep?: number;
}

type Step = 0 | 1 | 2 | 3;

// ─────────────────────────────────────────────
// STEP COMPONENTS
// ─────────────────────────────────────────────

function StepProfileSetup({
  onNext,
}: {
  onNext: () => void;
}) {
  const [username,  setUsername]  = useState("");
  const [gdpr,      setGdpr]      = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  async function handleSubmit() {
    if (!username || !gdpr) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/profile/setup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, gdpr_consent: true, marketing }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Setup failed");
        return;
      }

      onNext();
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Create your profile</h2>
        <p className="mt-1 text-sm text-white/50">Choose a username to get started</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            maxLength={20}
            placeholder="your_username"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-cyan-400/40 focus:outline-none"
          />
          <p className="mt-1 text-[10px] text-white/25">3–20 chars, letters, numbers, underscore</p>
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={gdpr}
            onChange={(e) => setGdpr(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded accent-cyan-400"
          />
          <span className="text-xs text-white/50">
            I agree to the{" "}
            <a href="/terms" target="_blank" className="text-cyan-400 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/privacy" target="_blank" className="text-cyan-400 hover:underline">Privacy Policy</a>
            {" "}· Required
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded accent-cyan-400"
          />
          <span className="text-xs text-white/50">
            Receive updates about new features and seasons · Optional
          </span>
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={!username || !gdpr || username.length < 3 || loading}
        onClick={handleSubmit}
        className="w-full rounded-xl border border-cyan-400/20 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Setting up…" : "Continue →"}
      </button>
    </div>
  );
}

function StepIntro({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl">⚔️</div>
      <div>
        <h2 className="text-2xl font-black text-white">Welcome to ArenaX</h2>
        <p className="mt-2 text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
          Real-time strategy battles. Climb the ranked ladder.
          Watch your highlights. Prove your skill.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "🏆", label: "Ranked MMR" },
          { icon: "🎥", label: "Auto Highlights" },
          { icon: "📊", label: "Match Analytics" },
        ].map((f) => (
          <div key={f.label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="text-2xl">{f.icon}</div>
            <div className="mt-2 text-xs font-semibold text-white/60">{f.label}</div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-xl border border-cyan-400/20 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/25"
      >
        Let's go →
      </button>
    </div>
  );
}

function StepTutorial({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Quick Tutorial</h2>
        <p className="mt-1 text-sm text-white/50">Learn the basics in 2 minutes</p>
      </div>

      <div className="space-y-3">
        {[
          { n: "1", title: "Deploy units", desc: "Place your units on the map to attack territories" },
          { n: "2", title: "Use abilities", desc: "Activate powerful abilities at the right moment" },
          { n: "3", title: "Win the war",   desc: "Capture the enemy territory to claim victory" },
        ].map((step) => (
          <div key={step.n} className="flex gap-4 rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 text-sm font-bold text-cyan-400">
              {step.n}
            </div>
            <div>
              <div className="text-sm font-semibold text-white/80">{step.title}</div>
              <div className="mt-0.5 text-xs text-white/40">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* TODO — monter ici le vrai tutoriel interactif (mini-map, demo) */}

      <button
        type="button"
        onClick={onNext}
        className="w-full rounded-xl border border-cyan-400/20 bg-cyan-500/15 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/25"
      >
        I'm ready →
      </button>
    </div>
  );
}

function StepFirstMatch({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(false);

  async function joinQueue() {
    setLoading(true);

    // Marquer le tutoriel terminé
    await fetch("/api/onboarding", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ completed: true, tutorial_completed: true }),
    }).catch(() => {});

    onComplete();
  }

  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl">🎮</div>
      <div>
        <h2 className="text-2xl font-black text-white">Ready for your first match?</h2>
        <p className="mt-2 text-sm text-white/50">
          You'll be matched against a player at your skill level.
          Your placement matches determine your starting rank.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 px-5 py-4 text-left">
        <div className="text-xs font-semibold text-amber-300 uppercase tracking-widest mb-1">
          Placement Matches
        </div>
        <p className="text-sm text-amber-200/70">
          Play 5 placement matches to reveal your initial MMR rank.
          Your performance determines where you start on the ladder.
        </p>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={joinQueue}
        className="w-full rounded-xl border border-emerald-400/20 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-50"
      >
        {loading ? "Starting…" : "Find a Match 🎯"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const STEPS: Step[] = [0, 1, 2, 3];

export function OnboardingFlow({ initialStep = 0 }: OnboardingFlowProps) {
  const router   = useRouter();
  const [step, setStep] = useState<Step>((initialStep as Step) ?? 0);

  function nextStep() {
    setStep((s) => Math.min(s + 1, 3) as Step);
  }

  function handleComplete() {
    router.push("/play");
  }

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="mb-8 flex justify-center gap-2">
          {STEPS.map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? "w-6 bg-cyan-400" : s < step ? "w-3 bg-cyan-400/40" : "w-3 bg-white/10"
              }`}
            />
          ))}
        </div>

        <div className="rounded-3xl border border-white/8 bg-black/40 p-8 backdrop-blur">
          {step === 0 && <StepProfileSetup onNext={nextStep} />}
          {step === 1 && <StepIntro        onNext={nextStep} />}
          {step === 2 && <StepTutorial     onNext={nextStep} />}
          {step === 3 && <StepFirstMatch   onComplete={handleComplete} />}
        </div>
      </div>
    </div>
  );
}
