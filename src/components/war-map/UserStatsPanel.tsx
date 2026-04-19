"use client";

import { motion } from "framer-motion";
import { ClubStats } from "@/types/war";
import { Trophy, TrendingUp } from "lucide-react";

interface UserStatsPanelProps {
  stats: ClubStats;
  clubLogo: string;
  clubColor: string;
}

export default function UserStatsPanel({ stats, clubLogo, clubColor }: UserStatsPanelProps) {
  const pct = stats.totalTerritories > 0
    ? (stats.territoriesControlled / stats.totalTerritories) * 100
    : 0;

  return (
    <motion.div
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed left-0 bottom-0"
      style={{
        top: 72, width: 280,
        background: "rgba(26,33,50,0.97)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        padding: "24px 20px",
        overflowY: "auto",
      }}
    >
      {/* Club Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-1">
          <div
            className="absolute -inset-2 rounded-3xl blur-xl opacity-50"
            style={{ backgroundColor: clubColor }}
          />
          <div
            className="relative flex items-center justify-center rounded-3xl font-black text-white shadow-2xl"
            style={{
              width: 96, height: 96, fontSize: 42,
              backgroundColor: clubColor,
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            {clubLogo}
          </div>
        </div>
      </div>

      {/* Territories Controlled */}
      <div className="mb-6">
        <p style={{
          fontSize: 10, color: "#64748b", letterSpacing: 2,
          fontFamily: "'Rajdhani', sans-serif", marginBottom: 8,
        }}>
          TERRITORIES CONTROLLED
        </p>
        <p style={{ marginBottom: 10 }}>
          <span style={{
            fontSize: 40, fontWeight: 900, color: "#ffffff",
            fontFamily: "'Rajdhani', sans-serif",
          }}>
            {stats.territoriesControlled}
          </span>
          <span style={{
            fontSize: 24, fontWeight: 600, color: "#475569",
            fontFamily: "'Rajdhani', sans-serif",
          }}>
            {" "}/ {stats.totalTerritories}
          </span>
        </p>
        <div style={{
          width: "100%", height: 10, borderRadius: 5,
          background: "rgba(255,255,255,0.08)", overflow: "hidden",
        }}>
          <div style={{
            width: `${pct}%`, height: "100%", borderRadius: 5,
            background: "linear-gradient(90deg, #3b82f6, #a855f7, #ec4899)",
            transition: "width 0.7s ease",
          }} />
        </div>
      </div>

      {/* Global Rank */}
      <div
        className="rounded-2xl mb-4"
        style={{
          padding: "16px",
          background: "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(249,115,22,0.08))",
          border: "1px solid rgba(234,179,8,0.25)",
        }}
      >
        <p style={{
          fontSize: 10, color: "#64748b", letterSpacing: 2,
          fontFamily: "'Rajdhani', sans-serif", marginBottom: 8,
        }}>
          GLOBAL RANK
        </p>
        <div className="flex items-center gap-3">
          <Trophy size={32} color="#eab308" />
          <span style={{
            fontSize: 48, fontWeight: 900, color: "#ffffff",
            fontFamily: "'Rajdhani', sans-serif", lineHeight: 1,
          }}>
            #{stats.rank}
          </span>
        </div>
      </div>

      {/* Weekly Trend */}
      <div
        className="rounded-2xl"
        style={{
          padding: "16px",
          background: "linear-gradient(135deg, rgba(34,197,94,0.08), rgba(16,185,129,0.08))",
          border: "1px solid rgba(34,197,94,0.25)",
        }}
      >
        <p style={{
          fontSize: 10, color: "#64748b", letterSpacing: 2,
          fontFamily: "'Rajdhani', sans-serif", marginBottom: 8,
        }}>
          WEEKLY TREND
        </p>
        <div className="flex items-center gap-2">
          <TrendingUp size={20} color="#22c55e" />
          <span style={{
            fontSize: 17, fontWeight: 700, color: "#22c55e",
            fontFamily: "'Rajdhani', sans-serif",
          }}>
            +{stats.weeklyChange} territories
          </span>
        </div>
      </div>
    </motion.div>
  );
}
