"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import { useGlobalWarMap } from "@/hooks/useGlobalWarMap";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMapAAA() {
  const { territories } = useGlobalWarMap();

  const [position, setPosition] = useState({
    coordinates: [0, 0],
    zoom: 1,
  });

  function handleZoomIn() {
    setPosition((pos) => ({
      ...pos,
      zoom: pos.zoom * 1.5,
    }));
  }

  function handleZoomOut() {
    setPosition((pos) => ({
      ...pos,
      zoom: pos.zoom / 1.5,
    }));
  }

  function getColor(geo: any) {
    const territory = territories.find((t: any) => t.name === geo.properties.name);

    if (!territory) return "#1f2937";

    if (!territory.controlling_club_id) return "#6b7280";

    return "#3b82f6";
  }

  return (
    <div className="relative">
      <ComposableMap projection="geoMercator" width={1000} height={500}>
        <ZoomableGroup zoom={position.zoom} center={position.coordinates}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(geo)}
                  stroke="#111"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#f97316" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="bg-black text-white px-3 py-1 rounded"
        >
          +
        </button>

        <button
          onClick={handleZoomOut}
          className="bg-black text-white px-3 py-1 rounded"
        >
          -
        </button>
      </div>
    </div>
  );
}
