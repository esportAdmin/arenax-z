"use client";

import { AlertTriangle, Shield, Swords } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { getHoursFromNow } from "@/lib/countdown";

const wars = [
  {
    title: "Battle for Nova Prime",
    attacker: "Hyperion Gaming",
    defender: "Cyber Legion",
    progress: 65,
    tone: "border-rose-400/20 bg-rose-400/10",
    target: getHoursFromNow(4),
    priority: "Critical",
  },
  {
    title: "Sector 7 Siege",
    attacker: "Hyperion Gaming",
    defender: "Storm Raiders",
    progress: 42,
    tone: "border-amber-400/20 bg-amber-400/10",
    target: getHoursFromNow(7),
    priority: "High",
  },
  {
    title: "Omega Station Assault",
    attacker: "Titan Force",
    defender: "Hyperion Gaming",
    progress: 78,
    tone: "border-cyan-400/20 bg-cyan-400/10",
    target: getHoursFromNow(2),
    priority: "Defense",
  },
];

export default function ActiveWars() {
  return (
    <div className="space-y-4">
      {wars.map((war) => (
        <div key={war.title} className="surface-panel p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {war.priority} front
              </div>
              <h3 className="mt-2 text-lg font-display font-bold text-white">
                {war.title}
              </h3>
            </div>
            <CountdownPill label="Lock" target={war.target} tone="rose" />
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <span className="font-semibold text-cyan-300">{war.attacker}</span>
            <span className="text-slate-500">vs</span>
            <span className="font-semibold text-rose-300">{war.defender}</span>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-400">
              <span>Control pressure</span>
              <span className="text-white">{war.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${war.tone.includes("rose") ? "from-rose-500 to-orange-400" : war.tone.includes("amber") ? "from-amber-400 to-yellow-300" : "from-cyan-400 to-blue-500"}`}
                style={{ width: `${war.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Button className="justify-between">
              Attack now
              <Swords className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="justify-between">
              Reinforce line
              <Shield className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-300">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />
            This front should remain visible until the pressure is resolved
          </div>
        </div>
      ))}
    </div>
  );
}
