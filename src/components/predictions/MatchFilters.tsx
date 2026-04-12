"use client";

import type { ReactNode } from "react";
import { Calendar, CheckCircle, Gamepad2, Radio, Search, Sparkles } from "lucide-react";

import { CountdownPill } from "@/components/engagement/CountdownPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getNextUtcMidnight } from "@/lib/countdown";

type FilterType = "all" | "live" | "upcoming" | "finished";

interface MatchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const MatchFilters = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: MatchFiltersProps) => {
  const filters: { id: FilterType; label: string; icon: ReactNode }[] = [
    { id: "all", label: "All", icon: <Gamepad2 className="h-4 w-4" /> },
    { id: "live", label: "Live", icon: <Radio className="h-4 w-4" /> },
    { id: "upcoming", label: "Upcoming", icon: <Calendar className="h-4 w-4" /> },
    { id: "finished", label: "Finished", icon: <CheckCircle className="h-4 w-4" /> },
  ];

  return (
    <div className="section-shell space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="eyebrow-badge">
            <Sparkles className="h-4 w-4 text-primary" />
            Match discovery
          </div>
          <h3 className="mt-3 text-2xl font-display font-bold text-white">
            Filter toward the next meaningful decision
          </h3>
        </div>
        <CountdownPill label="Reset" target={getNextUtcMidnight()} tone="cyan" />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search teams, tournaments, or narratives..."
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-12 border-white/10 bg-black/20 pl-12 text-base"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "glass" : "ghost"}
              onClick={() => onFilterChange(filter.id)}
              className={`gap-2 whitespace-nowrap ${
                activeFilter === filter.id
                  ? "ring-1 ring-primary/50"
                  : "hover:bg-white/5"
              }`}
            >
              {filter.icon}
              {filter.label}
              {filter.id === "live" ? (
                <span className="relative ml-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive" />
                </span>
              ) : null}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
