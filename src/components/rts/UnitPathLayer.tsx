"use client";

import { Line, Marker } from "react-simple-maps";

interface PathNode {
  territoryId: string;
  lat: number;
  lng: number;
}

interface Props {
  paths: PathNode[][];
}

export default function UnitPathLayer({ paths }: Props) {
  return (
    <>
      {paths.map((path, pathIndex) => {
        if (!path || path.length < 2) return null;

        return (
          <g key={`path-${pathIndex}`}>
            {path.map((node, index) => {
              if (index === path.length - 1) return null;

              const next = path[index + 1];

              return (
                <Line
                  key={`${node.territoryId}-${next.territoryId}-${index}`}
                  from={[node.lng, node.lat]}
                  to={[next.lng, next.lat]}
                  stroke="#22d3ee"
                  strokeWidth={2}
                  strokeOpacity={0.7}
                  strokeLinecap="round"
                />
              );
            })}

            {path.map((node) => (
              <Marker
                key={`node-${pathIndex}-${node.territoryId}`}
                coordinates={[node.lng, node.lat]}
              >
                <circle r={2.5} fill="#22d3ee" opacity={0.9} />
              </Marker>
            ))}
          </g>
        );
      })}
    </>
  );
}
