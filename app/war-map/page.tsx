"use client";

import { useState, useEffect } from "react";
import MapCanvas          from "@/components/war-map/MapCanvas";
import CriticalBattleCard from "@/components/war-map/CriticalBattleCard";
import WarCommandCenter   from "@/components/war-map/WarCommandCenter";
import UserStatsPanel     from "@/components/war-map/UserStatsPanel";
import TopBar             from "@/components/war-map/TopBar";
import EventFeed          from "@/components/war-map/EventFeed";
import { TERRITORIES, INITIAL_WARS } from "@/lib/territories";
import type { Territory, War, PlayerStats, ClubStats, BattleEvent } from "@/types/war";
import { COLORS } from "@/lib/colors";

// Convertit les secondes en "MM:SS"
function secsToTime(s: number): string {
  const m = Math.max(0, Math.floor(s / 60));
  const sec = Math.max(0, s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// Temps initial en secondes pour chaque guerre
const WAR_INITIAL_SECS: Record<string, number> = {
  "war-france":  154,
  "war-poland":  312,
  "war-poland-2":525,
};

export default function WarMapPage() {
  const [showCriticalBattle, setShowCriticalBattle] = useState(true);

  // Compteurs en secondes pour chaque guerre
  const [timers, setTimers] = useState<Record<string, number>>(WAR_INITIAL_SECS);

  // Décompte — tick chaque seconde
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const next = { ...prev };
        for (const id in next) {
          if (next[id] > 0) next[id] -= 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Wars avec timeRemaining calculé dynamiquement
  const wars: War[] = INITIAL_WARS.map((w) => ({
    ...w,
    timeRemaining: secsToTime(timers[w.id] ?? 0),
  }));

  const playerStats: PlayerStats = {
    username:      "Commander_X",
    avatar:        "C",
    clubName:      "ALPHA",
    clubLogo:      "🛡️",
    clubColor:     COLORS.club.alpha,
    gold:          12450,
    level:         24,
    xp:            7800,
    xpMax:         10000,
    notifications: 3,
  };

  const clubStats: ClubStats = {
    territoriesControlled: 12,
    totalTerritories:      47,
    rank:                  3,
    weeklyChange:          2,
  };

  const events: BattleEvent[] = [
    { id: "1", type: "attack",   clubName: "OMEGA", clubColor: COLORS.club.omega, territoryName: "BERLIN", icon: "🔥" },
    { id: "2", type: "defend",   clubName: "ALPHA", clubColor: COLORS.club.alpha, territoryName: "PARIS",  icon: "🛡️" },
    { id: "3", type: "conquest", clubName: "SIGMA", clubColor: COLORS.club.sigma, territoryName: "ITALY",  icon: "⚡" },
  ];

  // Toujours afficher la guerre la plus urgente
  const criticalWar = [...wars].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2 };
    return order[a.priority] - order[b.priority];
  })[0] ?? null;

  const handleTerritoryClick = (territory: Territory) => {
    console.log("Territory:", territory.name);
  };

  const handleAttack    = (warId?: string) => console.log("Attack:",    warId);
  const handleReinforce = (warId?: string) => console.log("Reinforce:", warId);
  const handleLogout    = () => console.log("Logout");

  return (
    <div className="min-h-screen overflow-hidden text-white" style={{ background: "#050816" }}>

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full" style={{
          top: "-10%", left: "20%", width: 600, height: 600,
          background: "rgba(59,130,246,0.04)", filter: "blur(120px)",
        }} />
        <div className="absolute rounded-full" style={{
          bottom: "-10%", right: "20%", width: 600, height: 600,
          background: "rgba(168,85,247,0.04)", filter: "blur(120px)",
        }} />
      </div>

      {/* Top bar */}
      <TopBar player={playerStats} onLogout={handleLogout} />

      {/* Map — entre les deux panels */}
      <div className="fixed" style={{ top: 72, bottom: 48, left: 280, right: 340 }}>
        <MapCanvas
          territories={TERRITORIES}
          onTerritoryClick={handleTerritoryClick}
        />
      </div>

      {/* Critical Battle Card — toujours visible si guerre active */}
      {showCriticalBattle && criticalWar && (
        <CriticalBattleCard
          war={criticalWar}
          onClose={() => setShowCriticalBattle(false)}
          onAttack={() => handleAttack(criticalWar.id)}
          onReinforce={() => handleReinforce(criticalWar.id)}
        />
      )}

      {/* Panel gauche */}
      <UserStatsPanel
        stats={clubStats}
        clubLogo={playerStats.clubLogo}
        clubColor={playerStats.clubColor}
      />

      {/* Panel droit */}
      <WarCommandCenter
        wars={wars}
        onAttack={handleAttack}
        onReinforce={handleReinforce}
      />

      {/* Event feed */}
      <EventFeed events={events} />
    </div>
  );
}
