interface WarFiltersProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedIntensity: string;
  setSelectedIntensity: (intensity: string) => void;
}

export default function WarFilters({
  selectedRegion,
  setSelectedRegion,
  selectedStatus,
  setSelectedStatus,
  selectedIntensity,
  setSelectedIntensity,
}: WarFiltersProps) {
  const regions = ["all", "global", "americas", "europe", "asia", "oceania", "africa", "arctic"];
  const statuses = ["all", "live", "upcoming", "ended"];
  const intensities = ["all", "extreme", "high", "medium"];

  return (
    <div className="mb-12 space-y-6">
      <h3 className="text-2xl font-bold text-center text-gray-300 mb-6">
        Filter Wars
      </h3>

      <div className="flex flex-wrap justify-center gap-6">
        {/* Region Filter */}
        <div className="space-y-2">
          <span className="block text-center text-gray-400 text-sm uppercase tracking-wide">
            Region
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                  selectedRegion === region
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                    : "bg-[#0a1628]/60 text-gray-400 border border-red-500/20 hover:border-red-500/40"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <span className="block text-center text-gray-400 text-sm uppercase tracking-wide">
            Status
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                  selectedStatus === status
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                    : "bg-[#0a1628]/60 text-gray-400 border border-orange-500/20 hover:border-orange-500/40"
                }`}
              >
                {status === "live" && "🔴 "}
                {status === "upcoming" && "🟡 "}
                {status === "ended" && "⚫ "}
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity Filter */}
        <div className="space-y-2">
          <span className="block text-center text-gray-400 text-sm uppercase tracking-wide">
            Intensity
          </span>
          <div className="flex flex-wrap gap-2 justify-center">
            {intensities.map((intensity) => (
              <button
                key={intensity}
                onClick={() => setSelectedIntensity(intensity)}
                className={`px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                  selectedIntensity === intensity
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/50"
                    : "bg-[#0a1628]/60 text-gray-400 border border-yellow-500/20 hover:border-yellow-500/40"
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
