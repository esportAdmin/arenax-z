"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import { useMemo, useState } from "react";

import { useGlobalWarMap, Territory } from "@/hooks/useGlobalWarMap";
import { useAttackableTerritories } from "@/hooks/useAttackableTerritories";
import { useMyClub } from "@/hooks/useMyClub";

const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json";

type TerritoryWithCoords = Territory & {
  longitude?: number;
  latitude?: number;
};

const TERRITORY_COORDS: Record<
  string,
  { longitude: number; latitude: number }
> = {
  france: { longitude: 2.2137, latitude: 46.2276 },
  germany: { longitude: 10.4515, latitude: 51.1657 },
  spain: { longitude: -3.7038, latitude: 40.4168 },
  uk: { longitude: -0.1276, latitude: 51.5072 },
  italy: { longitude: 12.4964, latitude: 41.9028 },
};

export default function EuropeWarMapSVG() {
  const { territories } = useGlobalWarMap();

  const myClubId = useMyClub();

  // FIX TS null → undefined
  const attackable = useAttackableTerritories(myClubId ?? undefined);

  const [selected, setSelected] = useState<Territory | null>(null);

  const enrichedTerritories: TerritoryWithCoords[] = useMemo(() => {
    return territories.map((t) => {
      const coords = TERRITORY_COORDS[t.name.toLowerCase()];

      return {
        ...t,
        longitude: coords?.longitude,
        latitude: coords?.latitude,
      };
    });
  }, [territories]);

  function isAttackable(id: string) {
    return attackable.some((t) => t.territory_id === id);
  }

  function getColor(t?: Territory) {
    if (!t) return "#6b7280";

    if (t.controlling_club_id === myClubId) return "#3b82f6"; // ton club

    if (isAttackable(t.id)) return "#ef4444"; // attaquable

    if (t.controlling_club_id) return "#9ca3af"; // ennemi

    return "#6b7280"; // neutre
  }

  async function invade(territory: Territory) {
    if (!myClubId) return;

    const res = await fetch("/api/territories/invade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clubId: myClubId,
        territoryId: territory.id,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    alert("War started!");
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* MAP */}

      <div className="bg-slate-900 rounded-xl p-4">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 600,
            center: [10, 52],
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const territory = enrichedTerritories.find(
                  (t) =>
                    t.name.toLowerCase() === geo.properties.name?.toLowerCase(),
                );

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getColor(territory)}
                    stroke="#0f172a"
                    strokeWidth={0.5}
                    onClick={() => {
                      if (territory) setSelected(territory);
                    }}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "#f97316", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {enrichedTerritories
            .filter((t) => t.longitude && t.latitude)
            .map((territory) => (
              <Marker
                key={territory.id}
                coordinates={[territory.longitude!, territory.latitude!]}
                onClick={() => setSelected(territory)}
              >
                <circle
                  r={6}
                  fill={
                    territory.controlling_club_id === myClubId
                      ? "#3b82f6"
                      : isAttackable(territory.id)
                        ? "#ef4444"
                        : "#9ca3af"
                  }
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              </Marker>
            ))}
        </ComposableMap>
      </div>

      {/* PANEL */}

      <div className="glass-card p-6">
        {selected ? (
          <>
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>

            <p className="text-sm text-muted-foreground mb-4">
              Controlled by: {selected.clubs?.name ?? "Unclaimed"}
            </p>

            {isAttackable(selected.id) && (
              <button
                onClick={() => invade(selected)}
                className="bg-orange-500 px-4 py-2 rounded-lg text-white hover:bg-orange-600"
              >
                Invade Territory
              </button>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">Select a territory</p>
        )}
      </div>
    </div>
  );
}
