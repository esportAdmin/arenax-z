"use client";

import { ArrowUpRight, Crown, Flame, Shield, Star } from "lucide-react";

const members = [
  { name: "Viper_X", points: 15400, badge: "VX", role: "Captain", status: "Live" },
  { name: "Phoenix_Ace", points: 14200, badge: "PA", role: "Raider", status: "Queued" },
  { name: "Storm_Rider", points: 13800, badge: "SR", role: "Strategist", status: "Live" },
  { name: "Shadow_Wolf", points: 12900, badge: "SW", role: "Defender", status: "Online" },
  { name: "Cyber_Knight", points: 12500, badge: "CK", role: "Analyst", status: "Online" },
  { name: "Titan_Force", points: 11800, badge: "TF", role: "Frontliner", status: "Offline" },
];

function statusTone(status: string) {
  if (status === "Live") {
    return "border-rose-300/25 bg-rose-300/10 text-rose-200";
  }
  if (status === "Queued") {
    return "border-amber-300/25 bg-amber-300/10 text-amber-200";
  }
  if (status === "Online") {
    return "border-emerald-300/25 bg-emerald-300/10 text-emerald-200";
  }
  return "border-white/10 bg-white/5 text-slate-400";
}

export default function MemberList() {
  return (
    <div className="space-y-3">
      {members.map((member, index) => (
        <div
          key={member.name}
          className="surface-panel hero-sheen p-4 transition-colors hover:border-white/16"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-display font-bold text-white">
                {member.badge}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-white">{member.name}</span>
                  {index === 0 ? (
                    <Crown className="h-4 w-4 text-amber-300" />
                  ) : index < 3 ? (
                    <Star className="h-4 w-4 text-primary" />
                  ) : null}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                  {member.role}
                </div>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <div className="font-display text-xl font-bold text-white">
                {member.points.toLocaleString("en-US")}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-emerald-300 sm:justify-end">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Influence
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] ${statusTone(member.status)}`}>
              <Shield className="h-3.5 w-3.5 text-primary" />
              {member.status}
            </div>
            <div className="metal-chip">
              <Flame className="h-3.5 w-3.5 text-rose-300" />
              Return-driving member
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
