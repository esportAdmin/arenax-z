"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Graticule,
  Sphere,
} from "react-simple-maps";
import { useState, useEffect } from "react";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const BATTLE_MARKERS = [
  {
    id: "eu",
    name: "BATTLE FOR EUROPE",
    club1: "SHADOW LEGION",
    club2: "IRON WOLVES",
    coords: [15.0, 52.0] as [number, number],
    intensity: "high",
    color: "#ef4444",
    viewers: "45,280",
  },
  {
    id: "as",
    name: "ASIAN DOMINANCE",
    club1: "VANGUARD ELITE",
    club2: "CELESTIAL GUARD",
    coords: [116.0, 35.0] as [number, number],
    intensity: "extreme",
    color: "#f97316",
    viewers: "38,750",
  },
  {
    id: "oc",
    name: "OCEANIA SIEGE",
    club1: "STORM BREAKERS",
    club2: "PHOENIX RISING",
    coords: [134.0, -25.0] as [number, number],
    intensity: "medium",
    color: "#eab308",
    viewers: "28,940",
  },
];

export default function LiveWarMapInner() {
  const [hovered, setHovered]   = useState<string | null>(null);
  const [pulse,   setPulse]     = useState(0);

  /* Compteur de "viewers" animé — donne vie à la carte */
  useEffect(() => {
    const id = setInterval(() => setPulse((p) => p + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        height: 520,
        background: "linear-gradient(135deg, #06030f 0%, #0a1020 100%)",
        border: "1px solid rgba(239,68,68,0.3)",
        boxShadow: "0 0 60px rgba(239,68,68,0.08), inset 0 0 80px rgba(239,68,68,0.04)",
      }}
    >
      {/* ── Grille quadrillée rouge ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(239,68,68,0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.10) 1px, transparent 1px)
          `,
          backgroundSize: "45px 45px",
        }}
      />

      {/* ── Lueurs ambiantes ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Europe */}
        <div style={{
          position: "absolute", left: "50%", top: "28%",
          width: 220, height: 220, marginLeft: -110, marginTop: -110,
          background: "radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "pulse 3s ease-in-out infinite",
        }} />
        {/* Asie */}
        <div style={{
          position: "absolute", left: "72%", top: "32%",
          width: 200, height: 200, marginLeft: -100, marginTop: -100,
          background: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "pulse 3s ease-in-out infinite 1s",
        }} />
        {/* Océanie */}
        <div style={{
          position: "absolute", left: "76%", top: "60%",
          width: 180, height: 180, marginLeft: -90, marginTop: -90,
          background: "radial-gradient(circle, rgba(234,179,8,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "pulse 3s ease-in-out infinite 2s",
        }} />
      </div>

      {/* ── Badge live ── */}
      <div
        className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "rgba(239,68,68,0.18)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(239,68,68,0.45)",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-red-400 font-mono text-xs font-bold tracking-wider">
          3 LIVE BATTLES
        </span>
      </div>

      {/* ── Compteur viewers total animé ── */}
      <div
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <span className="text-gray-400 text-xs">👁</span>
        <span className="text-orange-400 font-mono text-xs font-bold">
          {(112970 + pulse * 7).toLocaleString()} watching
        </span>
      </div>

      {/* ── Coins décoratifs ── */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-red-500/60 z-20" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-500/60 z-20" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-red-500/60 z-20" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-red-500/60 z-20" />

      {/* ── Carte react-simple-maps ── */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <ComposableMap
          projectionConfig={{ scale: 160, center: [20, 15] }}
          style={{ width: "100%", height: "100%" }}
        >
          <Sphere
            id="war-sphere"
            fill="transparent"
            stroke="transparent"
            strokeWidth={0}
          />
          <Graticule stroke="rgba(239,68,68,0.06)" strokeWidth={0.5} />

          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(8, 12, 28, 0.96)"
                  stroke="rgba(239,68,68,0.4)"
                  strokeWidth={0.55}
                  style={{
                    default: { outline: "none" },
                    hover:   {
                      fill: "rgba(239,68,68,0.12)",
                      outline: "none",
                    },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* ── Marqueurs de bataille ── */}
          {BATTLE_MARKERS.map((m) => (
            <Marker
              key={m.id}
              coordinates={m.coords}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Anneau pulsant large */}
              <circle
                r={28}
                fill={m.color}
                opacity={0.08}
                style={{ animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }}
              />
              {/* Anneau moyen */}
              <circle
                r={18}
                fill={m.color}
                opacity={0.14}
                style={{ animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite 0.5s" }}
              />
              {/* Anneau fixe */}
              <circle r={10} fill={m.color} opacity={0.22} />
              {/* Point central */}
              <circle
                r={6}
                fill={m.color}
                stroke="#ffffff"
                strokeWidth={2}
                style={{
                  cursor: "pointer",
                  filter: `drop-shadow(0 0 10px ${m.color}) drop-shadow(0 0 20px ${m.color}88)`,
                }}
              />
              {/* Icône */}
              <text
                textAnchor="middle"
                y={-20}
                fontSize={14}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                ⚔️
              </text>

              {/* Tooltip */}
              {hovered === m.id && (
                <foreignObject
                  x={12}
                  y={-72}
                  width={200}
                  height={72}
                  style={{ overflow: "visible" }}
                >
                  <div
                    style={{
                      background: "rgba(4,2,12,0.97)",
                      backdropFilter: "blur(12px)",
                      border: `1px solid ${m.color}`,
                      borderLeft: `3px solid ${m.color}`,
                      borderRadius: 8,
                      padding: "8px 12px",
                    }}
                  >
                    <div style={{
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: m.color,
                      letterSpacing: "0.08em",
                      marginBottom: 3,
                    }}>
                      {m.name}
                    </div>
                    <div style={{ fontSize: "0.6rem", color: "#9ca3af", marginBottom: 2 }}>
                      {m.club1} <span style={{ color: m.color }}>VS</span> {m.club2}
                    </div>
                    <div style={{ fontSize: "0.6rem", color: "#f87171" }}>
                      👁 {m.viewers} watching
                    </div>
                  </div>
                </foreignObject>
              )}
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* ── Légende ── */}
      <div className="absolute bottom-4 left-4 flex gap-3 z-20">
        {[
          { color: "#ef4444", label: "Active War"       },
          { color: "#f97316", label: "High Intensity"   },
          { color: "#eab308", label: "Medium Intensity" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: item.color,
                boxShadow: `0 0 8px ${item.color}`,
              }}
            />
            <span className="text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── Ligne de scan animée ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          zIndex: 3,
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.4), transparent)",
          animation: "scanLine 6s linear infinite",
        }}
      />

      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes ping {
          75%, 100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
