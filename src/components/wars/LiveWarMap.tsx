import dynamic from "next/dynamic";

const LiveWarMapInner = dynamic(() => import("./LiveWarMapInner"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-[#0a1628]/90 to-[#0a1628]/60 backdrop-blur-sm border border-red-500/20 rounded-xl overflow-hidden flex items-center justify-center">
      <span className="text-gray-500 text-sm tracking-widest">Loading map…</span>
    </div>
  ),
});

export default function LiveWarMap() {
  return (
    <div className="mb-12">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
          🌍 GLOBAL WAR MAP
        </h2>
        <p className="text-gray-400">Real-time battle locations</p>
      </div>

      <LiveWarMapInner />
    </div>
  );
}
