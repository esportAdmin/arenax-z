export default function WarHeader() {
  return (
    <div className="text-center mb-16">
      <div className="inline-block mb-4">
        <div className="flex items-center gap-3 px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-500 text-sm font-mono uppercase tracking-wider">
            Live Battles Worldwide
          </span>
        </div>
      </div>

      <h1 className="text-6xl lg:text-7xl font-extrabold mb-6">
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">
          ACTIVE WARS
        </span>
      </h1>

      <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
        Watch epic battles unfold in real-time. Join the fight. Claim victory.
        Conquer territories across the globe.
      </p>
    </div>
  );
}
