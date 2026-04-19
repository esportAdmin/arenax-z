"use client";

import { Geography } from "react-simple-maps";

interface Territory {
  id: string;
  country_code: string;
  owner_club_id: string;
  club_color: string;
}

interface TerritoryLayerProps {
  geography: any;
  territories: Territory[];
}

export default function TerritoryLayer({
  geography,
  territories,
}: TerritoryLayerProps) {
  const territory = territories.find(
    (t) => t.country_code === geography.properties.ISO_A2,
  );

  return (
    <Geography
      geography={geography}
      fill={territory ? territory.club_color : "#1a1e3f"}
      stroke="#00d9ff"
      strokeWidth={0.5}
      className="hover:brightness-125 transition-all duration-300 cursor-pointer outline-none"
      style={{
        default: { outline: "none" },
        hover: {
          outline: "none",
          filter: "brightness(1.3)",
        },
        pressed: { outline: "none" },
      }}
    />
  );
}
