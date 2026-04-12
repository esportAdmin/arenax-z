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

export default function MemberList() {
  return (
    <div className="space-y-3">
      {members.map((member, index) => (
        <div
          key={member.name}
          className="surface-panel p-4 transition-colors hover:border-white/16"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-display font-bold text-white">
                {member.badge}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{member.name}</span>
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

            <div className="text-right">
              <div className="font-display text-xl font-bold text-white">
                {member.points.toLocaleString("en-US")}
              </div>
              <div className="mt-1 flex items-center justify-end gap-1 text-xs uppercase tracking-[0.14em] text-emerald-300">
                <ArrowUpRight className="h-3.5 w-3.5" />
                Influence
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <div className="metal-chip">
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
