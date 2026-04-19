"use client";

import { Search } from "lucide-react";

import { regionFilters, statusFilters, type ClubRegion, type ClubStatus } from "./data";

interface ClubFiltersProps {
  onQueryChange: (value: string) => void;
  onRegionChange: (value: ClubRegion | "All") => void;
  onStatusChange: (value: ClubStatus | "All") => void;
  query: string;
  region: ClubRegion | "All";
  status: ClubStatus | "All";
}

/**
 * Renders search and filter controls for the club directory.
 *
 * Example:
 * ```tsx
 * <ClubFilters query="" region="All" status="Recruiting" onQueryChange={fn} onRegionChange={fn} onStatusChange={fn} />
 * ```
 */
export function ClubFilters({
  onQueryChange,
  onRegionChange,
  onStatusChange,
  query,
  region,
  status,
}: ClubFiltersProps) {
  return (
    <section className="space-y-4">
      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-2xl border border-cyan-300/36 bg-slate-950/78 px-4 py-3 shadow-[0_0_30px_rgba(34,211,238,0.18)]">
        <Search className="h-5 w-5 text-cyan-200" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search clubs by name..."
          className="h-10 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-3 text-center">
        <FilterRow
          active={region}
          label="Region"
          onChange={onRegionChange}
          options={regionFilters}
        />
        <FilterRow
          active={status}
          label="Status"
          onChange={onStatusChange}
          options={statusFilters}
        />
      </div>
    </section>
  );
}

/**
 * Renders a pill filter row.
 *
 * Example:
 * ```tsx
 * <FilterRow label="Region" active="All" options={["All"]} onChange={fn} />
 * ```
 */
function FilterRow<T extends string>({
  active,
  label,
  onChange,
  options,
}: {
  active: T;
  label: string;
  onChange: (value: T) => void;
  options: readonly T[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="mr-1 text-sm font-semibold text-slate-300">{label}:</span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition-colors ${
            active === option
              ? "border-cyan-300/45 bg-cyan-300/18 text-cyan-100"
              : "border-white/12 bg-white/[0.04] text-slate-300 hover:bg-white/[0.075]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
