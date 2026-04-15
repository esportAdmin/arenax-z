import dynamic from "next/dynamic";

const LiveWarMapInner = dynamic(() => import("./LiveWarMapInner"), {
  ssr: false,
  loading: () => (
    <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-xl border border-orange-500/20 bg-gradient-to-br from-[#0a1628]/90 to-[#0a1628]/60 backdrop-blur-sm">
      <span className="text-sm tracking-widest text-gray-500">Loading map...</span>
    </div>
  ),
});

export default function LiveWarMap() {
  return (
    <div className="mb-12">
      <div className="mb-6 text-center">
        <h2 className="mb-2 bg-gradient-to-r from-orange-300 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent">
          Global war map
        </h2>
        <p className="text-gray-400">Real-time territory pressure and rally locations.</p>
      </div>

      <LiveWarMapInner />
    </div>
  );
}
