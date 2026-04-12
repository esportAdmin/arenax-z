"use client";

interface Trail {
  points: [number, number][];
}

interface Props {
  trails: Trail[];
}

export default function MovementTrailLayer({ trails }: Props) {
  return (
    <>
      {trails.map((trail, i) =>
        trail.points.map((p, j) => (
          <div
            key={`${i}-${j}`}
            className="absolute pointer-events-none"
            style={{
              left: p[0],
              top: p[1],
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: "#22d3ee",
              opacity: 0.3,
            }}
          />
        )),
      )}
    </>
  );
}
