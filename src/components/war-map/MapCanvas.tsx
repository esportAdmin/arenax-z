"use client";

import { useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion } from "framer-motion";
import { Territory } from "@/types/war";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface MapCanvasProps {
  territories: Territory[];
  onTerritoryClick: (territory: Territory) => void;
}

// Vraies coordonnées GPS [lng, lat]
const GEO_COORDS: Record<string, [number, number]> = {
  france:  [2.3,   46.2],
  spain:   [-3.7,  40.4],
  poland:  [19.1,  51.9],
  italy:   [12.6,  41.9],
  uk:      [-1.5,  52.5],
  germany: [10.4,  51.2],
  sweden:  [18.6,  59.3],
  norway:  [10.2,  60.5],
};

function hexPoints(r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${(r * Math.cos(a)).toFixed(2)},${(r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

export default function MapCanvas({ territories, onTerritoryClick }: MapCanvasProps) {
  const [position, setPosition] = useState<{
    coordinates: [number, number]; zoom: number;
  }>({ coordinates: [10, 52], zoom: 4 });

  const handleMoveEnd = useCallback(
    (pos: { coordinates: [number, number]; zoom: number }) => setPosition(pos),
    []
  );

  // Taille des hexagones inversement proportionnelle au zoom
  const baseR = Math.max(4, Math.min(18, 20 / position.zoom));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ocean */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 55% 45%, #0a1628 0%, #060e1c 60%, #030810 100%)",
      }} />

      {/* Stars */}
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} className="absolute rounded-full pointer-events-none" style={{
          width:   i % 7 === 0 ? 2 : 1,
          height:  i % 7 === 0 ? 2 : 1,
          background: "rgba(255,255,255,0.7)",
          left:    `${(i * 137.5) % 100}%`,
          top:     `${(i * 73.1)  % 100}%`,
          opacity: 0.1 + (i % 5) * 0.08,
        }} />
      ))}

      {/* Map */}
      <ComposableMap
        style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
        projectionConfig={{ scale: 600, center: [10, 52] }}
        projection="geoMercator"
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={12}
        >
          {/* Pays */}
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#0d1e38", stroke: "#1a3050", strokeWidth: 0.4, outline: "none" },
                    hover:   { fill: "#132540", stroke: "#1e3a5f", strokeWidth: 0.4, outline: "none" },
                    pressed: { fill: "#0d1e38", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Territoires */}
          {territories.map((t) => {
            const coords = GEO_COORDS[t.id];
            if (!coords) return null;

            const isCrit   = t.state === "critical";
            const isHigh   = t.state === "high";
            const isCon    = t.state === "conquered";
            const isActive = isCrit || isHigh;

            // Taille fixe — adaptée au zoom initial 4
            const r = isCrit ? 5 : isHigh ? 4.5 : 4;

            const fillColor =
              isCrit ? "rgba(255,0,0,0.35)"    :
              isHigh ? "rgba(255,215,0,0.3)"   :
              isCon  ? "rgba(255,165,0,0.3)"   :
                       "rgba(40,60,100,0.5)";

            return (
              <Marker
                key={t.id}
                coordinates={coords}
                onClick={() => onTerritoryClick(t)}
                style={{ cursor: "pointer" }}
              >
                {/* Pulse ring */}
                {isActive && (
                  <motion.circle
                    r={r + 5}
                    fill="none"
                    stroke={t.color}
                    strokeWidth={0.5}
                    opacity={0.3}
                    animate={{ r: [r + 3, r + 8, r + 3], opacity: [0.4, 0.08, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                {/* Hexagone principal */}
                <motion.polygon
                  points={hexPoints(r)}
                  fill={fillColor}
                  stroke={t.borderColor}
                  strokeWidth={isCrit ? 1.5 : isHigh ? 1.2 : 0.8}
                  style={{
                    filter: `drop-shadow(0 0 ${isCrit ? 6 : isHigh ? 4 : 2}px ${t.glowColor})`,
                  }}
                  animate={isActive ? {
                    strokeWidth: isCrit ? [1.5, 2.2, 1.5] : [1.2, 1.8, 1.2],
                  } : {}}
                  transition={isActive
                    ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                    : {}}
                />

                {/* Nom territoire */}
                <text
                  y={-r - 2.5}
                  textAnchor="middle"
                  fill={t.color}
                  fontSize={isCrit ? 4 : 3.5}
                  fontWeight="800"
                  fontFamily="'Rajdhani', sans-serif"
                  letterSpacing="0.2"
                  style={{ userSelect: "none", pointerEvents: "none" }}
                >
                  {t.name}
                </text>

                {/* Couronne */}
                {isCon && (
                  <text
                    y={-r - 8}
                    textAnchor="middle"
                    fontSize="6"
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  >
                    👑
                  </text>
                )}

                {/* Point club */}
                {t.club && (
                  <circle r={1.2} cy={r + 2.5} fill={t.club.color} opacity={0.9}
                    style={{ pointerEvents: "none" }} />
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
