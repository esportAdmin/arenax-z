"use client";

import { motion } from "framer-motion";
import { PlayerStats } from "@/types/war";
import { Bell, LogOut } from "lucide-react";

interface TopBarProps {
  player: PlayerStats;
  onLogout: () => void;
}

export default function TopBar({ player, onLogout }: TopBarProps) {
  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
      style={{
        height: 72,
        background: "rgba(26,33,50,0.97)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Left: Avatar + Name + Club */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full blur opacity-70"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }} />
          <div
            className="relative flex items-center justify-center rounded-full font-black text-white text-lg border-2"
            style={{
              width: 48, height: 48,
              background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
              borderColor: "#3b82f6", fontSize: 18,
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            {player.avatar}
          </div>
        </div>

        <div>
          <p style={{ color: "#ffffff", fontWeight: 700, fontSize: 15,
            fontFamily: "'Rajdhani', sans-serif" }}>
            {player.username}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <div
              className="flex items-center justify-center rounded font-black text-white"
              style={{
                width: 22, height: 22, fontSize: 11,
                backgroundColor: player.clubColor,
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              {player.clubLogo}
            </div>
            <span style={{ fontSize: 12, color: "#94a3b8",
              fontFamily: "'Rajdhani', sans-serif" }}>
              Club {player.clubName}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Gold + Level + XP + Notifs + Logout */}
      <div className="flex items-center gap-4">
        {/* Gold */}
        <div
          className="flex items-center gap-2 rounded-xl px-4 py-2"
          style={{
            background: "rgba(234,179,8,0.1)",
            border: "1px solid rgba(234,179,8,0.3)",
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #fde68a, #d97706)",
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 15, fontWeight: 800, color: "#fbbf24",
            fontFamily: "'Rajdhani', sans-serif" }}>
            {player.gold.toLocaleString()}
          </span>
        </div>

        {/* Level + XP */}
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-2"
          style={{
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 10, color: "#64748b",
              fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1 }}>LVL</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#ffffff",
              fontFamily: "'Rajdhani', sans-serif" }}>{player.level}</span>
          </div>
          <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
          <div className="flex flex-col gap-1">
            <span style={{ fontSize: 9, color: "#64748b",
              fontFamily: "'Rajdhani', sans-serif" }}>
              {player.xp.toLocaleString()} / {player.xpMax.toLocaleString()} XP
            </span>
            <div style={{
              width: 96, height: 5, borderRadius: 3,
              background: "rgba(255,255,255,0.08)", overflow: "hidden",
            }}>
              <div style={{
                width: `${(player.xp / player.xpMax) * 100}%`,
                height: "100%", borderRadius: 3,
                background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                transition: "width 0.8s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center rounded-xl transition-all"
          style={{
            width: 42, height: 42,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Bell size={18} color="#94a3b8" />
          {player.notifications > 0 && (
            <span
              className="absolute flex items-center justify-center rounded-full font-black text-white"
              style={{
                top: -4, right: -4, width: 18, height: 18,
                background: "#ef4444",
                border: "2px solid #1a2132",
                fontSize: 9,
              }}
            >
              {player.notifications}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center justify-center rounded-xl transition-all"
          style={{
            width: 42, height: 42,
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <LogOut size={18} color="#f87171" />
        </button>
      </div>
    </motion.div>
  );
}
