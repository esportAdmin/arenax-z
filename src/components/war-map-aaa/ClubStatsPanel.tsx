"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import type { ClubStatsDisplay } from "@/types/war-aaa";

interface ClubStatsPanelProps {
  stats: ClubStatsDisplay;
  clubName?: string;
  clubLogoUrl?: string | null;
}

export default function ClubStatsPanel({ stats, clubName = "ALPHA", clubLogoUrl }: ClubStatsPanelProps) {
  const {
    territoriesControlled,
    totalTerritories,
    globalRank,
    weeklyChange,
  } = stats;

  const pct = totalTerritories > 0
    ? Math.round((territoriesControlled / totalTerritories) * 100)
    : 0;

  const initial = clubName.charAt(0).toUpperCase();

  return (
    <div
      className="absolute z-50"
      style={{
        left: 12, top: 72, width: 290,
        background: "rgba(10,18,36,0.93)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, padding: 20,
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Club logo */}
      <div className="flex justify-center mb-5">
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{
            width: 100, height: 100, borderRadius: 16,
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(37,99,235,0.08))",
            border: "2px solid rgba(59,130,246,0.35)",
          }}
        >
          {clubLogoUrl ? (
            <img src={clubLogoUrl} alt={clubName} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 12 }} />
          ) : (
            <svg width="64" height="64" viewBox="0 0 64 64">
              <path
                d="M32 4 L58 16 L58 36 Q58 52 32 60 Q6 52 6 36 L6 16 Z"
                fill="rgba(59,130,246,0.12)" stroke="#3b82f6" strokeWidth="2"
              />
              <text x="32" y="42" textAnchor="middle" fill="#60a5fa"
                fontSize="30" fontWeight="900" fontFamily="Rajdhani, sans-serif">
                {initial}
              </text>
            </svg>
          )}
        </div>
      </div>

      {/* Territories Controlled — comme la maquette */}
      <div className="mb-4">
        <div className="mb-2 font-semibold" style={{ fontSize: 10, color: "#64748b", letterSpacing: 2 }}>
          TERRITORIES CONTROLLED
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-white font-black leading-none"
            style={{ fontSize: 38, fontFamily: "'Rajdhani', sans-serif" }}>
            {territoriesControlled}
          </span>
          <span style={{ fontSize: 22, color: "#475569", fontFamily: "'Rajdhani', sans-serif", fontWeight: 600 }}>
            / {totalTerritories}
          </span>
        </div>
        <div className="overflow-hidden rounded-full" style={{ height: 6, background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full transition-all duration-700" style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #ef4444, #3b82f6)",
          }} />
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0" }} />

      {/* Global Rank */}
      <div className="mb-4">
        <div className="mb-2 font-semibold" style={{ fontSize: 10, color: "#64748b", letterSpacing: 2 }}>
          GLOBAL RANK
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white font-black leading-none"
            style={{ fontSize: 38, fontFamily: "'Rajdhani', sans-serif" }}>
            {globalRank > 0 ? `#${globalRank}` : "—"}
          </span>
          <div className="flex items-center justify-center rounded-full" style={{
            width: 42, height: 42,
            background: "rgba(234,179,8,0.1)",
            border: "1px solid rgba(234,179,8,0.3)",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#eab308">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "14px 0" }} />

      {/* Weekly Trend */}
      <div>
        <div className="mb-2 font-semibold" style={{ fontSize: 10, color: "#64748b", letterSpacing: 2 }}>
          WEEKLY TREND
        </div>
        <div className="flex items-center gap-3">
          <span className="font-black" style={{
            fontSize: 20,
            color: weeklyChange >= 0 ? "#22c55e" : "#ef4444",
            fontFamily: "'Rajdhani', sans-serif",
          }}>
            {weeklyChange >= 0 ? "+" : ""}{weeklyChange} territories
          </span>
          <div className="flex items-center justify-center rounded-full" style={{
            width: 32, height: 32,
            background: weeklyChange >= 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${weeklyChange >= 0 ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          }}>
            {weeklyChange >= 0
              ? <TrendingUp size={15} color="#22c55e" />
              : <TrendingDown size={15} color="#ef4444" />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
