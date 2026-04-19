"use client";

export default function CaptureEffect({
  active,
  color,
}: {
  active: boolean;
  color: string;
}) {
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
      <div className="absolute inset-0 animate-ping rounded-full bg-white/25" />

      <div
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 animate-pulse rounded-full border border-white/20" />

      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-2xl" />
    </div>
  );
}
