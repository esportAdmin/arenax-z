"use client";

const CONTINENTS = [
  "M120 154c42-28 108-40 170-20 31 10 64 29 79 57 9 15 5 34-15 45-25 14-57 15-78 30-26 19-20 50-33 74-18 31-72 33-97 11-20-18-19-47-33-69-20-32-40-89 7-128Z",
  "M346 103c32-16 77-24 113-11 39 13 83 42 96 79 8 23-9 44-24 62-21 26-21 57-28 88-7 30-44 53-74 43-33-11-41-48-61-74-20-26-68-34-78-69-12-41 17-96 56-118Z",
  "M548 136c59-24 156-34 214-15 44 15 91 42 107 82 17 44-20 88-59 111-35 21-73 23-110 36-46 16-93 58-138 34-48-27-35-91-32-137 2-43-34-91 18-111Z",
  "M667 306c42-19 99-25 141-6 48 22 84 63 86 108 2 40-25 77-63 98-52 28-123 41-178 17-52-24-66-88-39-137 18-34 18-60 53-80Z",
  "M430 356c28-14 63-16 91-7 37 12 73 41 76 77 4 40-31 68-68 82-40 15-90 18-121-7-29-24-21-67-10-99 8-23 10-36 32-46Z",
];

const WAR_POINTS = [
  { x: "17%", y: "34%" },
  { x: "46%", y: "25%" },
  { x: "54%", y: "33%" },
  { x: "73%", y: "27%" },
  { x: "83%", y: "64%" },
];

export default function BackgroundWorldMap() {
  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{ pointerEvents: "none", zIndex: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(rgba(0,217,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,217,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      <div
        className="absolute"
        style={{
          zIndex: 2,
          top: "-8%",
          left: "4%",
          right: "2%",
          bottom: "2%",
          opacity: 0.92,
        }}
      >
        <svg
          viewBox="0 0 900 560"
          className="h-full w-full"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="continent-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(176, 87, 255, 0.7)" />
              <stop offset="100%" stopColor="rgba(27, 231, 255, 0.75)" />
            </linearGradient>
            <radialGradient id="continent-fill" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="rgba(15, 31, 58, 0.98)" />
              <stop offset="100%" stopColor="rgba(7, 14, 30, 0.92)" />
            </radialGradient>
            <filter id="map-glow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {CONTINENTS.map((path, index) => (
            <path
              key={index}
              d={path}
              fill="url(#continent-fill)"
              stroke="url(#continent-stroke)"
              strokeWidth="2"
              filter="url(#map-glow)"
              opacity={0.94}
            />
          ))}
        </svg>
      </div>

      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        {WAR_POINTS.map((pt, i) => (
          <div key={i} className="absolute" style={{ left: pt.x, top: pt.y }}>
            <div
              className="absolute rounded-full bg-red-500 animate-ping"
              style={{
                width: 18,
                height: 18,
                top: -9,
                left: -9,
                opacity: 0.35,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "2s",
              }}
            />
            <div
              className="absolute rounded-full bg-red-500"
              style={{
                width: 6,
                height: 6,
                top: -3,
                left: -3,
                boxShadow: "0 0 8px 2px rgba(255,0,85,0.7)",
              }}
            />
          </div>
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{
          zIndex: 4,
          background:
            "linear-gradient(90deg, rgba(5,8,22,0.5) 0%, rgba(5,8,22,0.15) 38%, transparent 62%)",
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          zIndex: 4,
          height: "25%",
          background:
            "linear-gradient(to top, rgba(5,8,22,1) 0%, rgba(5,8,22,0.4) 60%, transparent 100%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          zIndex: 3,
          background:
            "radial-gradient(ellipse at 15% 70%, rgba(70,0,130,0.10) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
