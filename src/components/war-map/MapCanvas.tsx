"use client";

import { motion } from "framer-motion";
import { Territory } from "@/types/war";

interface MapCanvasProps {
  territories: Territory[];
  onTerritoryClick: (territory: Territory) => void;
}

const VIEWBOX_WIDTH = 760;
const VIEWBOX_HEIGHT = 560;
const EUROPE_LANDMASS =
  "M160 496c16-51 58-90 106-118 34-19 59-34 73-60 23-42 37-63 78-93 61-44 146-80 228-75 59 4 118 24 155 58 34 31 55 83 39 126-14 39-51 57-86 77-51 28-77 65-123 90-64 35-141 50-213 38-70-11-123-51-175-86-38-26-98-10-82-57Z";
const SEA_GRID_LINES = [
  "M104 150H654",
  "M92 222H692",
  "M122 294H706",
  "M102 366H672",
  "M140 438H640",
];
const LAT_LINES = [
  "M226 124L194 474",
  "M314 114L286 486",
  "M402 112L386 500",
  "M490 126L488 500",
  "M578 152L588 486",
];

function hexPoints(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

export default function MapCanvas({
  territories,
  onTerritoryClick,
}: MapCanvasProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 55% 45%, #0a1628 0%, #060e1c 60%, #030810 100%)",
        }}
      />

      {Array.from({ length: 60 }, (_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: i % 7 === 0 ? 2 : 1,
            height: i % 7 === 0 ? 2 : 1,
            background: "rgba(255,255,255,0.7)",
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 73.1) % 100}%`,
            opacity: 0.1 + (i % 5) * 0.08,
          }}
        />
      ))}

      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="sea-grid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(28, 214, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(140, 91, 255, 0.04)" />
          </linearGradient>
          <linearGradient id="land-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(23, 53, 93, 0.94)" />
            <stop offset="100%" stopColor="rgba(10, 22, 42, 0.98)" />
          </linearGradient>
          <filter id="coast-glow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          x="60"
          y="70"
          width="640"
          height="420"
          rx="36"
          fill="rgba(5, 16, 32, 0.34)"
          stroke="rgba(30, 115, 175, 0.14)"
        />

        {SEA_GRID_LINES.map((line, index) => (
          <path
            key={line}
            d={line}
            fill="none"
            stroke="url(#sea-grid)"
            strokeWidth="1"
            opacity={0.5 - index * 0.06}
          />
        ))}

        {LAT_LINES.map((line, index) => (
          <path
            key={line}
            d={line}
            fill="none"
            stroke="url(#sea-grid)"
            strokeWidth="1"
            opacity={0.44 - index * 0.05}
          />
        ))}

        <path
          d={EUROPE_LANDMASS}
          fill="url(#land-glow)"
          stroke="rgba(84, 184, 255, 0.26)"
          strokeWidth="2"
          filter="url(#coast-glow)"
        />

        {territories.map((territory) => {
          const isCritical = territory.state === "critical";
          const isHigh = territory.state === "high";
          const isConquered = territory.state === "conquered";
          const isActive = isCritical || isHigh;
          const radius = isCritical ? 20 : isHigh ? 17 : 14;
          const fillColor = isCritical
            ? "rgba(255, 51, 102, 0.28)"
            : isHigh
              ? "rgba(255, 200, 63, 0.26)"
              : isConquered
                ? "rgba(255, 180, 58, 0.24)"
                : "rgba(72, 101, 151, 0.22)";

          return (
            <g
              key={territory.id}
              transform={`translate(${territory.position.x}, ${territory.position.y})`}
              onClick={() => onTerritoryClick(territory)}
              style={{ cursor: "pointer" }}
            >
              {isActive && (
                <motion.circle
                  r={radius + 20}
                  fill="none"
                  stroke={territory.color}
                  strokeWidth={2}
                  opacity={0.22}
                  animate={{
                    r: [radius + 12, radius + 26, radius + 12],
                    opacity: [0.34, 0.08, 0.34],
                  }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              <motion.path
                d={territory.paths}
                transform={`translate(${-territory.position.x}, ${-territory.position.y})`}
                fill={fillColor}
                stroke={territory.borderColor}
                strokeWidth={isCritical ? 3 : isHigh ? 2.6 : 2}
                style={{
                  filter: `drop-shadow(0 0 ${isCritical ? 14 : isHigh ? 10 : 6}px ${territory.glowColor})`,
                }}
                animate={isActive ? { opacity: [0.82, 1, 0.82] } : { opacity: 0.92 }}
                transition={
                  isActive
                    ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              />

              <motion.polygon
                points={hexPoints(radius)}
                fill="rgba(6, 12, 24, 0.92)"
                stroke={territory.borderColor}
                strokeWidth={isCritical ? 2.4 : isHigh ? 2 : 1.6}
                style={{
                  filter: `drop-shadow(0 0 ${isCritical ? 12 : isHigh ? 9 : 6}px ${territory.glowColor})`,
                }}
                animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={
                  isActive
                    ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              />

              <text
                y={-radius - 16}
                textAnchor="middle"
                fill={territory.color}
                fontSize="13"
                fontWeight="800"
                fontFamily="'Rajdhani', sans-serif"
                letterSpacing="1.8"
                style={{ userSelect: "none", pointerEvents: "none" }}
              >
                {territory.name}
              </text>

              {isConquered && (
                <text
                  y={-radius - 34}
                  textAnchor="middle"
                  fill="#ffd777"
                  fontSize="18"
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  *
                </text>
              )}

              {territory.club && (
                <circle
                  r={4}
                  cy={radius + 14}
                  fill={territory.club.color}
                  opacity={0.95}
                  style={{ pointerEvents: "none" }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
