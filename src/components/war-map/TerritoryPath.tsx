"use client";

import { motion } from "framer-motion";
import { Territory } from "@/types/war";

interface TerritoryPathProps {
  territory: Territory;
  onClick: () => void;
}

export default function TerritoryPath({ territory, onClick }: TerritoryPathProps) {
  const isCritical  = territory.state === "critical";
  const isHigh      = territory.state === "high";
  const isConquered = territory.state === "conquered";

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      <motion.path
        d={territory.paths}
        fill={territory.color}
        stroke={territory.borderColor}
        strokeWidth={isCritical ? 4 : isHigh ? 3 : 1.5}
        initial={{ opacity: 0.85 }}
        whileHover={{ opacity: 1, scale: 1.03 }}
        animate={
          isCritical ? {
            strokeWidth: [4, 5, 4],
            filter: [
              `drop-shadow(0 0 15px ${territory.glowColor})`,
              `drop-shadow(0 0 30px ${territory.glowColor})`,
              `drop-shadow(0 0 15px ${territory.glowColor})`,
            ],
          } : isHigh ? {
            filter: [
              `drop-shadow(0 0 10px ${territory.glowColor})`,
              `drop-shadow(0 0 20px ${territory.glowColor})`,
              `drop-shadow(0 0 10px ${territory.glowColor})`,
            ],
          } : isConquered ? {
            filter: [`drop-shadow(0 0 25px ${territory.glowColor})`, `drop-shadow(0 0 10px ${territory.glowColor})`],
          } : {}
        }
        transition={
          isCritical || isHigh
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : isConquered
            ? { duration: 2, repeat: 2 }
            : {}
        }
      />

      {/* Label on hover */}
      <motion.g initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}>
        <rect
          x={territory.position.x - 45}
          y={territory.position.y - 18}
          width="90" height="32" rx="8"
          fill="rgba(0,0,0,0.95)"
          stroke="rgba(255,255,255,0.2)" strokeWidth="1"
        />
        <text
          x={territory.position.x} y={territory.position.y}
          textAnchor="middle"
          fill="#ffffff" fontSize="11" fontWeight="700"
          fontFamily="'Rajdhani', sans-serif"
        >
          {territory.name}
        </text>
        <text
          x={territory.position.x} y={territory.position.y + 12}
          textAnchor="middle"
          fill="#94a3b8" fontSize="9"
          fontFamily="'Rajdhani', sans-serif"
        >
          {territory.club?.name}
        </text>
      </motion.g>

      {/* Always-visible name for active territories */}
      {(isCritical || isHigh || isConquered) && (
        <text
          x={territory.position.x} y={territory.position.y + 2}
          textAnchor="middle"
          fill="#ffffff" fontSize="11" fontWeight="800"
          fontFamily="'Rajdhani', sans-serif"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {territory.name}
        </text>
      )}

      {isConquered && (
        <text
          x={territory.position.x} y={territory.position.y - 22}
          textAnchor="middle" fontSize="14"
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          👑
        </text>
      )}
    </g>
  );
}
